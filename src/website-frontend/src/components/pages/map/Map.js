import React from "react";
import PropTypes from 'prop-types';
import "leaflet-contextmenu"
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
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
import MenuList from '@material-ui/core/MenuList';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Fab,
  List,
  ListItem,
  ListSubheader,
  Snackbar,
  Checkbox,
  Tab,
  Box,
  Tabs,
  Paper,
  colors,
  MenuItem,
  Typography
} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import MuiAlert from "@material-ui/lab/Alert";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
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
import AddIcon from '@material-ui/icons/Add';

import AddLocationIcon from '@material-ui/icons/AddLocation';
import { IoLocationSharp } from "react-icons/io5";
import { RiGasStationFill } from "react-icons/ri";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { GiHealthNormal } from 'react-icons/gi'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import { ImLocation } from 'react-icons/im'
import DeleteIcon from '@material-ui/icons/Delete';
// components
import Destination from "./Destination";
import Transporations from "./Transporations";
import TabInputs from "./TabInputs";
import CurrentLocation from './CurrentLocation'

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
  poiList: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  poiListItem: {
    textAlign: "right"
  },
  listCheckbox: {
    marginLeft: theme.spacing(1),
  },
  tabCointainer: {
    top: "50px"
  }, 
  markersListText: {
    textAlign: "right",
    marginRight: "-10px"
  }
}));

const API_KEY = "5b3ce3597851110001cf6248ef4f468a3bbe4724ae286a8e3d9f1497"
const center = [36.456636, 15.46875];
const drawerWidth = 410;

export default function Map() {
  // ===================================================================================
  function LocationMarker() {
    const markerRef = useRef(null);
    
    const icon = L.icon({
      iconUrl: "markers/icon/pin.png",
      iconSize: [35, 65],
      iconAnchor: [18, 64],
      shadowUrl: 'markers/shadows/saye.png',
      shadowSize: [18, 18],
      shadowAnchor: [9, 11]
    });
      
      // Marker event handler
    //   const eventHandlers = useMemo(
    //   (e) => ({
    //     dragend: () => {
    //       const marker = markerRef.current;

    //       if (marker != null) {
    //         setOriginChangable(!originChangable);

    //         // if (originChangable === false) {
    //         //   setOriginPosition(marker.getLatLng());
    //         // }
    //       }
    //     },
    //   }),
    //   []
    // );

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
  // ===================================================================================

  function LocateView() {
    const map = useMapEvents({
      viewreset	(e) {
        let newArray = []
        newArray.push(...originPosition)

        for (let i = 0; i < originPosition.length; i++){
          if (newArray[i].changable){
            const latlng = map.getCenter();
            newArray[i].latlng = latlng;
            fetchReverseGeocode(latlng.lat.toString(), latlng.lng.toString())
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

  //Debugging
  const [checked, setChecked] = React.useState([1]);
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

  const handleListItemClick = () => {
    setNestedOpen(!nestedOpen);
  };

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


  // const handleToggle = (value) => () => {
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   setChecked(newChecked);
  // };

  

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
        <LocationMarker />
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
        <Container className={classes.drawerBody}>
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
        </Container>
        <Divider /> 
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              مکان های نقشه
            </ListSubheader>
          }
          className={classes.poiList}
        >
          <ListItem button className={classes.poiListItem}>
            <ListItemAvatar>
              <Avatar>
                <RestaurantIcon/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText className={classes.listText} primary="رستوران" />
            <Checkbox
              className={classes.listCheckbox}
              edge="start"
              // onChange={handleToggle(value)}
              // checked={checked.indexOf(value) !== -1}
              // inputProps={{ 'aria-labelledby': labelId }}
            />
          </ListItem>
          <ListItem button className={classes.poiListItem}>
            <ListItemAvatar>
              <Avatar>
                <AccountBalanceIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText className={classes.listText} primary="بانک" />
            <Checkbox
              className={classes.listCheckbox}
              edge="start"
              // onChange={handleToggle(value)}
              // checked={checked.indexOf(value) !== -1}
              // inputProps={{ 'aria-labelledby': labelId }}
            />
          </ListItem>
          <ListItem button className={classes.poiListItem} onClick={handleListItemClick}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: colors.deepOrange[500] }}>
                <RiGasStationFill/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText className={classes.listText} primary="امکانات شهری" />
            <Checkbox
              className={classes.listCheckbox}
              edge="start"
              // onChange={handleToggle(value)}
              // checked={checked.indexOf(value) !== -1}
              // inputProps={{ 'aria-labelledby': labelId }}
            />
            {/* {nestedOpen ? <ExpandLess /> : <ExpandMore />} */}
          </ListItem>
        </List>
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
