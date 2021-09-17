import { makeStyles } from '@material-ui/core';
import { useTheme } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import React from 'react'
// Icons
import {
    FaWalking,
    FaTruck,
    FaCar,
    FaBiking,
} from "react-icons/fa";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const useStyles = makeStyles((theme) => ({
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  transporationTypeButton: {
    margin: "0 5px",
  }
 }));



export default function Transporations({setOpen, transportation, setTransportation}) {
    const classes = useStyles();
    const theme = useTheme();

    const handleDrawerClose = () => {
        setOpen(false);
      };

    return (
        <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
        <div className="transportationType-container">
          <IconButton
            className={classes.transporationTypeButton}
            onClick={() => {
              setTransportation("driving-car");
            }}
            color={transportation === "driving-car" ? "primary" : "default"}
          >
            <FaCar />
          </IconButton>
          <IconButton
            className={classes.transporationTypeButton}
            onClick={() => {
              setTransportation("driving-hgv");
            }}
            color={transportation === "driving-hgv" ? "primary" : "default"}
          >
            <FaTruck />
          </IconButton>
          <IconButton
            className={classes.transporationTypeButton}
            onClick={() => {
              setTransportation("cycling-regular");
            }}
            color={
              transportation === "cycling-regular" ? "primary" : "default"
            }
          >
            <FaBiking />
          </IconButton>
          <IconButton
            className={classes.transporationTypeButton}
            onClick={() => {
              setTransportation("foot-walking");
            }}
            color={transportation === "foot-walking" ? "primary" : "default"}
          >
            <FaWalking />
          </IconButton>
        </div>
      </div>
    )
}
