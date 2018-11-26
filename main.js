// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 150, height: 230})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// 显示对话框
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

ipc.on('open-work-dialog', function (event) {
  const options = {
    type: 'info',
    title: '时间到了',
    message: "休息结束，工作开始",
    buttons: ['是']
  }
  dialog.showMessageBox(options, function (index) {
    event.sender.send('work-dialog-selection', index)
  });
});

ipc.on('open-rest-dialog', function (event) {
  const options = {
    type: 'info',
    title: '时间到了',
    message: "休息开始",
    buttons: ['是']
  }
  dialog.showMessageBox(options, function (index) {
    event.sender.send('rest-dialog-selection', index)
  });
});

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