import { useCallback, useEffect, useRef, useState } from "react"
import classNames from "classnames"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

import styles from "./styles.module.css"

import { getId } from "@/helpers/id"
import { onGettingUserLocation } from "@/helpers/location"

import Button from "@/components/shared/button"
import MapHandlers from "./MapHandlers"

type MarkerType = {
    description: string,
    id: string,
    cords: {
        lat: number,
        long: number
    }
}

type PropsType = {
    onLocationFound: (lat: number, long: number) => void
}

const AddressMap = ({ onLocationFound }: PropsType) => {
    const [ marker, setMarker ] = useState<MarkerType>(null)

    const onLocateRef = useRef<() => void>(null)

    const clickHandler = useCallback(
        () => onLocateRef.current?.(),
        []
    )

    useEffect(
        () => {
            onGettingUserLocation(
                (lat, long) => setMarker(
                    { 
                        description: "Your location", 
                        id: getId(),
                        cords: {
                            lat,
                            long
                        } 
                    }
                )
            )
        },
        []
    )

    return (
        <div>
            <div className={classNames(styles.mapContainer)}>
                <MapContainer 
                    center={[ -25.8998272, 32.5615616 ]} 
                    zoom={13} 
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%"}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        marker && (
                            <Marker 
                                key={marker.id}
                                position={[ marker.cords.lat, marker.cords.long ]}>
                                <Popup>
                                    { marker.description }
                                </Popup>
                            </Marker>
                        )
                    }
                    <MapHandlers onLocateRef={onLocateRef} onLocationFound={onLocationFound} />
                </MapContainer>
            </div>
            <Button
                className="block mx-auto mt-6 py-2"
                onClick={clickHandler}>
                Locate Me
            </Button>
        </div>
    )
}

export default AddressMap