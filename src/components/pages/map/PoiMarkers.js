import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import { Marker, Popup } from 'react-leaflet';

export default function PoiMarkers({poiMarkers}) {
    const markerRef = useRef(null);

    useEffect(() => {
        console.log("the poi markers: ", poiMarkers)
        
    }, [poiMarkers])

    return (
      poiMarkers.map((poi, indPoi) => (
        poi.features.map((obj, objInd) => (
            <Marker
                draggable={false}
                position={obj.geometry.coordinates.reverse()}
                ref={markerRef}
                icon={L.icon({
                    iconUrl: poi.marker,
                    iconSize: [32, 45],
                    iconAnchor: [18, 64],
                })}
                key={objInd}
            >
                <Popup minWidth={90}>
                <span>
                    {markerRef.current !== null && obj.properties.name !== undefined ? (
                    <div>   
                        {obj.properties.name}
                    </div>
                    ) : (
                    ''
                    )}
                </span>
                </Popup>
            </Marker>
        ))
      ))
    );
  }
