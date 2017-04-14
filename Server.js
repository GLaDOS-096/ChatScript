// Chatroom app for consoles
// This is a no-hard-code version
// Server side powered by JavaScript

var Message = require("./Message.js")

function Chatroom(){
    this.id = Math.random()
    this.sockets = []
    this.policy = "public"
}

