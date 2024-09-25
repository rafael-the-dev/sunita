import { MutableRefObject, useEffect } from "react"
import { useMapEvents } from "react-leaflet"

type PropsType = {
    onLocateRef: MutableRefObject<() => void>,
    onLocationFound: (lat: number, long: number) => void
}

 const MapHandlers = ({ onLocateRef, onLocationFound }: PropsType) => {
    const map = useMapEvents(
        {
            locationfound: (location) => {
                map.setView(location.latlng, map.getZoom())
                map.flyTo(location.latlng, map.getZoom())
                onLocationFound(location.latlng.lat, location.latlng.lng)
            }
        }
    )

    useEffect(
        () => {
            onLocateRef.current = () => map.locate()
        },
        [ map, onLocateRef ]
    )
    

    return null
 }

 export default MapHandlers