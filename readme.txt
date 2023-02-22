makes gamepad api less confusing i suppose? idk

creates window.gamepads, which is an array that stores arbitrary GamepadProxy objects.
each GamepadProxy object looks like this:

{
  axes    : [
  
    /* array of axes organized by their index as mapped to the original gamepad object */
    
    { /* example of arbitrary axis object */
    
      value     : {number},   // value of the axis/joystick fed from native gamepad object
      threshold : {number},   // you can define the threshold to the distance each axis should be from its neutral position before triggering the onchange function
      onchange  : {function}, // fires when the value is above or below the threshold from neutral position
    },
    
    /* ...etc */
    
  ],
  buttons : [
    
    /* array of buttons organized by their index as mapped to the original gamepad object */
    
    { /* example of arbitrary button object */
    
      pressed         : {boolean},  // value of the button, whether it is pressed or not, fed from native gamepad object
      /* pseudo-handlers */
      onpressed       : {function}, // fires when the button is down
      onjustpressed   : {function}, // fires first event cycle when the button is down (once)
      onreleased      : {function}, // fires when the button is up
      onjustreleased  : {function}, // fires first event cycle when the button is up (once)
    },
    
    /* ... etc */
  
  ],
  analog  : {boolean},
  debug   : {boolean},
  gamepad : {object},     // stores the browser's native gamepad object this is wrapping
  listener : {function},  // stores the interval function that is monitoring the original gamepad it is wrapping
}
