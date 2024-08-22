import { FormEvent, useContext, useMemo, useRef } from "react"
import currency from "currency.js"
import classNames from "classnames"

import styles from "./styles.module.css"

import { PROPERTY_TYPE, PropertyType } from "@/types/property"
import { ROOM_TYPE, RoomType } from "@/types/room"

import { LoginContext } from "@/context/LoginContext"
import { FixedTabsContext } from "@/context/FixedTabsContext"
import { RoomsContext } from "@/app/stores/[storeId]/rooms/context"

import useFetch from "@/hooks/useFetch"
import useForm from "./hooks/useForm"

import { getList } from "@/helpers"

import Alert from "@/components/alert"
import Amenities from "./components/Amenities"
import Button from "@/components/shared/button"
import Legend from "@/components/shared/Legend"
import PropertyImage from "@/components/shared/ImageForm"
import Select from "@/components/shared/combobox"
import Row from "@/components/Form/RegisterUser/components/Row"
import Textfield from "@/components/Textfield"

const propertiesList = getList(PROPERTY_TYPE)
const bedRoomTypesList = getList(ROOM_TYPE)

const RoomsForm = () => {
    const { credentials } = useContext(LoginContext);
    const { getDialog } = useContext(FixedTabsContext);
    const { fetchRooms } = useContext(RoomsContext)
    
    const room = getDialog().current.payload as RoomType;

    const { fetchData, loading  } = useFetch(
        {
            autoFetch: false,
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/rooms${ room ? `/${room.id}` : ""}`
        }
    );

    const {
        input,

        addAmenity, addImage,
        changePrice, changePropertyType,
        changeQuantity,
        changeType,
        removeAmenity, removeImage,
        resetForm
    } = useForm()

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

    const bedRoomDetailsMemo = useMemo(
        () => (
            <Legend>
                Bed room details
            </Legend>
        ),
        []
    );

    const priceLengendMemo = useMemo(
        () => (
            <Legend>
                Price
            </Legend>
        ),
        []
    )

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(loading) return;

        onCloseAlert.current?.();

        const newRoom: PropertyType = {
            address: null,
            availability: null,
            amenities: input.amenities,
            bedroom: {
                quantity: currency(input.bedRoom.quantity.value).value,
                status: null,
                type: input.bedRoom.type.value
            },
            description: null,
            house: null,
            id: null,
            images: null,
            name: null,
            owner: null,
            price: {
                daily: currency(input.price.day.value).value,
                hourly: currency(input.price.day.value).value,
                night: currency(input.price.day.value).value
            },
            size: parseInt(input.bedRoom.quantity.value),
            status: null,
            type: input.propertyType.value as PROPERTY_TYPE
        };

        await fetchData(
            {
                options: {
                    body: JSON.stringify(newRoom),
                    method: room ? "PUT" : "POST"
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

                    resetForm()
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
                    <PropertyImage 
                        addImage={addImage}
                        list={input.images}
                        removeImage={removeImage}
                    />
                    <Row>
                        <Textfield
                            { ...input.bedRoom.quantity }
                            className="mb-0 w-full sm:w-1/2"
                            label="Name"
                            onChange={changeQuantity}
                            placeholder="Insert bed room name" 
                            required
                        />
                        <Select
                            { ...input.propertyType } 
                            className="mb-0 w-full sm:w-1/2"
                            label="Property type"
                            list={propertiesList}
                            onChange={changePropertyType}
                        />
                    </Row>
                    { 
                        input.propertyType.value === PROPERTY_TYPE.BED_ROOM && (
                            <fieldset>
                                { bedRoomDetailsMemo }
                                <Row>
                                    <Textfield
                                        { ...input.bedRoom.quantity }
                                        className="mb-0 w-full sm:w-1/2"
                                        label="Quantity"
                                        onChange={changeQuantity}
                                        placeholder="Insert number of rooms" 
                                        required
                                        type="number"
                                    />
                                    <Select
                                        { ...input.bedRoom.type } 
                                        className="mb-0 w-full sm:w-1/2"
                                        label="Type"
                                        list={bedRoomTypesList}
                                        onChange={changeType}
                                    />
                                </Row>
                            </fieldset>
                        )
                    }
                    <Amenities 
                        list={input.amenities}
                        onInsert={addAmenity}
                        onRemove={removeAmenity}
                    />
                    <fieldset>
                        { priceLengendMemo }
                        <Row>
                            <Textfield
                                { ...input.price.hour }
                                className="mb-0 w-full sm:w-1/3"
                                label="Price per hour"
                                onChange={changePrice("hour")}
                                placeholder="Insert price per hour" 
                                required
                            />
                            <Textfield
                                { ...input.price.night }
                                className="mb-0 w-full sm:w-1/3"
                                label="Price per night"
                                onChange={changePrice("night")}
                                placeholder="Insert price per night" 
                                required
                            />
                            <Textfield
                                { ...input.price.day }
                                className="mb-0 w-full sm:w-1/3"
                                label="Price per day"
                                onChange={changePrice("day")}
                                placeholder="Insert price per day" 
                                required
                            />
                        </Row>
                    </fieldset>
                    <Textfield 
                        className="mt-2"
                        label="Description"
                        multiline
                        minRows={4}
                    />
                </div>
            </div>
            <div className="flex flex-col items-stretch justify-end mt-8 sm:flex-row ">
                { 
                     <Button
                        className="py-2"
                        type="submit">
                        { loading ? "Loading..." : ( room ? "Update" : "Submit" ) }
                    </Button>
                }
            </div>
        </form>
    )
}

export default RoomsForm