import React, {useRef, useEffect} from 'react'
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet'


export default function Destination({dest, setDest}) {
    const markerRef = useRef(null);
    const center = [36.456636, 15.46875];
    
    const icon = L.icon({
      iconUrl: "markers/icon/destination.png",
      iconSize: [35, 65],
      iconAnchor: [18, 64],
      shadowUrl: 'markers/shadows/saye.png',
      shadowSize: [18, 18],
      shadowAnchor: [9, 11]
    });

    useEffect(() => {
        console.log("the destination: ", dest)
    }, [])

    // Onlick handler
    
    return dest === null
        ? ''
        : (
            <Marker
                draggable={true}
                position={dest.latlng === undefined
                    ? center
                    : dest.latlng
                }
                ref={markerRef}
                icon={icon}
                eventHandlers={{
                    dragend: (e) => {
                        const newObj = {
                            latlng: e.target.getLatLng(),
                            draggable: true
                        }
                        setDest(newObj)
                    }
                }}
            >
                <Popup minWidth={90}>
                    <span>
                        {markerRef.current !== null 
                        ? (
                        `location : ${markerRef.current.getLatLng()}`
                        ) : (
                        <b>مقصد</b>
                        )}
                    </span>
                </Popup>
            </Marker>
        )
}
