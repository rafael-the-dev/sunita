import { useContext, useEffect, useState } from "react"
import classNames from "classnames"
import { Marker, Popup, TileLayer } from "react-leaflet"

import styles from "./styles.module.css"

import { PropertyContext } from "@/context/PropertyContext"

import { getId } from "@/helpers/id"
import { onGettingUserLocation } from "@/helpers/location"

import MapContainer from "@/components/Map"

type MarkerType = {
    description: string,
    id: string,
    cords: {
        lat: number,
        long: number
    }
}

const PropertyMap = () => {
    const { property } = useContext(PropertyContext)

    const [ markers, setMarkers ] = useState<MarkerType[]>(
        () => {
            if(property && property.address) return [
                {
                    description: "", 
                    id: getId(),
                    cords: {
                        lat: property.address?.cords?.lat,
                        long: property.address?.cords?.long
                    } 
                }
            ]

            return []
        }
    )

    useEffect(
        () => {
            onGettingUserLocation(
                (lat, long) => setMarkers(markers => {
                    return [
                        ...markers, 
                        { 
                            description: "Your location", 
                            id: getId(),
                            cords: {
                                lat,
                                long
                            } 
                        }
                    ]
                }
            ))
        },
        []
    )

    return (
        <div className={classNames(styles.mapContainer, `mt-8 xl:mt-0`)}>
            <MapContainer 
                center={[ property?.address?.cords?.lat, property?.address?.cords?.long ]} 
                zoom={13} 
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%"}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    markers.map(
                        marker => (
                            <Marker 
                                key={marker.id}
                                position={[ marker.cords.lat, marker.cords.long ]}>
                                    { marker.description && (
                                        <Popup>
                                            { marker.description }
                                        </Popup>
                                    )}
                            </Marker>
                        )
                    )
                }
            </MapContainer>
        </div>
    )
}

export default PropertyMap