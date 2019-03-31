// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain} = require('electron')

require('electron-reload')(__dirname);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let addWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    addWindow = null
    app.quit()
  })
}

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 350,
    height: 200,
    webPreferences: {
      nodeIntegration: true
    }
  });

  addWindow.loadFile('add.html')
  addWindow.on('closed', () => {
    addWindow = null;
  })
}

function clearTodos() {
  mainWindow.webContents.send('todo:clear', true);
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Create Todo',
        click() {
          createAddWindow()
        }
      },
      {
        label: 'Clear Todos',
        click() {
          clearTodos()
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ?
          'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit()
        }
      }
    ]
  }
];

ipcMain.on('todo:add', (event, value) => {
  console.log("Todo", value);
  mainWindow.webContents.send('todo:add', value);
  addWindow.close();
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
