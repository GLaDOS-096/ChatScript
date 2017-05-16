// Chatroom app for consoles
// This is a no-hard-code version
// Client side powered by JavaScript

console.log('<log> Starting client...')
const net = require('net')
const fs = require('fs')

// reading config
console.log('<log> Loading personal config...')
var config = (function () {
    var __config__ = {}
    fs.readFile('./config/config.json', function (err, data) {
        if (err) {
            console.error('<ERROR> ' + err.message)
            process.exit()
        } else {
            try {
                __config__ = JSON.parse(data.toString())
            } catch (err) {
                console.error('<ERROR> Config file illegal.')
                process.exit()
            }
        }
    })
    return __config__
})()

// loading constants
var retry = 0
const maxretry = 3
var quitting = false

// loading modules
const Message = require("./modules/Message.js")
const Terminal = require('./modules/Terminal.js')

if (Message) {
    console.log('<log> Message module loaded.')
} else {
    console.error('<ERROR> Failed to load Message module.')
    process.exit()
}
if (Terminal) {
    console.log('<log> Terminal module loaded.')
} else {
    console.error('<ERROR> Failed to load Terminal module.')
    process.exit()
}

var msgGroup = new Terminal.MsgGroup(process)

// packed function of connections
function createClient() {
    console.log(config)
    var client = net.connect(9999, "127.0.0.1")
    client.on('connect', function () {
        Message.send({
            "src": config.username,
            "msg": ":online " + require('os').EOL
        }, client)
        retry = 0
    })
    client.on('error', function (err) {
        msgGroup.error({
            "src": "ERROR",
            "msg": err.message
        })
        process.exit()
    })
    client.on('close', function () {
        if (quitting == false) {
            if (retry > maxretry) {
                msgGroup.error({
                    "src": "ERROR",
                    "msg": "Max retry exceeded. Client offline."
                })
                process.exit()
            } else {
                retry += 1
                setTimeout(createClient, 1000)
                msgGroup.log({
                    "src": "log",
                    "msg": "Reconnecting..."
                })
            }
        }
    })
    client.on('data', function (data) {
        try {
            var msg = JSON.parse(data.toString())
            msgGroup.log(msg)
        } catch (e) {
            throw e
        }
    })
    // client.pipe(process.stdout,{end:false})
    return client
}

var client = createClient()

// get stdin to messages and commands
process.stdin.resume()
process.stdin.on('data', function (data) {
    if (data.toString().trim().substring(0, 1) === ':') {
        var cmdl = data.toString().trim().substring(1, data.toString().trim().length)
        var command = cmdl.split(' ')[0]
        switch (command) {
            case "exit":
                quitting = true
                msgGroup.log({
                    "src": "log",
                    "msg": "Quitting..."
                })
                client.end()
                process.exit()
                break
            case "config":
                var key = cmdl.split(' ')[1]
                var val = cmdl.split(' ')[2]
                if (config[key] == undefined) {
                    msgGroup.error({
                        "src": "ERROR",
                        "msg": "No such key."
                    })
                } else {
                    fs.writeFile('./client_config.json', JSON.stringify(config), function (err) {
                        if (err) {
                            msgGroup.error({
                                "src": "ERROR",
                                "msg": "Modification failed."
                            })
                        }
                    })
                }
                break
            case "roomspawn":
            case "roomshut":
            case "roomstat": // this command no reply yet
                Message.send({
                    "src": config.username,
                    "msg": ":" + command
                }, client)
                break
            case "setpolicy":
            case "setlimit":
            case "join":
                Message.send({
                    "src": config.username,
                    "msg": ":" + cmdl
                }, client)
                break
            default:
                msgGroup.error({
                    "src": "ERROR",
                    "msg": "No such command."
                })
        }
    } else if (data.toString() != require('os').EOL) {
        try {
            var msg = JSON.parse(data.toString())
            if (msg.flag != "log") {
                Message.send({
                    "src": config.username,
                    "msg": data.toString().substring(0, data.toString().length - require('os').EOL.length)
                }, client)
            }
        } catch (e) {
            Message.send({
                "src": config.username,
                "msg": ":" + command
            }, client)
        }
    }
})

msgGroup.log({
    "src": "log",
    "msg": "Client started."
})
