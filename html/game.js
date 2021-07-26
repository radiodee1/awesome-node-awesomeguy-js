//console.log('process log')

window.api.receive("sound", (data) => {
   console.log(`Received toggle sound ${data} from main process`);
});

window.api.receive("restart", (data) => {
   console.log(`Received restart ${data} from main process`);
});

window.api.receive("level", (data) => {
   console.log(`Received level ${data} from main process`);
   level = + data;
   var obj = document.getElementById("level_select");
   obj.selectedIndex = level + 1;
   restart_game();
});
