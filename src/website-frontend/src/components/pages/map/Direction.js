import { Button, colors, makeStyles } from '@material-ui/core'
import { Container } from '@material-ui/core'
import React from 'react'
//icon
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MoreVertIcon from '@material-ui/icons/MoreVert';


const useStyles = makeStyles((theme) => ({
    submitButton: {
        width: "100%",
        backgroundColor: colors.blue[600],
        '&:hover': {
          backgroundColor : colors.blue[400]
        }
    },
    drawerBody: {
        marginTop: "10px",
    }
}))

export default function Direction({
    API_KEY,
    originPosition, 
    destination,
    directionCoords,
    setDirectionCoords,
    setLoading,
    alertUser,
    transportation
    }) {
    const classes = useStyles()

      const fetchDirection = async () => {
        let coords = originPosition.map(p => [p.latlng.lng, p.latlng.lat])
        coords.push([destination.latlng.lng, destination.latlng.lat])
        const data = {
          coordinates: coords
        }
        
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/${transportation}/geojson`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
              'Authorization': API_KEY,
              'Content-Type': 'application/json; charset=utf-8'
            }
          }
        );
          
        const items = await response.json()
        console.log("items: ", items)
        setDirectionCoords(items.features[0].geometry.coordinates.map((coord) => coord.reverse()))
        console.log(directionCoords)
      }

    const handleDirection = (e) => {
        e.preventDefault();
        setLoading(true);
        if (originPosition !== null && destination !== null){
          fetchDirection();
        } else if (originPosition !== null && destination === null){
          alertUser("مقصدی شخص نشده است.", "error")
        } else if (origin === null && destination !== null){
          alertUser("مبدا مشخص نشده است.", "E")
        } else {
          alertUser("مبدا و مقصد مشخص نشده اند.", "warning")
        }
        setLoading(false);
      }
    

    return (
        <Container className={classes.drawerBody} style={{display: "block"}}>
            <div>
              {originPosition.map((point) => (
                <div className="directionElement">
                  <TripOriginIcon fontSize="small" style={{color: colors.green[500]}}/>
                  <div className="directionElementText">
                  {originPosition.length === 0  || point.latlng.lat === undefined || point.latlng.lng === undefined
                      ? "مبدا انتخاب نشده است"
                      : `lat: ${point.latlng.lat.toFixed(5)}, lng: ${point.latlng.lng.toFixed(5)}`
                  }
                  </div>
                </div>
              ))}
            </div>
            <MoreVertIcon style={{marginRight: "30px"}}/>  
            <div className="directionElement under">
                <LocationOnIcon fontSize="small" style={{color: colors.red[500]}}/>
                <div className="directionElementText">
                {destination === null
                    ? "مقصد انتخاب نشده است"
                    : `lat: ${destination.latlng.lat.toFixed(5)}, lng: ${destination.latlng.lng.toFixed(5)}`
                }
                </div>
            </div>
            <div className="originInputContainer">
                <Button
                variant="contained"
                color="primary"
                type="submit"
                className={classes.submitButton}
                onClick={handleDirection}
                >
                برو بریم
                </Button>
            </div>
        </Container>
    )
}
