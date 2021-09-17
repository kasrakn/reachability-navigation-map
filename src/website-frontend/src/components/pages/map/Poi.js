import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core'
import { Avatar, Checkbox, colors, List, ListItem, ListItemAvatar, ListItemText, ListSubheader } from '@material-ui/core'
import React from 'react'
//Icon
import RestaurantIcon from '@material-ui/icons/Restaurant';
import { RiGasStationFill } from "react-icons/ri";
import { GiHealthNormal } from 'react-icons/gi'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AtmIcon from '@material-ui/icons/Atm';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import { FaSchool } from 'react-icons/fa'
import SchoolIcon from '@material-ui/icons/School';
import { CgGym } from 'react-icons/cg'
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import LocalParkingIcon from '@material-ui/icons/LocalParking';
// Data

const useStyles = makeStyles((theme) => ({
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

}))
export default function Poi({selectedPOIs, setSelectedPOIs}) {
    const classes = useStyles()
    const [items, setItems] = useState([])
    const [checked, setChecked] = React.useState([]);

    const placesArray = [
        {
            id: 1,
            name: "رستوران",
            source: "restaurant",
            icon: <RestaurantIcon />,
            color: colors.amber[500]
        }, 
        {
            id: 2, 
            name: "بانک",
            source: "bank",
            icon: <AccountBalanceIcon/>,
            color: colors.red[600]
        },
        {
            id: 3,
            name: "ATM",
            source: "atm",
            icon: <AtmIcon/>,
            color: colors.green[500]
        },
        {
            id: 4,
            name: "پمپ بزنین",
            source: "fuel",
            icon: <RiGasStationFill />,
            color: colors.blue[500]
        },
        {
            id: 5,
            name: "مراکز درمانی",
            source: "hospital",
            icon: <GiHealthNormal/>,
            color: colors.red[500]
        }, 
        {
            id: 6,
            name: "داروخانه",
            source: "pharmacy",
            icon: <LocalPharmacyIcon/>,
            color: colors.purple[500]
        },
        {
            id: 7,
            name: "مدرسه",
            icon: <FaSchool/>,
            source: "school",
            color: colors.orange[500]
        },
        {
            id: 8,
            name: "دانشگاه",
            source: "university",
            icon: <SchoolIcon/>,
            color: colors.green[700]
        },
        {
            id: 9,
            name: "باشگاه ورزشی",
            source: "fitness_center",
            icon: <CgGym/>,
            color: colors.brown[500]
        },
        {
            id: 10,
            name: "مراکز ورزشی",
            source: "sport_center",
            icon: <SportsBasketballIcon/>,
            color: colors.pink[500]
        },
        {
            id: 11,
            name: "پارکینگ",
            source: "parking",
            icon: <LocalParkingIcon/>,
            color: colors.blue[700]
        }
    ]

    const fetchPoi = async (poi) => {
        let items = []
        const response = await fetch(
            `../../../../mashhad-data/${placesArray[poi - 1].source}.geojson`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
        const thisItem = await response.json()
        console.log("this item: ", thisItem)
        setItems([...items, thisItem])
    }

    const findPOIs = () => {
        selectedPOIs.forEach((poi) => {
            fetchPoi(poi)
        })
    }

    const handleToggle = (value) => () => {
        const currentIndex = selectedPOIs.indexOf(value);
        const newChecked = [...selectedPOIs];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setSelectedPOIs(newChecked);

        // debug
        console.log("newChecked: ", newChecked)
        console.log("selectedPOIs, ", selectedPOIs)
    };


    useEffect(() => {
        findPOIs()
    }, [selectedPOIs])

      
    return (
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
        {placesArray.map((cat, ind) => (
            <ListItem 
                key={cat.id}
                className={classes.poiListItem}
            >
                <ListItemAvatar>
                    <Avatar style={{backgroundColor: cat.color}}>
                        {cat.icon}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText className={classes.listText} primary={cat.name} />
                <Checkbox
                    className={classes.listCheckbox}
                    edge="start"
                    // onChange={handleToggle(cat.id)}
                    // checked={selectedPOIs.indexOf(cat.id) !== -1}
                    // inputProps={{ 'aria-labelledby': cat.id }}
                />
            </ListItem>
        ))}
        </List>
    )
}
