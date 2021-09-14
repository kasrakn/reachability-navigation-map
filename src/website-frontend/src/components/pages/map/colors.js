import { colors } from '@material-ui/core'

export function getColor(ind) {
    const colorsArray = [
        colors.pink, 
        colors.blue, 
        colors.green, 
        colors.purple,
        colors.lightBlue, 
        colors.deepOrange, 
        colors.amber, 
        colors.brown, 
        colors.deepPurple, 
        colors.red, 
        colors.cyan,
        colors.lime,
        colors.indigo,
        colors.orange,  
        colors.lightGreen, 
        colors.teal, 
        colors.yellow,
        colors.common, 
        colors.blueGrey, 
        colors.grey, 
      ]
    return (colorsArray[ind])
}