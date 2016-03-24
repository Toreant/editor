/**
 * Created by apache on 16-3-22.
 */

'use strict';
var ipc = require("electron").ipcMain;
var Analysis = require('./analysis');

ipc.on('edit-scan',function(event,args) {

    console.log(args);
    var app = new Analysis();

    event.sender.send('code-receive',app.render(args));
});
