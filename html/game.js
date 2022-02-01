//console.log('process log')
let scale = 1;

//import * as model from './js/model/model.js';
//scale = model.scale;

window.api.receive("sound", (data) => {
   //console.log(`Received toggle sound ${data} from main process`);
   var obj = document.getElementById("sound_checkbox");
   //console.log(obj.checked);
   obj.checked = ! obj.checked;
   preferences_sound = obj.checked;
});

window.api.receive("restart", (data) => {

   try {
      restart_game(scale);
   }
   catch (err) {
      window.location = "./game.html";
      restart_game(scale);
   }
   //restart_game();
});

window.api.receive("level", (data) => {
   try {
      level = + data;
      var obj = document.getElementById("level_select");
      obj.selectedIndex = level + 1;
      restart_game(scale);
   }
   catch(err) {
      window.location = "./game.html";
      //level = + data;
      //var obj = document.getElementById("level_select");
      //obj.selectedIndex = level + 1;
      //restart_game();
   }
});

window.api.receive("size", (data) => {
   try {
      scale = (+ data);
      //model.scale = (+ data);
      //var obj = document.getElementById("level_select");
      //obj.selectedIndex = level + 1;
      restart_game(scale);
   }
   catch(err) {
      window.location = "./game.html";
      //level = + data;
      //var obj = document.getElementById("level_select");
      //obj.selectedIndex = level + 1;
      //restart_game();
   }
});

window.api.receive("text", (data) => {
   //console.log(`Received text ${data} from main process`);
   window.location = "./index.html";
   //document.getElementById('end_game').click();
   //process.exit();
});

//var obj = document.getElementById("my_canvas");
//obj.focus();
