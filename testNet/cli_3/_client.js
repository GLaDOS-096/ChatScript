// Chatroom app for consoles
// Client side powered by JavaScript

const fs = require('fs')
const net = require('net')
var retry = 0
const maxretry = 3
var quitting = false

function MSG(msg){
    this.src = msg.src
    this.msg = msg.msg
}

function connect(){
    var client = net.connect(9999,'localhost')
    client.on('connect',function(){
        client.write(JSON.stringify({
            "src": config.username,
            "msg": "online "+require('os').EOL
        }))
        retry = 0
    })
    client.on('error',function(err){
        console.log('Client error: ',err.message)
        process.exit()
    })
    client.on('close',function(){
        if (quitting===false){
            if (retry>maxretry){
                client.end()
                throw new Error('Max retries exceeded. Client offline.')
                process.exit()
            }
            retry += 1
            setTimeout(connect,1000)
            console.log('Reconnecting...')
            connect()
        }
    })
    client.on('data',function(data){
        if (JSON.parse(data.toString()) instanceof MSG){
            var msg = JSON.parse(data.toString())
            console.log('<'+msg.src+"> "+msg.msg)
        }
    })
    client.pipe(process.stdout,{end:false})
    return client
}

var config = {}
fs.readFile('./client_config.json',function(err,data){
    if (err) throw err
    config = JSON.parse(data.toString())
})

var client = connect()

process.stdin.resume()
process.stdout.on('data',function(data){
    try{
        var msg = JSON.parse(data.toString())
        console.log('<'+msg.src+"> "+msg.msg)
    } catch(e) {
        console.log(data.toString())
    }
})
process.stdin.on('data',function(data){
    if (data.toString().trim().substring(0,1)===':'){
        var cmdl = data.toString().trim().substring(1,data.toString().trim().length)
        var command = cmdl.split(' ')[0]
        switch(command){
            case "exit":
                quitting = true
                var msg = new MSG({
                    "src": "local",
                    "msg": "No such key."
                })
                console.log(JSON.stringify(msg))
                client.end()
                process.exit()
                break
            case "config":
                var key = cmdl.split(' ')[1]
                var val = cmdl.split(' ')[2]
                if (config[key]==undefined){
                    var msg = new MSG({
                        "src": "local",
                        "msg": "No such key."
                    })
                    console.log(JSON.stringify(msg))
                } else {
                    fs.writeFile('./client_config.json',JSON.stringify(config),function(err){
                        if (err) throw err
                    })
                }
                break
            case "roomspawn":
            case "roomshut":
            case "leave":
                var msg = {
                    "src": config.username,
                    "msg": cmdl
                }
                client.write(Buffer(JSON.stringify(msg)))
                break
            default:
                var msg = new MSG({
                    "src": "local",
                    "msg": "No such command."
                })
                console.log(JSON.stringify(msg))
        }
    } else {
        var msg = {
            "src": config.username,
            "msg": data.toString()
        }
        client.write(Buffer(JSON.stringify(msg)))
    }
})
