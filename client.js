// Chatroom app for consoles
// Client side powered by JavaScript

const fs = require('fs')
const net = require('net')
var retry = 0
const maxretry = 8
var quitting = false

function connect(){
    var client = net.createConnection(9999,'localhost')
    client.on('connect',function(){
        console.log('Client online.')
        retry = 0
    })
    client.on('error',function(err){
        console.log('Client error: ',err.message)
    })
    client.on('close',function(){
        if (quitting===false){
            if (retry>maxretry){
                client.end()
                throw new Error('Max retries exceeded. Client offline.')
            }
            retry += 1
            setTimeout(connect,1000)
            console.log('Reconnecting...')
            connect()
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
process.stdin.on('data',function(data){
    if (data.toString().trim().substring(0,3)==='>> '){
        var cmdl = data.toString().trim().substring(3,data.toString().trim().length-3)
        var command = cmdl.split(' ')[0]
        switch(command){
            case "exit":
                quitting = true
                console.log('Client exited.')
                client.end()
                process.exit()
                break
            case "config":
                var key = cmdl.split(' ')[1]
                var val = cmdl.split(' ')[2]
                if (config[key]==undefined){
                    console.log('Error: no such key.')
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
        }
    } else {
        var msg = {
            "src": config.username,
            "msg": config.username+': '+data.toString()
        }
        client.write(Buffer(JSON.stringify(msg)))
    }
})
