!function(){

  window["~"+document.currentScript.src] = "!"+arguments.callee.toString()+"()";

  if(!Array.prototype.pull){
    Object.defineProperty(Array.prototype,"pull",{
      enumerable  : false,
      value       : function pull(){
                      var itemsToPull = [...arguments];
                      itemsToPull.forEach((item)=>{
                        var index = this.indexOf(item);
                        if(index>-1){
                          this.splice(index,1);
                        }
                      });
                      return this.length;
                    },
    });
  }

  addEventListener("gamepadconnected",function(e){
    if(typeof window["ongamepadconnected"] === "function"){
      window["ongamepadconnected"](e);
    }
  });
  
  addEventListener("gamepaddisconnected",function(e){
    if(typeof window["ongamepaddisconnected"] === "function"){
      window["ongamepaddisconnected"](e);
    }
  });
  
  class GamepadProxy{
    constructor(gamepad){
      this.axes     = [];
      this.buttons  = [];
      this.analog   = null;
      this.debug    = null;
      gamepad.buttons.forEach((button,n)=>{
        this.buttons[n] = {
          pressed         : null,
          onpressed       : null,
          onjustpressed   : null,
          onreleased      : null,
          onjustreleased  : null,
        };
      });
      gamepad.axes.forEach((axis,n)=>{
        this.axes[n] = {
          value     : null,
          onchange  : null,
          threshold : null, 
        };
      });
      this.listener = setInterval(()=>{
        var i = gamepad.index;
        navigator.getGamepads()[i] && navigator.getGamepads()[i].buttons.forEach((button,n)=>{
          var status = !!button["value"||"touched"||"pressed"];
          if(status){
            if(!this.buttons[n].pressed){
              this.buttons[n].pressed = true;
              typeof this.buttons[n].onjustpressed==="function" && this.buttons[n].onjustpressed();
              this.debug && console.log("gamepad @"+gamepad.id+" button @"+n+" pressed");
            }else{
              typeof this.buttons[n].onpressed==="function" && this.buttons[n].onpressed();
            }
          }else{
            if(this.buttons[n].pressed){
              this.buttons[n].pressed = false;
              typeof this.buttons[n].onjustreleased==="function" && this.buttons[n].onjustreleased();
              this.debug && console.log("gamepad @"+gamepad.id+" button @"+n+" released");
            }else{
              typeof this.buttons[n].onreleased==="function" && this.buttons[n].onreleased();
            }
          }
        });
        navigator.getGamepads()[i] && navigator.getGamepads()[i].axes.forEach((value,n)=>{
          var axis = this.axes[n];
          if( axis.value!==value ){
            axis.value = value;
            if( value < 0 - axis.threshold || value > 0 + axis.threshold ){
              typeof axis.onchange==="function" && axis.onchange();
              this.debug && console.log("gamepad @"+gamepad.id+" axis @"+n+": "+axis.value);
            }
          }
        });
      });
      this.gamepad  = gamepad;
    }
    get [Symbol.toStringTag]() {
      return "GamepadProxy";
    }
  }
  
  window.gamepads = [];
  window.ongamepadconnected = function(e){
    window.gamepads.push(new GamepadProxy(e.gamepad));
    window.gamepads[window.gamepads.length-1].debug = true;
    console.info("gamepad connected");
    console.log(window.gamepads);
  };
  window.ongamepaddisconnected = function(e){
    var gamepadToPull = window.gamepads.filter(_=>_.gamepad.index===e.gamepad.index)[0];
    clearInterval(gamepadToPull.listener);
    window.gamepads.pull(gamepadToPull);
    console.info("gamepad disconnected");
    console.log(window.gamepads);
  };
  
}()
