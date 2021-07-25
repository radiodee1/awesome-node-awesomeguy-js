

window.api.receive("asynchronous-reset", (data) => {
   console.log(`Received ${data} from main process`);
});
//import {ipcRenderer} from 'electron';
// Synchronous message emmiter and handler
//console.log(ipcRenderer.sendSync('synchronous-message', 'sync ping')) 

// Async message handler
/*
ipcRenderer.on('asynchronous-reset', (event, arg) => {
   console.log(arg);
   console.log('pong');
})
*/