import React from "react";
import "leaflet-contextmenu"
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";
import { useEffect, useState} from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { LayerGroup, CircleMarker, Polygon, Polyline } from "react-leaflet";
// import PropTypes from 'prop-types';
// React router
// import { Link } from 'react-router-dom'
// material ui components
import clsx from "clsx";
import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import InputBase from "@material-ui/core/InputBase";
import { withStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  Container,
  Divider,
  Snackbar,
  colors,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
// CSS
import "./map.css";
import "../../../../node_modules/leaflet-contextmenu/dist/leaflet.contextmenu.css"
// colors
import { getColor } from "./colors";
// import 'leaflet/dist/leaflet.css'
// icons
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// components
import Destination from "./Destination";
import Transporations from "./Transporations";
import TabInputs from "./TabInputs";
import CurrentLocation from './CurrentLocation'
import IsochroneAccordion from './IsochroneAccordion'
import Direction from "./Direction";
import Poi from "./Poi";
import LocationMarker from "./LocationMarker";


const useStyles = makeStyles((theme) => ({
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    boxShadow: "-3px 0 20px rgba(0, 0, 0, 0.3)",
  },
  drawerBody: {
    marginTop: "10px",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: theme.spacing(2),
    marginRight: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginRight: theme.spacing(3),
      width: "auto",
    },
    paddingLeft: 5,
    height: "100%",
  },
  searchIcon: {
    padding: theme.spacing(0, 0),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  iconButton: {
    backgroundColor: "red",
  },
  menuButton: {
    marginRight: "0px",
  },
  searchInput: {
    marginRight: "12px",
    alignItems: "center",
  },
  tabsContainer: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "120px",
  },
  tabs: {
    marginTop: "20px",
    borderLeft: `1px solid ${theme.palette.divider}`,
    width: "100px",
  },
  tabItem: {
    width: "100%",
    marginBottom: "10px",
    marginRight: "0px",
    minWidth: 0,
    letterSpacing: 0,
  },
  snackAlert: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
    zIndex: "1300",
  },
  alertText: {
    width: "100%",
    margin: "0 15px",
    alignItems: "center",
    justifyContent: "center",
  },
  tabCointainer: {
    top: "50px"
  }
}));

const API_KEY = "5b3ce3597851110001cf6248ef4f468a3bbe4724ae286a8e3d9f1497"
const center = [36.456636, 15.46875];
const drawerWidth = 410;


