const { app, BrowserWindow } = require('electron');
const ejse = require('ejs-electron');

ejse.data({
    pageName : 'Excel-Clone',
    rows: 100,
    col: 26
})
function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
          nodeIntegration: true
        }
    });


    win.loadFile('index.ejs').then(function(){
        win.removeMenu();
        win.maximize();
        win.show();
        win.webContents.openDevTools();
     });
}

let apppromise = app.whenReady();
apppromise.then(function(){
  createWindow();

}).catch(function(err){
  console.log(err);
});















