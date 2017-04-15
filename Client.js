// Chatroom app for consoles
// This is a no-hard-code version
// Client side powered by JavaScript

console.log('<log> Starting client...')
const net = require('net')
const fs = require('fs')

// reading config
console.log('<log> Loading personal config...')
var config = {}
fs.readFile('./client_config.json',function(err,data){
    if (err){
        // console.error('<ERROR> '+err.message)
        // process.exit()
        config = {
            "username": "client"
        }
    } else {
        try {
            config = JSON.parse(data.toString())
        } catch(err) {
            console.error('<ERROR> Config file illegal.')
            process.exit()
        }
    }
})

// loading constants
var retry = 0
const maxretry = 3
var quitting = false

// loading modules
const Message = require("./modules/Message.js")
if (Message){
    console.log('<log> Message module loaded.')
} else {
    console.error('<ERROR> Failed to load Message module.')
    process.exit()
}

// packed function of connections
function createClient(){
    var client = net.connect(9999,'localhost')
    client.on('connect',function(){
        Message.send({
            "src": config.username,
            "msg": "online " + require('os').EOL
        },client)
        retry = 0
    })
    client.on('error',function(err){
        console.error('<ERROR> ',err.message)
        process.exit()
    })
    client.on('close',function(){
        if (quitting==false){
            if (retry > maxretry){
                client.end()
                console.error('<ERROR> Max retry exceeded. Client offline.')
                process.exit()
            } else {
                retry += 1
                setTimeout(createClient,1000)
                console.log('<log> Reconnecting...')
            }
        }
    })
    client.on('data',function(data){
        try {
            var msg = JSON.parse(data.toString())
            console.log(Message.stringfy(msg))
        } catch(e) {
            throw e
        }
    })
    client.pipe(process.stdout,{end:false})
    return client
}

var client = createClient()

// get stdin to messages and commands
process.stdin.resume()
process.stdin.on('data',function(data){
    if (data.toString().trim().substring(0,1)===':'){
        var cmdl = data.toString().trim().substring(1,data.toString().trim().length)
        var command = cmdl.split(' ')[0]
        switch(command){
            case "exit":
                quitting = true
                console.log('<log> Quitting...')
                client.end()
                process.exit()
                break
            case "config":
                var key = cmdl.split(' ')[1]
                var val = cmdl.split(' ')[2]
                if (config[key]==undefined){
                    console.error('<ERROR> No such key.')
                } else {
                    fs.writeFile('./client_config.json',JSON.stringify(config),function(err){
                        if (err) console.error('<ERROR> Modification failed.')
                    })
                }
                break
            case "roomspawn":
            case "roomshut":
                Message.send({
                    "src": config.username,
                    "msg": command
                },client)
                break
            default:
                console.error('<ERROR> No such command.')
        }
    } else {
        Message.send({
            "src": config.username,
            "msg": data.toString()
        },client)
    }
})

console.log('<log> Client started.')
