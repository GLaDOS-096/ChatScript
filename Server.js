// Chatroom app for consoles
// This is a no-hard-code version
// Server side powered by JavaScript

const server = require('net').createServer().listen(9999)

console.log('Starting server...')

// loading constants and dependencies
const publicId = "0"
const eol = require('os').EOL
const Message = require("./server_modules/Message.js")
const Chatroom = require('./server_modules/Chatroom.js')

// registering 'connect' events
server.on('connection',function(socket){
    console.log('<log> New client online.')
    Chatroom.join(socket,publicId)
    socket.on('data',function(data){
        try {
            var msg = JSON.parse(data.toString())
            switch(msg.msg.split(' ')[0]){
                case "online":
                    socket.eol = msg.msg.substring(7)
                    break
                case "roomspawn":
                    var __id__ = Chatroom.spawnRoom(socket)
                    Message.send({
                        "src": "server",
                        "msg": "Room ID: " + __room__.id + socket.eol
                    },socket)
                    break
                case "roomshut":
                    var __id__ = socket.roomId
                    Chatroom.shutRoom(Chatroom.chatrooms[socket.roomId])
                    Message.send({
                        "src": "server",
                        "msg": "Room " + __id__ + " shut." + socket.eol
                    },socket)
                    break
                case "join":
                    var __msg__ = Chatroom.join(socket,msg.msg.split(' ')[1])
                    Message.send({
                        "src": "server",
                        "msg": __msg__ + socket.eol
                    },socket)
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
        }
    })
})

server.on('error',function(err){
    console.log('Server error: ',err.message)
})

server.on('close',function(){
    console.log('Server offline.')
})