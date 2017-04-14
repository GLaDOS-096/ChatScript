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
var Chatrooms = {}

var public = new Chatroom()
public.id = 0

Chatroom[public.id] = public

console.log('Server running on 127.0.0.1:9999.')

server.on('connection',function(socket){
    public.sockets.push(socket)
    console.log('Client connected.')
    console.log('Online clients: ',public.sockets.length)
    socket.on('data',function(data){
        var msg = msg = JSON.parse(data.toString())
        switch(msg.msg.split(' ')[0]){
            case "online":
                socket.eol = msg.msg.substring(7)
                socket.write(JSON.stringify({
                    "src": "server",
                    "msg": "Client online."+socket.eol
                }))
                break
            case "roomspawn":
                var __room__ = new Chatroom()
                socket.write(JSON.stringify({
                    "src": "server",
                    "msg": "Room ID: "+__room__.id+socket.eol
                }))
                __room__.sockets.push(socket)
                Chatroom[__room__.id] = __room__
                public.sockets.splice(public.sockets.indexOf(socket),1)
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
        var index = public.sockets.indexOf(socket)
        public.sockets.splice(index,1)
        console.log('Online clients: ',public.sockets.length)
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