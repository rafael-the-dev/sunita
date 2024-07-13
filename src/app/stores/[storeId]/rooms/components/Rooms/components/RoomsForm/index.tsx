import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import currency from "currency.js"
import classNames from "classnames"

import styles from "./styles.module.css"

import { ROOM_TYPE, RoomType } from "@/types/room"

import { LoginContext } from "@/context/LoginContext"

import { isInvalidNumber } from "@/helpers/validation"
import useFetch from "@/hooks/useFetch"

import Alert from "@/components/alert"
import Button from "@/components/shared/button"
import Select from "@/components/shared/combobox"
import Row from "@/components/Form/RegisterUser/components/Row"
import Textfield from "@/components/Textfield"
import { FetchDataFuncType } from "@/hooks/useFetch/types"

type PropsType = {
    fetchRooms: FetchDataFuncType;
}

const initialInput  = {
    error: false,
    helperText: "",
    value: ""
}

const initial = {
    dailyPrice: structuredClone(initialInput), 
    hourlyPrice: structuredClone(initialInput),
    quantity: structuredClone(initialInput),
    type: structuredClone({ ...initialInput, value: ROOM_TYPE.SINGLE })
}

const RoomsForm = ({ fetchRooms }: PropsType) => {
    const { credentials } = useContext(LoginContext);

    const { fetchData, loading  } = useFetch(
        {
            autoFetch: false,
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/rooms`
        }
    );

    const [ input, setInput ] = useState(initial);

    const alertProps = useRef(
        {
            description: "",
            severity: "",
            title: ""
        }
    );

    const onCloseAlert = useRef<() => void>(null);
    const onOpenAlert = useRef<() => void>(null);

    const alert = useMemo(
        () => (
            <Alert 
                { ...alertProps.current }
                className={ loading ? "" : "mb-4" }
                onClose={onCloseAlert}
                onOpen={onOpenAlert}
            />
        ),
        [ loading ]
    );

    const list = useMemo(
        () => Object
            .values(ROOM_TYPE)
            .map(
                item => ({
                    label: item.replaceAll("-", ""),
                    value: item
                })
            ),
        []
    );

    const changeQuantity = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            const quantity = parseInt(value);

            const isInvalid = isInvalidNumber(quantity, 1);

            const helperText = isInvalid ? "Invalid number" : "";

            setInput(
                input => ({
                    ...input,
                    quantity: {
                        error: isInvalid,
                        helperText,
                        value
                    }
                })
            );
        },
        []
    );

    const changePrice = useCallback(
        (key: "dailyPrice" | "hourlyPrice") => (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            const price = currency(value).value;

            const isInvalid = isInvalidNumber(price, 1);
            
            const helperText = isInvalid ? "Invalid price" : "";

            setInput(
                input => ({
                    ...input,
                    [key]: {
                        error: isInvalid,
                        helperText,
                        value
                    }
                })
            );
        },
        []
    );

    const changeType = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value  = e.target.value as ROOM_TYPE;

            setInput(
                input => ({
                    ...input,
                    type: {
                        error: false,
                        helperText: "",
                        value
                    }
                })
            );
        },
        []
    );

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(loading) return;

        onCloseAlert.current?.();

        const room: RoomType = {
            dailyPrice: currency(input.dailyPrice.value).value,
            hourlyPrice: currency(input.hourlyPrice.value).value,
            id: "",
            quantity: parseInt(input.quantity.value),
            status: null,
            type: input.type.value as ROOM_TYPE
        };

        await fetchData(
            {
                options: {
                    body: JSON.stringify(room),
                    method: "POST"
                },
                onError(error) {
                    alertProps.current = {
                        description: error.message,
                        severity: "error",
                        title: "Error"
                    }
                },
                async onSuccess(res, data) {
                    alertProps.current = {
                        description: "Room was successfully registered.",
                        severity: "success",
                        title: "Success"
                    };

                    fetchRooms && await fetchRooms({});

                    setInput(structuredClone(initial));
                },
            }
       );

       onOpenAlert.current?.();
    }

    return (
        <form 
            className={classNames(styles.form, `flex flex-col justify-between h-full px-3 py-4`)}
            onSubmit={submitHandler}>
            <div>
                <div className="flex flex-col gap-y-4">
                    { alert }
                    <Row>
                        <Select
                            { ...initial.type } 
                            className="mb-0 w-full sm:w-1/2"
                            label="Type"
                            list={list}
                            onChange={changeType}
                        />
                        <Textfield
                            { ...input.quantity }
                            className="mb-0 w-full sm:w-1/2"
                            label="Quantity"
                            onChange={changeQuantity}
                            placeholder="Insert number of rooms" 
                            required
                            type="number"
                        />
                    </Row>
                    <Row>
                        <Textfield
                            { ...input.hourlyPrice }
                            className="mb-0 w-full sm:w-1/2"
                            label="Hourly price"
                            onChange={changePrice("hourlyPrice")}
                            placeholder="Insert hourly price" 
                            required
                        />
                        <Textfield
                            { ...input.dailyPrice }
                            className="mb-0 w-full sm:w-1/2"
                            label="Daily price"
                            onChange={changePrice("dailyPrice")}
                            placeholder="Insert daily price" 
                            required
                        />
                    </Row>
                </div>
            </div>
            <div className="flex flex-col items-stretch justify-end sm:flex-row ">
                <Button
                    className="py-2"
                    type="submit">
                    { loading ? "Loading..." : "Submit" }
                </Button>
            </div>
        </form>
    )
}

export default RoomsForm