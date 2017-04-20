// Chatroom app module of messages
// Module powered by JavaScript

var __msg__ = {
    "MSG": function MSG(msg){
        var self = this
        self.src = msg.src
        self.msg = msg.msg
    },
    "isMSG": function isMSG(data){
        try {
            if (data instanceof Buffer){
                var _ = JSON.parse(data.toString())
            } else if (data instanceof String){
                var _ = JSON.parse(data)
            }
            return true
        } catch(e) {
            return false
        }
    },
    "send": function(msg,socket){
        socket.write(JSON.stringify(msg))
    },
    "stringfy": function stringfy(msg){
        var __str__ = "<" + msg.src + "> " + msg.msg
        return __str__
    }
}

module.exports = __msg__