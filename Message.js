// Chatroom app module of messages
// Module powered by JavaScript

var __msg__ = {
    "MSG": function MSG(msg){
        this.src = msg.src
        this.msg = msg.msg
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
    }
}

module.exports = __msg__