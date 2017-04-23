// Chatroom app for consoles
// This is a no-hard-code version
// App powered by JavaScript

console.log("<system> Process PID: " + process.pid)
console.log("<system> Loading app...")

// loading CORE
const CORE = require('./threads/CORE.js')
const logger = require('./threads/modules/Log.js')
const message = require('./threads/modules/Message.js')
const child_process = require('child_process')
const eol = require('os').EOL

// check
if (CORE) {
    console.log('<system> CORE loaded.')
} else {
    console.error('<ERROR> Failed to load CORE.')
    process.exit()
}

// Registering Log process
var thr_log = CORE.startServer('./threads/logger.js')
message.send({
    "src": "system",
    "msg": "App PID: " + process.pid,
    "flag": "log"
}, thr_log.stdin)

// Registering Server process
function registerServerThread() {
    __server__ = CORE.startServer('./threads/Server.js')
    __server__.stdout.on('data', function (data) {
        if (message.isMSG(data)) {
            var msg = JSON.parse(data.toString())
            if (msg.flag == "log") {
                message.send(msg, thr_log.stdin)
            }
            console.log(message.stringfy(msg))  // fuck this piece of shit
        } else {
            process.stdout.write(data.toString())
        }
    })
    process.stdin.on('data', function (data) {
        __server__.stdin.write(data)
    })
    return __server__
}

var thr_server = registerServerThread()

process.stdin.on('data',function(data){
    if (data.toString()===":exit"+eol){
        process.exit()
    }
})