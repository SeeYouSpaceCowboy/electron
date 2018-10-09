const electron = require('electron')

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow
let addWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(`file://${ __dirname }/main.html`)
  mainWindow.on('closed', () => app.quit())

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  })

  addWindow.loadURL(`file://${ __dirname }/add.html`)
  addWindow.on('closed', () => addWindow = null)
}

function clearList() {
  mainWindow.webContents.send(`todo:clear`)
}

ipcMain.on('todo:add', (e, todo) => {
  mainWindow.webContents.send('todo:add', todo)
  addWindow.close()
})

let   powerKey = process.platform === 'darwin' ? 'Command' : 'Ctrl'

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        accelerator: `${ powerKey }+T`,
        click() { createAddWindow() }
      },
      {
        label: 'Clear',
        accelerator: `${ powerKey }+K`,
        click() { clearList() }
      },
      {
        label: 'Quit',
        accelerator: `${ powerKey }+Q`,
        click() {
          app.quit()
        }
      }
    ]
  }
]

if(process.platform === 'darwin') menuTemplate.unshift({})

if(process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'Developer',
    submenu: [
      { role: 'reload' },
      {
        label: 'Developer Tools',
        accelerator: `Alt+${ powerKey }+I`,
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    ]
  })
}
