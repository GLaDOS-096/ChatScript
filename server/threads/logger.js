// Chatroom app for consoles
// This is a no-hard-code version
// Logger thread powered by JavaScript

const logger = require('./modules/Log.js')
const message = require('./modules/Message.js')

var Logger = new logger({
    "tickrate": 1000,
    "path": "./logs"
})

process.stdin.on('data',function(data){
    if (message.isMSG(data)){
        var msg = JSON.parse(data.toString())
        if (msg.flag=='log'){
            Logger.writeLog(msg)
        }
    }
})
