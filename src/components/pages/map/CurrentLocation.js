import { makeStyles } from '@material-ui/core';
import { Fab } from '@material-ui/core';
import React from 'react'
//icon
import { MdMyLocation } from "react-icons/md";


const useStyles = makeStyles(() => ({
    currentLocation: {
        zIndex: 1200,
        position: "fixed",
        bottom: "28px",
        left: "12px",
        marginRight: "12px",
        backgroundColor: "white",
    },
    currentLocationIcon: {
        fontSize: "20px",
        color: "rgba(0, 0, 0, 0.7)",
    }
}))

export default function CurrentLocation({position, map}) {
    const classes = useStyles()

    return (
        <Fab
            aria-label="current location"
            className={classes.currentLocation}
            onClick={() => {
            // map.locate({setView: true, maxZoom: 16})
            if (position !== null) {
                map.flyTo(position, map.getMaxZoom() - 1);
            } else {
                map.locate();
            }
            }}
        >
            <MdMyLocation className={classes.currentLocationIcon} />
        </Fab>
    )
}
