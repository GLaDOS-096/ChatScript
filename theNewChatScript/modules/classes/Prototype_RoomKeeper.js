/*  
    RoomKeeper for ChatScript.
    Turns out to be the universal message template across the app.
    Usage:
        Chatroom():         The prototype of Chatroom instance.
        Chatrooms:          The object to keep all the Chatroom() instances by index.
                            Automatilcaly with an undeletable '0' public room inside.
        spawnRoom(socket):  Create a room according to the client that pushes this request.
                            Returns a specified new rooom ID.
        shutRoom(roomId):   Shut the room down according to its ID.
                            Move all the sockets to room '0'.
        join(roomId):       Change the room of the socket that pushes this request according to the room ID given.
 */

const EOL = require('os').EOL
const Message = require('./Prototype_MessageKeeper.js')
const ERR_CODE = require('./_ERR_CODE_.js')

var RoomKeeper = {
    "Chatroom": function Chatroom(){
        this.id = String(Math.random())
        this.sockets = []
        this.policy = "public"
        this.limit = 4
    },
    "chatrooms": {
        "0": {
            id: 0,
            sockets: [],
            policy: "public",
            limit: 1024
        }
    },
    "spawnRoom": function spawnRoom(socket){
        var self = this
        var __room__ = new __chatroom__.Chatroom()
        __room__.sockets.push(socket)
        self.chatrooms[__room__.id] = __room__
        self.chatrooms[socket.roomId].sockets.splice(self.chatrooms[socket.roomId].sockets.indexOf(socket),1)
        socket.roomId = __room__.id
        return __room__.id
    },
    "shutRoom": function shutRoom(room){
        room.sockets.forEach(function(socket,index){
            socket.roomId = "0"
        })
        this.chatrooms[0].sockets.concat(room.sockets)
        this.chatrooms[room.roomId] = undefined
    },
    "join": function join(socket,__id__){
        var self = this
        if (self.chatrooms[__id__] == undefined || self.chatrooms[__id__].policy=="private"){
            return "Room not found."
        } else if (self.chatrooms[__id__].sockets.length<self.chatrooms[__id__].limit){
            if (socket.roomId==undefined){
                socket.roomId = __id__
                self.chatrooms[__id__].sockets.push(socket)
                var __msg__ = "Room " + __id__ + " joined."
                return __msg__
            } else {
                var index = self.chatrooms[socket.roomId].sockets.indexOf(socket)
                self.chatrooms[socket.roomId].sockets.splice(index,1)
                socket.roomId = __id__
                self.chatrooms[__id__].sockets.push(socket)
                var __msg__ = "Room " + __id__ + " joined."
                return __msg__
            }
        } else {
            return "Limit reached."
        }
    },
}

module.exports = RoomKeeper
