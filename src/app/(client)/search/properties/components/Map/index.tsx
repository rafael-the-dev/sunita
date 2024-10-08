import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import classNames from "classnames"
import { Marker, Popup, TileLayer } from "react-leaflet"
import currency from "currency.js"
import { LatLng } from "leaflet"

import styles from "./styles.module.css"

import { TABS } from "../Tabs/components/Tab/types"

import { StoresContext } from "../../context"

import useTab from "../Tabs/hooks/useTab"

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
    const { getProperties } = useContext(StoresContext);

    const [ userLocation, setUserLocation ] = useState<MarkerType>(null);

    const markers: MarkerType[] = useMemo(
        () => {
            const list = getProperties().map(property => {
                return {
                    description: property.type as string, 
                    id: property.id,//currency(property?.address?.cords?.lat).add(property?.address?.cords?.long).value,
                    cords: {
                        lat: property?.address?.cords?.lat,
                        long: property?.address?.cords?.long
                    } 
                }
            });

            if(userLocation) list.push(userLocation);
            
            return list;
        },
        [ getProperties, userLocation ]
    )

    const getCenter = useCallback(
        () => {
            const properties = getProperties() ?? [];

            const evaluatedLocations: number[] = [];
            const isEmpty = properties.length === 0;

            if(isEmpty && Boolean(userLocation)) return new LatLng(userLocation.cords.lat, userLocation.cords.long);

            if(isEmpty) return new LatLng(51.505, -0.09);// London coordinates

            const { lat, lng } = properties.reduce(
                (prevValue, property) => {
                    const newLocation = currency(property.address.cords.lat).add(property.address.cords.long).value;

                    if(evaluatedLocations.includes(newLocation)) return prevValue;

                    evaluatedLocations.push(newLocation);

                    return {
                        lat: currency(property.address.cords.lat).add(prevValue.lat).value,
                        lng: currency(property.address.cords.long).add(prevValue.lng).value
                    }
                },
                { lat: 0, lng: 0 }
            );

            const avgLat = currency(lat).divide(properties.length).value;
            const avgLng = currency(lng).divide(properties.length).value;

            return new LatLng(avgLat, avgLng);
        },
        [ getProperties, userLocation ]
    )

    const { isActive } = useTab();

    useEffect(
        () => {
            onGettingUserLocation(
                (lat, long) => {
                    setUserLocation({ 
                        description: "Your location", 
                        id: getId(),
                        cords: {
                            lat,
                            long
                        } 
                    })
                }
            )
        },
        []
    )

    if(!isActive(TABS.MAP)) return <></>;

    return (
        <div className={classNames(styles.mapContainer)}>
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