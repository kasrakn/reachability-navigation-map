import { Button, colors, makeStyles } from '@material-ui/core';
import { Tab, Tabs } from '@material-ui/core';
import React, { useState } from 'react'
// icon
import { CgSandClock } from "react-icons/cg";
import { RiPinDistanceFill } from "react-icons/ri";

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
  submitButton: {
    width: "100%",
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor : colors.green[400]
    }
  }
}));

export default function TabInputs(
    {
        API_KEY,
        timeInput, 
        setTimeInput, 
        distanceInput, 
        setDistanceInput, 
        originPosition,
        setLoading,
        alertUser,
        setIsochroneCoords,
        setIsochrone,
        transportation
    }) 
    {
    const [tabValue, setTabValue] = useState(0)
    const classes = useStyles()

    const fetchIsochrone = async (type) => {
        const data = {
          locations: [],
          range_type: type,
          range: [type === "time" ? timeInput : distanceInput]
        }
        originPosition.forEach(marker => {
          data.locations.push([marker.latlng.lng.toString(), marker.latlng.lat.toString()])
        })
    
        // this two methods can be combined together
        const response = await fetch(
          `https://api.openrouteservice.org/v2/isochrones/${transportation}`,
          {
            method: "POST",
            headers: {
              Accept:
                "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
              Authorization: API_KEY,
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data),
          }
        );
    
        const items = await response.json();
        setIsochrone(items);
        let polygonCoords = []
        
        items.features.forEach(feature => {
          polygonCoords.push(feature.geometry.coordinates[0].map((coord) => coord.reverse()))
          
        })
        setIsochroneCoords(polygonCoords);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (originPosition.length !== 0) {
          if (distanceInput === "" && timeInput !== ""){
            fetchIsochrone("time");
          } else if (timeInput === "" && distanceInput !== ""){
            fetchIsochrone("distance");
          } else if (timeInput !== "" && distanceInput !== ""){
            alertUser("فقط یکی از مقادیر فاصله و زمان را می‌توان انتخاب کرد.", "error")
          } else {
            alertUser("مقداری مشخص نشده است.", "warning")
          }
          setLoading(false);
        } else {
          alertUser("هیچ نقظه ای مشخص نشده است", "warning")
        }
    };


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }


    return (
        <form onSubmit={handleSubmit}>
        <div className="tab">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="icon label tabs example"
          >
            <Tab label=" برحسب فاصله زمانی" {...a11yProps(0)} />
            <Tab label="برحسب مسافت" {...a11yProps(1)} />
          </Tabs>
          <div className="tabpanel">
            {tabValue !== 0
              ? ''
              : (
                <div className="originInputContainer">
                  <CgSandClock className="timeIcon" />
                  <input
                    className="originInput"
                    placeholder="فاصله زمانی"
                    type="number"
                    // min={1}
                    // max={59}
                    // pattern="^[0-9]{0-2}"
                    onChange={(e) => {
                      setTimeInput(e.target.value);
                      setDistanceInput("")
                    }}
                  />
                </div>
              )
            }
          </div>
          <div>
            {tabValue !== 1
              ? ''
              : (
                <div className="originInputContainer">
                  <RiPinDistanceFill className="timeIcon" />
                  <input
                    className="originInput"
                    placeholder="مسافت بر حسب متر"
                    type="number"
                    onChange={(e) => {
                      setDistanceInput(e.target.value);
                      setTimeInput("")
                    }}
                  />
                </div>
              )
            }
          </div>
        </div>
        <div className="originInputContainer">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.submitButton}
          >
            محاسبه
          </Button>
        </div>
      </form>
    )
}
