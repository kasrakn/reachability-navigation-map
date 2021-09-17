import { useState } from 'react';
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
    const [places, setPlaces] = useState([])

    const placesArray = [
        {
            id: 1,
            name: "رستوران",
            icon: <RestaurantIcon />,
            color: colors.amber[500]
        }, 
        {
            id: 2, 
            name: "بانک",
            icon: <AccountBalanceIcon/>,
            color: colors.red[600]
        },
        {
            id: 3,
            name: "ATM",
            icon: <AtmIcon/>,
            color: colors.green[500]
        },
        {
            id: 4,
            name: "پمپ بزنین",
            icon: <RiGasStationFill />,
            color: colors.blue[500]
        },
        {
            id: 5,
            name: "مراکز درمانی",
            icon: <GiHealthNormal/>,
            color: colors.red[500]
        }, 
        {
            id: 6,
            name: "داروخانه",
            icon: <LocalPharmacyIcon/>,
            color: colors.purple[500]
        },
        {
            id: 7,
            name: "مدرسه",
            icon: <FaSchool/>,
            color: colors.orange[500]
        },
        {
            id: 8,
            name: "دانشگاه",
            icon: <SchoolIcon/>,
            color: colors.green[700]
        },
        {
            id: 9,
            name: "باشگاه ورزشی",
            icon: <CgGym/>,
            color: colors.brown[500]
        },
        {
            id: 10,
            name: "مراکز ورزشی",
            icon: <SportsBasketballIcon/>,
            color: colors.pink[500]
        },
        {
            id: 11,
            name: "پارکینگ",
            icon: <LocalParkingIcon/>,
            color: colors.blue[700]
        }
    ]

    const fetchPoi = async() => {
        let items = []
        selectedPOIs.map((poi) => {
            const response = fetch(
                `../../../../mashhad-data/${poi}.geojson`, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            items.push(await response.json())
        })
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
        {placesArray.map((cat) => (
            <ListItem 
                key={cat.id}
                className={classes.poiListItem}>
                <ListItemAvatar>
                    <Avatar style={{backgroundColor: cat.color}}>
                        {cat.icon}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText className={classes.listText} primary={cat.name} />
                <Checkbox
                    className={classes.listCheckbox}
                    edge="start"
                    // onChange={handleToggle(value)}
                    // checked={checked.indexOf(value) !== -1}
                    // inputProps={{ 'aria-labelledby': labelId }}
                />
            </ListItem>
        ))}
        </List>
    )
}
