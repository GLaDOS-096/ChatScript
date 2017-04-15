// Chatroom app module of chatrooms
// Module powered by JavaScirpt

var __chatroom__ = {
    "Chatroom": function Chatroom(){
        this.id = String(Math.random())
        this.sockets = []
        this.policy = "public"
    },
    "chatrooms": {
        "0": {
            id: 0,
            sockets: [],
            policy: "public"
        }
    },
    "spawnRoom": function spawnRoom(socket){
        var __room__ = new Chatroom()
        __room__.sockets.push(socket)
        this.chatrooms[__room__.id] = __room__
        this.chatrooms[socket.roomId].sockets.splice(this.chatrooms[socket.roomId].sockets.indexOf(socket),1)
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
        if (this.chatrooms[__id__] == undefined){
            return "Room not found."
        } else {
            this.chatrooms[socket.roomId].sockets.splice(this.chatrooms[socket.roomId].sockets.indexOf(socket),1)
            socket.roomId = __room__.id
            this.chatrooms[__id__].sockets.push(socket)
            var __msg__ = "Room " + __id__ + " joined."
            return __msg__
        }
    },
}

module.exports = __chatroom__