const AccordionStyled = withStyles({
  root: {
    borderTop: '1px solid rgba(0, 0, 0, .12)',
    borderRadius: 0,
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummaryStyled = withStyles({
  root: {
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
    color: "rgba(0, 0, 0, 0.54)"
  },
  expanded: {},
})(MuiAccordionSummary);


const AccordionDetailsStyled = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function Map() {
  function LocateView() {
    const map = useMapEvents({
      viewreset	(e) {
        let newArray = []
        newArray.push(...originPosition)

        for (let i = 0; i < originPosition.length; i++){
          if (newArray[i].changable){
            const latlng = map.getCenter();
            newArray[i].latlng = latlng;
            // fetchReverseGeocode(latlng.lat.toString(), latlng.lng.toString())
            newArray[i].geocode = currentGeocode;
            setCurrentGeocode("")
          }
        }
        setOriginPosition(newArray)
      },
    });

    return position === null ? null : (
      <LayerGroup>
        <CircleMarker center={position} radius={14} stroke={false} />
        <CircleMarker
          center={position}
          // pathOptions={fillRedOptions}
          radius={8.5}
          stroke={false}
          color="white"
          fillOpacity={1}
        />
        <CircleMarker
          center={position}
          // pathOptions={fillRedOptions}
          radius={7}
          stroke={false}
          color="blue"
          fillOpacity={0.6}
        />
      </LayerGroup>
    );
  } // ----------- end of LocationView funciton
  const classes = useStyles();
  const theme = useTheme();

  const [map, setMap] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [expandedAccordion, setExpandedAccordion] = React.useState('panel1');
  
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertSeverity, setAlertSeverity] = useState("warning")


  // const [poiAlertOpen, setPoiAlertOpen] = useState(false)
  const [nestedOpen, setNestedOpen] = React.useState(true);

  const [loading, setLoading] = useState(false);
  const [timeInput, setTimeInput] = useState("");
  const [distanceInput, setDistanceInput] = useState("");

  const [position, setPosition] = useState(null);
  const [transportation, setTransportation] = useState("driving-car");

  
  const [markerCount, setMarkerCount] = useState(1)
  const [originPosition, setOriginPosition] = useState([{
    id: 1,
    latlng: center,
    changable: true,
    geocode: ""
  }]);
  
  const [destination, setDestination] = useState(null)
  
  const [isochrone, setIsochrone] = useState(null);
  const [isochroneCoords, setIsochroneCoords] = useState([]);
  const [currentGeocode, setCurrentGeocode] = useState("");
  const [directionCoords, setDirectionCoords] = useState([])
  //Debugging
  const [selectedPOIs, setSelectedPOIs] = React.useState([]);

  
  // ----------------------------------------------------------------

  const fetchReverseGeocode = async (lat, lng) => {
    const size = 1;
    const response = await fetch(
        `https://api.openrouteservice.org/geocode/reverse?api_key=${API_KEY}&point.lon=${lng}&point.lat=${lat}&size=${size}`
      ,
      {
        method: "GET",
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }
      }
    );

    const items = await response.json();
    setCurrentGeocode(items.features[0].properties.label.trim())
  }
  
  // ---------- ----------------------

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const alertUser = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true)
  }

  const handleAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpandedAccordion(newExpanded ? panel : false);
  };

  useEffect(() => {
    if (map !== null) {
      map.locate({ setView: true, maxZoom: map.getMaxZoom() - 1 });
      map.on("locationfound", (e) => {
        setPosition(e.latlng);
        map.flyTo(e.latlng);
      });
      
      map.on("locationerror", (e) => {
        alertUser("به منظور استفاده بهتر از امکانات سایت، به مرورگر خود دسترسی موقعیت مکانی بدهید", "error")
      });
    }
  }, [map]);

  return (
    <div>
      <div className="topBar">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerOpen}
          className={clsx(open && classes.hide) + classes.menuButton}
        >
          <MenuIcon color="action" />
        </IconButton>
        <div className="search-container">
          <InputBase
            placeholder="جستجو در نقشه"
            inputProps={{ "aria-label": "search" }}
            className={classes.searchInput}
          />
        </div>
        <SearchIcon className="search-icon" />
      </div>

      {/* =================  map contents area ==============================*/}
      <MapContainer
        id="map-container"
        center={center}
        zoom={3}
        scrollWheelZoom={true}
        minZoom={3}
        whenCreated={setMap}
        contextmenu={true}
        contextmenuWidth={150}
        contextmenuItems={[
          {
            text: 'مسیریابی به اینجا',
            icon: "markers/icon/direction.svg",
            callback: (e) => {
              const newObj = {
                latlng: e.latlng,
                draggable: true
              }
              setDestination(newObj)
            }
          }
        ]}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocateView />
        <Destination dest={destination} setDest={setDestination}/>
        <LocationMarker originPosition={originPosition} setOriginPosition={setOriginPosition}/>
        {isochroneCoords.map((coord, ind) => (
          <Polygon
            key={ind}
            positions={coord}
            interactive={false}
            pathOptions={{
              color: getColor(ind % 20)[800]
            }}
          />
        ))}

        <Polyline
          positions={directionCoords}
          interactive={false}
          pathOptions={{
            color: colors.blue['A400'],
            // weight: 3
          }}
          className="directionLine"
        />
      </MapContainer>
      {/* =================  my location button ==============================*/}
      <CurrentLocation map={map} position={position}/>
      {/* ==================  Drawer   ==========================*/}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Transporations setOpen={setOpen} transportation={transportation} setTransportation={setTransportation}/>
        {/* =============== Drawer body ====================== */}
          <AccordionStyled square expanded={expandedAccordion === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummaryStyled
              expandIcon={<ExpandMoreIcon />}
            >
            ایزوکرون
            </AccordionSummaryStyled>
            <AccordionDetailsStyled>
              <Container className={classes.drawerBody} style={{display: "block"}}>
                <TabInputs 
                  API_KEY={API_KEY}
                  timeInput={timeInput}
                  setTimeInput={setTimeInput}
                  distanceInput={distanceInput}
                  setDistanceInput={setDistanceInput}
                  originPosition={originPosition}
                  setLoading={setLoading}
                  alertUser={alertUser}
                  setIsochroneCoords={setIsochroneCoords}
                  setIsochrone={setIsochrone}
                  transportation={transportation}
                />
                <IsochroneAccordion
                  map={map} 
                  currentGeocode={currentGeocode}  
                  markerCount={markerCount} 
                  setMarkerCount={setMarkerCount} 
                  originPosition={originPosition} 
                  setOriginPosition={setOriginPosition} 
                  isochroneCoords={isochroneCoords}
                  setIsochroneCoords={setIsochroneCoords} 
                  fetchReverseGeocode={fetchReverseGeocode}
                />
              </Container>
            </AccordionDetailsStyled>
          </AccordionStyled>
          <AccordionStyled square expanded={expandedAccordion === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummaryStyled
              expandIcon={<ExpandMoreIcon />}
            >
            مسیریابی
            </AccordionSummaryStyled>
            <AccordionDetailsStyled>
              <Direction 
                API_KEY={API_KEY}
                originPosition={originPosition}
                destination={destination}
                directionCoords={directionCoords}
                setDirectionCoords={setDirectionCoords}
                setLoading={setLoading}
                alertUser={alertUser}
                transportation={transportation}
              />
            </AccordionDetailsStyled>
          </AccordionStyled>
          <AccordionStyled square expanded={expandedAccordion === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummaryStyled
              expandIcon={<ExpandMoreIcon />}
            >
            مکان های نقشه
            </AccordionSummaryStyled>
            <AccordionDetailsStyled>
              <Poi />
            </AccordionDetailsStyled>
          </AccordionStyled>
        
        <Divider /> 
      </Drawer>
      <Snackbar
        open={alertOpen}
        autoHideDuration={20000}
        onClose={handleAlertClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={alertSeverity}
          onClose={handleAlertClose}
        >
          <div className={classes.alertText}>
            {alertMessage}
          </div>
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
