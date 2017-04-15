// Chatroom app for consoles
// This is a no-hard-code version
// Server side powered by JavaScript

console.log('<log> Starting server...')

const server = require('net').createServer().listen(9999)

// loading constants and dependencies
const publicId = "0"
const eol = require('os').EOL
const Message = require("./modules/Message.js")
const Chatroom = require('./modules/Chatroom.js')

// module check
if (Message){
    console.log('<log> Message module loaded.')
} else {
    console.error('<ERROR> Failed to load Message module.')
    process.exit()
}
if (Chatroom){
    console.log('<log> Chatroom module loaded.')
} else {
    console.error('<ERROR> Failed to load Chatroom module.')
    process.exit()
}

// registering 'connect' events
server.on('connection',function(socket){
    console.log('<log> New client online.')
    Chatroom.join(socket,publicId)
    // parsing message from client side
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
                        "msg": "Room ID: " + __id__ + socket.eol
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
                    console.log('<DATA> ',Message.stringfy(msg).substring(0,Message.stringfy(msg).length-socket.eol.length))
                    Chatroom.chatrooms[socket.roomId].sockets.forEach(function(__socket__){
                        if (__socket__!=socket){
                            Message.send(msg,__socket__)
                        }
                    })
                    break
            }
        } catch(e) {
            console.log('<log> Invalid message received.')
        }
    })
    socket.on('close',function(){
        Chatroom.chatrooms[socket.roomId].sockets.splice(Chatroom.chatrooms[socket.roomId].sockets.indexOf(socket),1)
        console.log('<log> Client offline.')
    })
})

server.on('error',function(err){
    console.error('<ERROR> Server error: ',err.message)
})

server.on('close',function(){
    console.log('<log> Server offline.')
})

// simple command for exit
process.stdin.resume()
process.stdin.on('data',function(data){
    if (data.toString().trim().toLowerCase()==='exit'){
        console.log('<log> Server closed.')
        process.exit()
    }
})

console.log('<log> Server running on 127.0.0.1:9999.')