import { FormEvent, useContext, useEffect, useMemo, useRef } from "react"
import currency from "currency.js"
import classNames from "classnames"

import styles from "./styles.module.css"

import {LANGUAGE} from "@/types/language"
import { PROPERTY_TYPE, PropertyType } from "@/types/property"
import { ROOM_TYPE } from "@/types/room"

import { LoginContext } from "@/context/LoginContext"
import { FixedTabsContext } from "@/context/FixedTabsContext"
import { RoomsContext } from "@/app/stores/[storeId]/rooms/context"

import lang from "./lang.json"

import useFetch from "@/hooks/useFetch"
import useForm from "./hooks/useForm"
import useLanguage from "@/hooks/useLanguage"

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

    const { language } = useLanguage()
    
    const property = getDialog().current.payload as PropertyType;
    const hasPayload = Boolean(property)

    const descriptionInputRef = useRef<HTMLTextAreaElement>(null)

    const { fetchData, loading  } = useFetch(
        {
            autoFetch: false,
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/properties${ hasPayload ? `/${property.id}` : ""}`
        }
    );

    const {
        input,

        addAmenity, addImage,
        changeName,
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
                { lang["bedroom"]["label"][language] }
            </Legend>
        ),
        [ language ]
    );

    const priceLengendMemo = useMemo(
        () => (
            <Legend>
                { lang["price"]["label"][language] }
            </Legend>
        ),
        [ language ]
    )

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(loading) return;

        onCloseAlert.current?.();

        const newProperty: PropertyType = {
            address: null,
            availability: null,
            amenities: input.amenities,
            bedroom: {
                quantity: currency(input.bedRoom.quantity.value).value,
                type: input.bedRoom.type.value
            },
            description: descriptionInputRef.current.value,
            house: null,
            id: null,
            images: input.images,
            name: input.name.value,
            owner: null,
            price: {
                daily: currency(input.price.day.value).value,
                hourly: currency(input.price.hour.value).value,
                night: currency(input.price.night.value).value
            },
            //size: parseInt(input.bedRoom.quantity.value),
            status: null,
            type: input.propertyType.value as PROPERTY_TYPE
        };

        await fetchData(
            {
                options: {
                    body: JSON.stringify(newProperty),
                    method: hasPayload ? "PUT" : "POST"
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
                        description: lang["alert"]["success"][hasPayload ? "update" : "register"][language],
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

    useEffect(
        () => {
            if(hasPayload) {
                descriptionInputRef.current.value = property.description
            }
        },
        [ hasPayload, property ]
    )

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
                            { ...input.name }
                            className="mb-0 w-full sm:w-1/2"
                            label={lang["name"]["label"][language]}
                            onChange={changeName}
                            placeholder={lang["name"]["placeholder"][language]}
                            required
                        />
                        <Select
                            { ...input.propertyType } 
                            className="mb-0 w-full sm:w-1/2"
                            label={lang["type"][language]}
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
                                        label={lang["bedroom"]["quantity"]["label"][language]}
                                        onChange={changeQuantity}
                                        placeholder={lang["bedroom"]["quantity"]["placeholder"][language]} 
                                        required
                                        type="number"
                                    />
                                    <Select
                                        { ...input.bedRoom.type } 
                                        className="mb-0 w-full sm:w-1/2"
                                        label={lang["bedroom"]["type"][language]}
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
                                label={lang["price"]["hour"]["label"][language]}
                                onChange={changePrice("hour")}
                                placeholder={lang["price"]["hour"]["placeholder"][language]} 
                                required
                            />
                            <Textfield
                                { ...input.price.night }
                                className="mb-0 w-full sm:w-1/3"
                                label={lang["price"]["night"]["label"][language]}
                                onChange={changePrice("night")}
                                placeholder={lang["price"]["night"]["placeholder"][language]}
                                required
                            />
                            <Textfield
                                { ...input.price.day }
                                className="mb-0 w-full sm:w-1/3"
                                label={lang["price"]["day"]["label"][language]}
                                onChange={changePrice("day")}
                                placeholder={lang["price"]["day"]["placeholder"][language]}
                                required
                            />
                        </Row>
                    </fieldset>
                    <Textfield 
                        className="mt-2"
                        inputRef={descriptionInputRef}  
                        label={lang["description"][language]}
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
                        { loading ? "Loading..." : ( hasPayload ? lang["buttons"]["update"][language] : lang["buttons"]["submit"][language] ) }
                    </Button>
                }
            </div>
        </form>
    )
}

export default RoomsForm