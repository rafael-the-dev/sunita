import { useEffect, useState } from "react"
import classNames from "classnames"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

import styles from "./styles.module.css"

import { getId } from "@/helpers/id"
import { onGettingUserLocation } from "@/helpers/location"

type MarkerType = {
    description: string,
    id: string,
    cords: {
        lat: number,
        long: number
    }
}

const PropertyMap = () => {
    const [ markers, setMarkers ] = useState<MarkerType[]>([])

    useEffect(
        () => {
            onGettingUserLocation(
                (lat, long) => setMarkers(markers => {
                    console.log(lat, long)
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
                center={[ -25.8998272, 32.5615616 ]} 
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
                                <Popup>
                                    { marker.description }
                                </Popup>
                            </Marker>
                        )
                    )
                }
            </MapContainer>
        </div>
    )
}

export default PropertyMap