import React from 'react';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { LayerGroup, CircleMarker, Polygon } from 'react-leaflet'
// import PropTypes from 'prop-types';
// React router
// import { Link } from 'react-router-dom'
// material ui components
import clsx from 'clsx';
import { alpha, makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import InputBase from '@material-ui/core/InputBase';
import { Button, Card, CardContent, CircularProgress, Container, Fab, Snackbar} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
// CSS
import './map.css'
// import 'leaflet/dist/leaflet.css'
// icons
import SearchIcon from '@material-ui/icons/Search';
import { MdMyLocation } from 'react-icons/md'
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { FaWalking, FaWheelchair, FaTruck, FaCar, FaBiking } from 'react-icons/fa'
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
  submitButton: {
    width: "100%"
  },
  snackAlert: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2)
    },
    zIndex: "1300"
  }, 
  alertText: {
    width: "100%",
    margin: "0 15px",
    alignItems: "center",
    justifyContent: "center",
    // marginRight: "15px"
    // marginRight: "15px"
  }
}));





export default function Map() {
  // ===================================================================================
function LocationMarker() {
  // const [draggable, setDraggable] = useState(true)
  const markerRef = useRef(null)
  const map = useMap()

  // const icon = L.icon({
  //   iconUrl: ""
  // });

  // Marker event handler
  const eventHandlers = useMemo(
    () => ({
      click: () => {
        const marker = markerRef.current
        if (marker != null) {
          setOriginChangable(!originChangable)
          
          if (originChangable === false) {
            setOriginPosition(marker.getLatLng())
          }
        }
      },
    }),
    [],
  );

  // Onlick handler
  const toggleDraggable = useCallback(() => {
    // setDraggable((d) => !d)
  }, [])

  return (
    <Marker
      // draggable={draggable}
      eventHandlers={eventHandlers}
      position={originPosition}
      ref={markerRef}>

      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {markerRef.current !== null 
            ? `location : ${markerRef.current.getLatLng()}`
            : <b>Set this marker to your desired place</b>
          }
        </span>
      </Popup>
    </Marker>
  )
}
// ===================================================================================


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
      
    },
    move(e) {
      if (originChangable === true) {
        setOriginPosition(map.getCenter())
      }
    }
  });

  return position === null ? null : (
    <LayerGroup>
      <CircleMarker 
        center={position}  
        radius={14} 
        stroke={false}
      />
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
  )
} // ----------- end of LocationView funciton

  const classes = useStyles();
  const theme = useTheme();

  const [map, setMap] = useState(null)
  const [open, setOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false );
  const [locateButton, setLocateButton] = useState(false)

  const [loading, setLoading] = useState(false)
  const [timeInput, setTimeInput] = useState('')
  const [distanceInput, setDistanceInput] = useState('')

  const [position, setPosition] = useState(null)
  const [originPosition, setOriginPosition] = useState(center)
  const [originChangable, setOriginChangable] = useState(true)
  const [transportation, setTransportation] = useState('driving-car')
  
  const [isochrone, setIsochrone] = useState(null)
  const [isochroneCoords, setIsochroneCoords] = useState([])
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const fetchIsochrone = async() => {
    const data = {
      "locations": [[originPosition.lng.toString(), originPosition.lat.toString()]],
      "range_type": "time",
      "range": [timeInput]
    }

    // this two methods can be combined together
    const response = await fetch(`https://api.openrouteservice.org/v2/isochrones/${transportation}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': '5b3ce3597851110001cf6248ef4f468a3bbe4724ae286a8e3d9f1497',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)
    });
    
    const items = await response.json();
    setIsochrone(items);
    const reversed = items.features[0].geometry.coordinates[0].map(coord => coord.reverse());
    setIsochroneCoords(reversed)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    fetchIsochrone()
    setLoading(false)
  }

  const handleAlertClose = (e, reason) => {
    if (reason === 'clickaway') {
      return ;
    }
    setAlertOpen(false)
  }

  useEffect(() => {
    if (map !== null) {
      map.locate({setView: true, maxZoom: map.getMaxZoom() - 1})
      map.on('locationfound', (e) => {
        setPosition(e.latlng)
        map.flyTo(e.latlng)
      })
      map.on('locationerror', (e) => {
        setAlertOpen(true)
      })
    }
  }, [map])


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
      id="map-container"
      center={center} 
      zoom={3} 
      scrollWheelZoom={true}
      minZoom={3}
      whenCreated={setMap}
      whenReady={() => {
      }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocateView />
        <LocationMarker />
        <Polygon
        positions={isochroneCoords}
        interactive={false}
        color="blue"
        // pathOptions={{
        //   color: "blue",
        //   // opacity: "50%"
        // }}
        />
        <div className="snackAlert">
          <Snackbar 
            open={alertOpen} 
            autoHideDuration={20000} 
            onClose={handleAlertClose} 
            >
            <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleAlertClose}>
              <div className={classes.alertText}>
              به منظور استفاده بهتر از امکانات سایت، به مرورگر خود دسترسی موقعیت مکانی بدهید
              </div>
            </MuiAlert>
          </Snackbar>
        </div>
      </MapContainer>
        {/* =================  my location button ==============================*/}

      <Fab
        aria-label="current location"
        className={classes.currentLocation}
        onClick={() => {
          // map.locate({setView: true, maxZoom: 16})
          if (position !== null) {
            map.flyTo(position, map.getMaxZoom() - 1)
          } else {
            map.locate()
          }
          
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
            <IconButton 
              className={classes.transporationTypeButton}
              
              onClick={() => {
                setTransportation('driving-car')
                
              }}
              color={
                transportation === 'driving-car'
                  ? 'primary'
                  : 'default'
              }
              >
              <FaCar />
            </IconButton>
            <IconButton 
              className={classes.transporationTypeButton}
              onClick={() => {
                setTransportation('driving-hgv')
                
              }}
              color={
                transportation === 'driving-hgv'
                  ? 'primary'
                  : 'default'
              }
              >
              <FaTruck />
            </IconButton>
            <IconButton 
              className={classes.transporationTypeButton}
              onClick={() => {
                setTransportation('cycling-regular')
                
              }}
              color={
                transportation === 'cycling-regular'
                  ? 'primary'
                  : 'default'
              }
              >
              <FaBiking />
            </IconButton>
            <IconButton 
              className={classes.transporationTypeButton}
              onClick={() => {
                setTransportation('foot-walking')
                
              }}
              color={
                transportation === 'foot-walking'
                  ? 'primary'
                  : 'default'
              }
              >
              <FaWalking />
            </IconButton>
            <IconButton 
              className={classes.transporationTypeButton}
              onClick={() => {
                setTransportation('wheelchair')
                
              }}
              color={
                transportation === 'wheelchair'
                  ? 'primary'
                  : 'default'
              }
              >
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
              <form
                onSubmit={handleSubmit}
              >
                <div className="originInputContainer">
                  <IoLocationSharp className="originIcon" />
                  <input 
                    className="originInput"
                    placeholder="موقعیت شما"
                    type="search"
                    defaultValue={originPosition.lat === undefined
                        ? ''
                        : `${originPosition.lat.toFixed(5)}, ${originPosition.lng.toFixed(5)}`
                    }
                    // onChange={(e) => {setLocationMarkerPosition(e.target.value)}}
                    style={{direction: "ltr"}}
                  />
                </div>
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
                      setTimeInput(e.target.value)
                    }}
                  />
                </div>
                <div className="originInputContainer">
                  <RiPinDistanceFill className="timeIcon" />
                  <input 
                    className="originInput"
                    placeholder="مسافت بر حسب متر"
                    type="search"
                    onChange={(e) => {
                      setDistanceInput(e.target.value)
                    }}
                  />
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
              <div className="loadingBar">
                {loading && <CircularProgress />}
              </div>
            </CardContent>
          </Card> 
        </Container>
      </Drawer>
    </div>
  )
}
