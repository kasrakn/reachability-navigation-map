import React from 'react';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, useMemo, useCallback,  } from 'react-leaflet';
// material ui components
import clsx from 'clsx';
import { alpha, makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InputBase from '@material-ui/core/InputBase';
import { Card, CardContent, Container, Fab, Input, Tab, Tabs, TextField } from '@material-ui/core';
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
import { TabPanel } from '@material-ui/lab';


const center = [51.505, -0.09]
const zoom = 13

const drawerWidth = 450;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: "30%",
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: "8px",
    marginRight: "8px",
    borderRadius: "8px",
    height: "48px"
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
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
    width: "100px",
  },
  tabItem: {
    width: "100%",
    marginBottom: "10px",
    marginRight: "0px",
    minWidth: 0,
    letterSpacing: 0
  }
}));

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function Map() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0)
  
  const position = [51.505, -0.09] 
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

    
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
            // color="action"
            className="search-icon"
          />
        </div>

          {/* =================  map contents area ==============================*/}
        <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <BiCurrentLocation style={{fontSize: "24px"}}/>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
          {/* =================  map contents area ==============================*/}

        <Fab
          aria-label="current location"
          className={classes.currentLocation}
        >
          <MdMyLocation 
            className={classes.currentLocationIcon}
            />
        </Fab>
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
          {/* <Container className={classes.drawerBody}> */}
                  {/* <div className="originInputContainer">
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
                      placeholder="موقعیت شما"
                      type="search"
                    />
                  </div> */}
                  <div className={classes.drawerBody}>
                    <Tabs
                      className={classes.tabs}
                      variant="standard"
                      orientation="vertical"
                      value={tabValue}
                      // onChange={}
                      aria-label="measure methods tabs"
                    >
                      <Tab className={classes.tabItem} label="زمان" {...a11yProps(0)} />
                      <Tab className={classes.tabItem} label="فاصله" {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                      Item One
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                      Item Two
                    </TabPanel>
                  </div>
          {/* </Container> */}
        </Drawer>
      </div>
    )
}
