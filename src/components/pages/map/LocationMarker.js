import React, { useCallback, useRef } from 'react'
import L from 'leaflet'
import { Marker, Popup } from 'react-leaflet';

export default function LocationMarker({originPosition, setOriginPosition}) {
    const markerRef = useRef(null);
    
    const icon = L.icon({
      iconUrl: "markers/icon/pin.png",
      iconSize: [35, 65],
      iconAnchor: [18, 64],
      shadowUrl: 'markers/shadows/saye.png',
      shadowSize: [18, 18],
      shadowAnchor: [9, 11]
    });

    // Onlick handler
    const toggleDraggable = useCallback(() => {
      // setDraggable((d) => !d)
    }, []);

    return (
      originPosition.map((marker, ind) => (
        <Marker
          draggable={true}
          position={marker.latlng}
          ref={markerRef}
          icon={icon}
          key={ind}
          eventHandlers={{
            dragend: (e) => {
              marker.latlng = e.target.getLatLng()
              let newArray = []
              newArray.push(...originPosition)
              setOriginPosition(newArray)
            }
          }}
          contextmenu={true}
          contextmenuWidth={150}
          contextmenuItems={
            {
              text:"انتخاب به عنوان مبدا",
              icon: "add_location.svg",
              callback: (e) => {
                
              }
            }
          }
        >
          <Popup minWidth={90}>
            <span onClick={toggleDraggable}>
              {markerRef.current !== null ? (
                `location : ${markerRef.current.getLatLng()}`
              ) : (
                <b>Set this marker to your desired place</b>
              )}
            </span>
          </Popup>
        </Marker>
      ))
    );
  }
