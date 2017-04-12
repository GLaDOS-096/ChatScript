// Chatroom app for consoles
// Server side powered by JavaScript

function Chatroom(){
    this.id = Math.random()
    this.sockets = []
    this.policy = "public"
}

console.log('Starting server...')

const server = require('net').createServer().listen(9999)
// const eol = require('os').EOL
var public = new Chatroom()
public.id = 0
console.log('Server running on 127.0.0.1:9999.')

server.on('connection',function(socket){
    public.sockets.push(socket)
    console.log('Client connected.')
    console.log('Online clients: ',sockets.length)
    socket.on('data',function(data){
        var msg = JSON.parse(data.toString())
        switch(msg.msg.split(' ')[0]){
            case "roomspawn":
                console.log('Command received from '+msg.src+': '+msg.msg)
                break
            case "roomshut":
                console.log('Command received from '+msg.src+': '+msg.msg)
                break
            case "join":
                console.log('Command received from '+msg.src+': '+msg.msg)
                break
            case "leave":
                console.log('Command received from '+msg.src+': '+msg.msg)
                break
            default:
                console.log('Data: ',msg.msg)
                public.sockets.forEach(function(__socket__){
                    if (__socket__!=socket){
                        __socket__.write(msg.msg.trim())
                    }
                })
                break
        }
    })
    socket.on('close',function(){
        console.log('Client offline.')
        var index = sockets.indexOf(socket)
        sockets.splice(index,1)
        console.log('Online clients: ',sockets.length)
    })
})

server.on('error',function(err){
    console.log('Server error: ',err.message)
})

server.on('close',function(){
    console.log('Server offline.')
})

process.stdin.resume()
process.stdin.on('data',function(data){
    if (data.toString().trim().toLowerCase()==='exit'){
        console.log('Server closed.')
        process.exit()
    }
})