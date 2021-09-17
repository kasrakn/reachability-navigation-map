import { ListItemText, makeStyles } from '@material-ui/core'
import { IconButton, List, ListItem, ListItemIcon } from '@material-ui/core'
import React from 'react'
//icon
import AddIcon from '@material-ui/icons/Add';
import { ImLocation } from 'react-icons/im'
import DeleteIcon from '@material-ui/icons/Delete';




const useStyles = makeStyles(() => ({
    markersListText: {
        textAlign: "right",
        marginRight: "-10px",
        marginLeft: "5px"
    }
}))

export default function IsochroneAccordion({
    map, 
    currentGeocode, 
    markerCount, 
    setMarkerCount, 
    originPosition, 
    setOriginPosition, 
    isochroneCoords,
    setIsochroneCoords, 
    fetchReverseGeocode
}) {
    const classes = useStyles()

    const handleAddMarker = (e) => {
        let newArray = []
        const latlng = map.getCenter()
        console.log("current geocode:  ", currentGeocode)
    
        fetchReverseGeocode(latlng.lat.toString(), latlng.lng.toString())
        newArray.push(...originPosition)
        newArray.push({
          id: markerCount + 1,
          latlng: latlng,
          geocode: currentGeocode,
          changable: true
        })
        setMarkerCount(markerCount + 1)
        setOriginPosition(newArray)
    }

    return (
        <div className="selectedPoints">
            <div className="selectedPointHeader">
            <div 
                className="selectedPointTitle"
                >
                نقاط انتخاب شده
            </div>
            <IconButton 
                className="selectedPointAdd"
                onClick={handleAddMarker}
            >
                <AddIcon />
            </IconButton>
            </div>
            <List>
            {
                originPosition.length === 0
                ? ''
                : (
                    originPosition.map((marker, ind) => (
                    <ListItem 
                        alignItems="flex-start"
                        key={ind}
                    >
                        <ListItemIcon>
                        <ImLocation />
                        </ListItemIcon>
                        <ListItemText
                        primary={
                            marker.latlng.lat === undefined || marker.latlng.lng === undefined
                            ? ''
                            : `lat: ${marker.latlng.lat.toFixed(5)}, lng: ${marker.latlng.lng.toFixed(5)}`
                        }
                        secondary={marker.geocode}
                        className={classes.markersListText}
                        />
                        <IconButton
                        color="default"
                        onClick={() => {
                            const newArray = originPosition.filter(m => m.id !== marker.id)
                            setOriginPosition(newArray)
                            let newIsochronCoords = isochroneCoords.splice(ind, 1)
                            setIsochroneCoords(newIsochronCoords)
                        }}
                        >
                        <DeleteIcon 
                            fontSize="small"
                            />
                        </IconButton>
                    </ListItem>
                    ))
                )
            }
            </List>
        </div>
    )
}
