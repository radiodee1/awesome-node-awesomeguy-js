// Modules to control application life and create native browser window
//const {app, BrowserWindow} = require('electron')

const { Menu, app, dialog, shell, BrowserWindow } = require('electron');
const defaultMenu = require('electron-default-menu');

const path = require('path')

let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 256, //800
    height: 300, //600 
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('html/game.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
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
          //dialog.showMessageBox({message: 'Sound', buttons: ['OK'] });
          mainWindow.webContents.send("sound", "sound");
     
        }
      },
      {
        label: 'Restart Game',
        click: (item, focusedWindow) => {
          //dialog.showMessageBox({message: 'Restart', buttons: ['OK'] });          
          mainWindow.webContents.send("restart", "restart");
        }
      }
    ]
  });

  menu.splice(1, 0, {
    label: 'Level',
    submenu: [
      {
        label: 'Level 1',
        click: (item, focusedWindow) => {
          //dialog.showMessageBox({message: 'Do 1', buttons: ['OK'] });
          level = 0;
          mainWindow.webContents.send("level", level);

        }
      },
      {
        label: 'Level 2',
        click: (item, focusedWindow) => {
          //dialog.showMessageBox({message: 'Do 2', buttons: ['OK'] });
          level = 1;
          mainWindow.webContents.send("level", level);

        }
      },
      {
        label: 'Level 3',
        click: (item, focusedWindow) => {
          //dialog.showMessageBox({message: 'Do 3', buttons: ['OK'] });
          level = 2;
          mainWindow.webContents.send("level", level);

        }
      },
      {
        label: 'Level 4',
        click: (item, focusedWindow) => {
          //dialog.showMessageBox({message: 'Do 4', buttons: ['OK'] });
          level = 3;
          mainWindow.webContents.send("level", level);

        }
      },
      {
        label: 'Level 5',
        click: (item, focusedWindow) => {
          //dialog.showMessageBox({message: 'Do 5', buttons: ['OK'] });
          level = 4;
          mainWindow.webContents.send("level", level);

        }
      },
      {
        label: 'Level 6',
        click: (item, focusedWindow) => {
          //dialog.showMessageBox({message: 'Do 6', buttons: ['OK'] });
          level = 5;
          mainWindow.webContents.send("level", level);

        }
      },
      {
        label: 'Level 7',
        click: (item, focusedWindow) => {
          //dialog.showMessageBox({message: 'Do 7', buttons: ['OK'] });
          level = 6;
          mainWindow.webContents.send("level", level);
        }
      },
      {
        label: 'Level 8',
        click: (item, focusedWindow) => {
          //dialog.showMessageBox({message: 'Do 8', buttons: ['OK'] });
          level = 7;
          mainWindow.webContents.send("level", level);
        }
      },
      {
        label: 'Level 9',
        click: (item, focusedWindow) => {
          //dialog.showMessageBox({message: 'Do 9', buttons: ['OK'] });
          level = 8;
          mainWindow.webContents.send("level", level);
        }
      },
      {
        label: 'Level 10',
        click: (item, focusedWindow) => {
          //dialog.showMessageBox({message: 'Do 10', buttons: ['OK'] });
          level = 9;
          mainWindow.webContents.send("level", level);
          
        }
      }
    ]
  });

  // Set application menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
});

app.on('show', () => {
  setTimeout(() => {
    app.focus();
  }, 200);
});