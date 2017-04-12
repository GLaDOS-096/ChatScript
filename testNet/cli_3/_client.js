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
    if (data.toString().trim().toLowerCase()==='exit'){
        quitting = true
        console.log('Client exited.')
        client.end()
        process.exit()
    } else {
        var msg = {
            "src": config.username,
            "msg": config.username+': '+data.toString()
        }
        client.write(Buffer(JSON.stringify(msg)))
    }
})
