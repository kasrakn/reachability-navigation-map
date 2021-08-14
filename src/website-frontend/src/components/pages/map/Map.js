import React from 'react';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Circle, LayerGroup, CircleMarker} from 'react-leaflet';
import PropTypes from 'prop-types';
// material ui components
import clsx from 'clsx';
import { alpha, makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import InputBase from '@material-ui/core/InputBase';
import { Card, CardContent, Container, Fab, Input, Paper, Tab, Tabs, TextField } from '@material-ui/core';
// CSS
import './map.css'
// import 'leaflet/dist/leaflet.css'
// icons
import { BiCurrentLocation } from 'react-icons/bi'
import SearchIcon from '@material-ui/icons/Search';
import { MdMyLocation } from 'react-icons/md'
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { FaWalking, FaWheelchair, FaTruck, FaCar, FaBiking } from 'react-icons/fa'
import { GrLocationPin } from 'react-icons/gr'
import { IoLocationSharp } from 'react-icons/io5'
import { CgSandClock } from 'react-icons/cg'
import { RiPinDistanceFill } from 'react-icons/ri'


const center = [36.456636, 15.46875]
const zoom = 13

const drawerWidth = 410;

const useStyles = makeStyles((theme) => ({
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    boxShadow: "-3px 0 20px rgba(0, 0, 0, 0.3)"

  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  drawerBody: {
    marginTop: "10px",  
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: theme.spacing(2),
    marginRight: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(3),
      width: 'auto',
    },
    paddingLeft: 5,
    height: "100%"
  },
  searchIcon: {
    padding: theme.spacing(0, 0),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

  },
    inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  }, 
  iconButton: {
    backgroundColor: "red"
  },
  menuButton: {
    marginRight: "0px"
  },
  searchInput: {
    marginRight: "12px",
    alignItems: "center"
  },
  currentLocation: {
    zIndex: 1200,
    position: "fixed",
    bottom: "28px",
    left: "12px",
    marginRight: "12px",
    backgroundColor: "white"

  },
  currentLocationIcon: {
    fontSize: "20px",
    color: "rgba(0, 0, 0, 0.7)"
  },
  transporationTypeButton: {
    margin: "0 5px"
  },
  tabsContainer: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: "120px",
  },
  tabs: {
    marginTop: "20px",
    borderLeft: `1px solid ${theme.palette.divider}`,
    width: "100px"
  },
  tabItem: {
    width: "100%",
    marginBottom: "10px",
    marginRight: "0px",
    minWidth: 0,
    letterSpacing: 0
  },
}));

function DraggableMarker() {
  const [draggable, setDraggable] = useState(true)
  const [position, setPosition] = useState(center)
  // The type of MarkerRef is React_useRef because we want the same object 
  // of the MarkerRef after each render. Having new objects and pointers to 
  // somewhere new in the memory after each render is the problem of using 
  // UseState functions instead of UseRef.
  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend: () => {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
        }
      },
    }),
    [],
  )
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d)
  }, [])

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}>
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {markerRef.current !== null 
            ? `location : ${markerRef.current.getLatLng()}`
            : <b>Drag to your desired place</b>
          }
        </span>
      </Popup>
    </Marker>
  )
}


export default function Map() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  // const location = useRef(center)
  const [position, setPosition] = useState(null)
  const [locateButton, setLocateButton] = useState(false)
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function LocateView(){
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getMaxZoom() - 1)
      },
      locationerror(e) {
        console.log("locaiton error")
      }
    });

    const outterCircleOptions = {borderColor: "whiظ"}

    return position === null ? null : (
      <LayerGroup>
        <CircleMarker 
          center={position}  
          radius={14} 
          stroke={false}
          pathOptions={outterCircleOptions}
        />
        <CircleMarker
          center={position}
          // pathOptions={fillRedOptions}
          radius={9}
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
    )
  } // end of LocationView funciton

    
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
          <MenuIcon 
            color="action"
          />
        </IconButton>
        <div className="search-container">
          <InputBase 
            placeholder="جستجو در نقشه"
            inputProps={{ 'aria-label': 'search' }}
            className= {classes.searchInput}
          />
        </div>
        <SearchIcon 
          className="search-icon"
        />
      </div>

        {/* =================  map contents area ==============================*/}
      <MapContainer 
      center={center} 
      zoom={3} 
      scrollWheelZoom={true}
      minZoom={3}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>

        <LocateView />
        <DraggableMarker />
      </MapContainer>
        {/* =================  my location button ==============================*/}

      <Fab
        aria-label="current location"
        className={classes.currentLocation}
        onClick={() => {
          setLocateButton(true)
        }}
      >
        <MdMyLocation 
          className={classes.currentLocationIcon}
          />
      </Fab>

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
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <div className="transportationType-container">
            <IconButton className={classes.transporationTypeButton}>
              <FaWalking />
            </IconButton>
            <IconButton className={classes.transporationTypeButton}>
              <FaCar />
            </IconButton>
            <IconButton className={classes.transporationTypeButton}>
              <FaTruck />
            </IconButton>
            <IconButton className={classes.transporationTypeButton}>
              <FaBiking />
            </IconButton>
            <IconButton className={classes.transporationTypeButton}>
              <FaWheelchair />
            </IconButton>
          </div>
        </div>
        
        {/* =============== Drawer body ====================== */}
        <Container className={classes.drawerBody}>
          <Card
          color="green"
          >
            <CardContent>
              <div className="originInputContainer">
                <IoLocationSharp className="originIcon" />
                <input 
                  className="originInput"
                  placeholder="موقعیت شما"
                  type="search"
                />
              </div>
              <div className="originInputContainer">
                <CgSandClock className="timeIcon" />
                <input 
                  className="originInput"
                  placeholder="فاصله زمانی"
                  type="search"
                />
              </div>
              <div className="originInputContainer">
                <RiPinDistanceFill className="timeIcon" />
                <input 
                  className="originInput"
                  placeholder="مسافت بر حسب متر"
                  type="search"
                />
              </div>
            </CardContent>
          </Card> 
        </Container>
      </Drawer>
    </div>
  )
}
