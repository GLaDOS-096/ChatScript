// Chatroom app module of terminals
// Module powered by JavaScript

// loading dependencies
const readline = require('readline')
const message = require('./Message.js')

var Terminal = {
    // class Terminal.Monitor
    "Monitor": function Monitor(options){
        var self = this
        self.__instance__ = readline.createInterface(options)
        self.__instance__.setPrompt(options.prompt || "<client> ")
        self.clearScreen = function clearScreen(stream){
            var stream = stream || process.stdout
            readline.cursorTo(stream,0,0)
            readline.clearScreenDown(stream)
            self.__instance__.prompt
        }
        self.clearLine = function clearLine(mode,pos,stream){
            var stream = stream || process.stdout
            switch(mode){
                case "absolute":
                    readline.cursorTo(stream,pos,0)
                    readline.clearLine(stream,0)
                    break
                case "relative":
                    readline.moveCursor(stream,pos,0)
                    readline.clearLine(stream,0)
                    break
                default:
                    break
            }
        }
        self.prompt = function prompt(){
            self.__instance__.prompt(true)
        }
    },
    // class Terminal.MsgGroup
    "MsgGroup": function MsgGroup(){
        var self = this
        self.__cache__ = []
        self.__proxy__ = false
        self.__prompt__ = ""
        self.__promptLine__ = "+-----------------------------------------"
        self.initGroup = function initGroup(prompt){
            self.__prompt__ = prompt || "| "
            console.log(self.__promptLine__)
            self.__proxy__ = true
        }
        self.pushMsg = function pushMsg(msg){
            if (self.__proxy__==true){
                if (msg instanceof Array){
                    msg.forEach(function(msg){
                        console.log(self.__prompt__ + message.stringfy(msg))
                    })
                } else {
                    console.log(self.__prompt__ + message.stringfy(msg))
                }
            } else {
                console.log(message.stringfy(msg))
            }
        }
        self.log = function log(msg){
            if (self.__proxy__==true){
                self.__cache__.push(msg)
            } else {
                console.log(message.stringfy(msg))
            }
            message.send((function(msg){
                var __msg__ = {
                    "src": msg.src,
                    "msg": msg.msg,
                    "flag": "log"
                }
                return __msg__
            })(msg),process.stdout)
        }
        self.error = function error(msg){
            if (self.__proxy__==true){
                self.__cache__.push(msg)
            } else {
                console.error(message.stringfy(msg))
            }
            message.send((function(msg){
                var __msg__ = {
                    "src": msg.src,
                    "msg": msg.msg,
                    "flag": "log"
                }
                return __msg__
            })(msg),process.stdout)
        }
        self.endGroup = function endGroup(){
            self.__proxy__ = false
            console.log(self.__promptLine__)
            self.__cache__.forEach(function(msg){
                self.log(msg)
            })
            self.__prompt__ = ""
            self.__cache__ = []
        }
    }
}

module.exports = Terminal
