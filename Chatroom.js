// Chatroom app module of chatrooms
// Module powered by JavaScirpt

var __chatroom__ = {
    "Chatroom": function Chatroom(){
        this.id = Math.random()
        this.sockets = []
        this.policy = "public"
    },
    "Chatrooms": {
        "0": {
            id: 0,
            sockets: [],
            policy: "public"
        }
    },
    "spawnRoom": function spawnRoom(socket){
        var __room__ = new Chatroom()
        __room__.sockets.push(socket)
        this.Chatrooms[__room__.id] = __room__
        this.Chatrooms[socket.roomId].sockets.splice(this.Chatrooms[socket.roomId].sockets.indexOf(socket),1)
        socket.roomId = __room__.id
    }
}