// Chatroom app for consoles
// This is a no-hard-code version
// App powered by JavaScript

console.log("<system> Process PID: " + process.pid)
console.log("<system> Loading app...")

// loading CORE
const CORE = require('./threads/CORE.js')
console.log("asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd")
const logger = require('./threads/modules/Log.js')
const message = require('./threads/modules/Message.js')
const child_process = require('child_process')

// check
if (CORE){
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
},thr_log)

// Registering Server process
var thr_server = CORE.startServer('./threads/server.js')
thr_server.stdout.on('data',function(data){
    if (message.isMSG(data)){
        var msg = JSON.parse(data.toString())
        if (msg.flag=="log"){
            thr_log.stdin.write(data)
        } else {
            message.send(msg,process.stdout)
        }
    } else {
        process.stdout.write(data.toString())
    }
})
process.stdin.on('data',function(data){
    thr_server.stdin.write(data)
})