//console.log('process log')

window.api.receive("sound", (data) => {
   //console.log(`Received toggle sound ${data} from main process`);
   var obj = document.getElementById("sound_checkbox");
   //console.log(obj.checked);
   obj.checked = ! obj.checked;
   preferences_sound = obj.checked;
});

window.api.receive("restart", (data) => {
   //console.log(`Received restart ${data} from main process`);
   restart_game();
});

window.api.receive("level", (data) => {
   //console.log(`Received level ${data} from main process`);
   level = + data;
   var obj = document.getElementById("level_select");
   obj.selectedIndex = level + 1;
   restart_game();
});

var obj = document.getElementById("my_canvas");
obj.focus();