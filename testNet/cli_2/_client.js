// Chatroom app for consoles
// Client side powered by JavaScript

function connect(){
    var client = require('net').createConnection(9999,'localhost')
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

var client = connect()
var retry = 0
const maxretry = 8
var quitting = false

process.stdin.resume()
process.stdin.on('data',function(data){
    if (data.toString().trim().toLowerCase()==='exit'){
        quitting = true
        console.log('Client exited.')
        client.end()
        process.exit()
    } else {
        client.write(data)
    }
})
