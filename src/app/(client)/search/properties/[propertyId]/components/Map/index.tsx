import { useCallback,useContext, useEffect, useState } from "react"
import classNames from "classnames"
import { Marker, Popup, TileLayer } from "react-leaflet"
import { LatLng } from "leaflet"

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
    const { property } = useContext(PropertyContext);

    const [ markers, setMarkers ] = useState<MarkerType[]>(
        () => {
            if(property && property.address) return [
                {
                    description: property.type, 
                    id: property.id,
                    cords: {
                        lat: property.address?.cords?.lat,
                        long: property.address?.cords?.long
                    } 
                }
            ];

            return []
        }
    )

    const getCenter = useCallback(
        () => {
            const isEmpty = !Boolean(property);

            if(isEmpty) {
                const userLocation = markers.find(marker => marker.description === "Your location");

                if(userLocation) return new LatLng(userLocation.cords.lat, userLocation.cords.long);

                return new LatLng(51.505, -0.09);// London coordinates
            }

            return new LatLng(property.address?.cords?.lat, property.address?.cords?.long);
        },
        [ markers, property ]
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
                center={getCenter()} 
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