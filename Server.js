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
const Terminal = require('./modules/Terminal.js')

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
if (Terminal){
    console.log('<log> Terminal module loaded.')
} else {
    console.error('<ERROR> Failed to load Terminal module.')
    process.exit()
}

var msgGroup = new Terminal.MsgGroup()

// registering 'connect' events
server.on('connection',function(socket){
    msgGroup.log({
        "src": "log",
        "msg": "New client online."
    })
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
                    var id = msg.msg.split(' ')[1]
                    var __msg__ = Chatroom.join(socket,id)
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
        msgGroup.log({
            "src": "log",
            "msg": "Client offline."
        })
    })
})

server.on('error',function(err){
    msgGroup.error({
        "src": "ERROR",
        "msg": "Server error: " + err.message
    })
    process.exit()
})

server.on('close',function(){
    msgGroup.log({
        "src": "log",
        "msg": "Server offline."
    })
})

// command supports
process.stdin.resume()
process.stdin.on('data',function(data){
    if (data.toString().trim().substring(0,1)===':'){
        var cmdl = data.toString().trim().substring(1,data.toString().trim().length)
        var command = cmdl.split(' ')[0]
        switch(command){
            case "exit":
                quitting = true
                msgGroup.log({
                    "src": "log",
                    "msg": "Quitting..."
                })
                process.exit()
                break
            case "roomstat":
                try {
                    var __id__ = cmdl.split(' ')[1]
                    var __room__ = Chatroom.chatrooms[__id__]
                    msgGroup.initGroup()
                    msgGroup.pushMsg([{
                        "src": "cmd",
                        "msg": "Room status of " + __id__
                    },{
                        "src": "res",
                        "msg": "Online clients: " + __room__.sockets.length
                    },{
                        "src": "res",
                        "msg": "Room policy: " + __room__.policy
                    }])
                    msgGroup.endGroup()
                } catch(e) {
                    msgGroup.error({
                        "src" : "ERROR",
                        "msg": e
                    })
                }
                break
            default:
                msgGroup.error({
                    "src" : "ERROR",
                    "msg": "No such command."
                })
        }
    }
})

msgGroup.log({
    "src": "log",
    "msg": "Server running on 127.0.0.1:9999."
})
