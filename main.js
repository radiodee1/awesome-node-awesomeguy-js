// Modules to control application life and create native browser window
//const {app, BrowserWindow} = require('electron')

const { Menu, app, dialog, shell, BrowserWindow } = require('electron');
const defaultMenu = require('electron-default-menu');

const path = require('path')
const {ipcMain} = require('electron')



function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800, //256
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('html/game.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('ready', () => {
  // Get default menu template
  const menu = defaultMenu(app, shell);

  // Add custom menu
  menu.splice(0, 4, {
    label: 'Settings',
    submenu: [
      
      {
        label: 'Toggle Sound',
        click: (item, focusedWindow) => {
          dialog.showMessageBox({message: 'Sound', buttons: ['OK'] });

          ipcMain.on('asynchronous-message', (event, arg) => {
            console.log(arg)
         
            // Event emitter for sending asynchronous messages
            event.sender.send('asynchronous-reply', 'async pong')
         })
         
        }
      },
      {
        label: 'Restart Game',
        click: (item, focusedWindow) => {
          dialog.showMessageBox({message: 'Restart', buttons: ['OK'] });

          ipcMain.on('asynchronous-message', (event, arg) => {
            console.log(arg)
         
            // Event emitter for sending asynchronous messages
            event.sender.send('asynchronous-reset', 'async pong')
         })
         
          
        }
      }
    ]
  });

  menu.splice(1, 0, {
    label: 'Start Level',
    submenu: [
      {
        label: 'Level 1',
        click: (item, focusedWindow) => {
          dialog.showMessageBox({message: 'Do 1', buttons: ['OK'] });
          level = 0;
        }
      },
      {
        label: 'Level 2',
        click: (item, focusedWindow) => {
          dialog.showMessageBox({message: 'Do 2', buttons: ['OK'] });
          level = 1;
        }
      },
      {
        label: 'Level 3',
        click: (item, focusedWindow) => {
          dialog.showMessageBox({message: 'Do 3', buttons: ['OK'] });
          level = 2;
        }
      },
      {
        label: 'Level 4',
        click: (item, focusedWindow) => {
          dialog.showMessageBox({message: 'Do 4', buttons: ['OK'] });
          level = 3;
        }
      },
      {
        label: 'Level 5',
        click: (item, focusedWindow) => {
          dialog.showMessageBox({message: 'Do 5', buttons: ['OK'] });
          level = 4;
        }
      },
      {
        label: 'Level 6',
        click: (item, focusedWindow) => {
          dialog.showMessageBox({message: 'Do 6', buttons: ['OK'] });
          level = 5;
        }
      },
      {
        label: 'Level 7',
        click: (item, focusedWindow) => {
          dialog.showMessageBox({message: 'Do 7', buttons: ['OK'] });
          level = 6;
        }
      },
      {
        label: 'Level 8',
        click: (item, focusedWindow) => {
          dialog.showMessageBox({message: 'Do 8', buttons: ['OK'] });
          level = 7;
        }
      },
      {
        label: 'Level 9',
        click: (item, focusedWindow) => {
          dialog.showMessageBox({message: 'Do 9', buttons: ['OK'] });
          level = 8;
        }
      },
      {
        label: 'Level 10',
        click: (item, focusedWindow) => {
          dialog.showMessageBox({message: 'Do 10', buttons: ['OK'] });
          level = 9;
          game.restart_game();
        }
      }
    ]
  });

  // Set application menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
});