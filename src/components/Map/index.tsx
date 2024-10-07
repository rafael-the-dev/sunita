import { MapContainer } from 'react-leaflet';
import L from 'leaflet';

// Import marker images
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Fixing missing marker icons
let DefaultIcon = L.icon({
    //@ts-ignore
    iconUrl: markerIcon,
    //@ts-ignore
    shadowUrl: markerShadow,
    //@ts-ignore
    iconRetinaUrl: markerRetina,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerRetina,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});


export default MapContainer;
