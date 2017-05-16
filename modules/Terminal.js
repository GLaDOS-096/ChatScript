// Chatroom app module of terminals
// Module powered by JavaScript

// loading dependencies
const eol = require('os').EOL
const readline = require('readline')
const message = require('./Message.js')

var Terminal = {
    // class Terminal.Monitor
    "Monitor": function Monitor(options) {
        var self = this
        self.__instance__ = readline.createInterface(options)
        self.__instance__.setPrompt(options.prompt || "<client> ")
        self.clearScreen = function clearScreen(stream) {
            var stream = stream || process.stdout
            readline.cursorTo(stream, 0, 0)
            readline.clearScreenDown(stream)
            self.__instance__.prompt
        }
        self.clearLine = function clearLine(mode, pos, stream) {
            var stream = stream || process.stdout
            switch (mode) {
                case "absolute":
                    readline.cursorTo(stream, pos, 0)
                    readline.clearLine(stream, 0)
                    break
                case "relative":
                    readline.moveCursor(stream, pos, 0)
                    readline.clearLine(stream, 0)
                    break
                default:
                    break
            }
        }
        self.prompt = function prompt() {
            self.__instance__.prompt(true)
        }
    },
    // class Terminal.MsgGroup
    "MsgGroup": function MsgGroup(log_proc) {
        if (log_proc==undefined){
            console.log("<FATAL> LOG Process not found.")
            return 0
        }
        var self = this
        this.__logger__ = log_proc.stdin
        self.__cache__ = []
        self.__proxy__ = false
        self.__prompt__ = ""
        self.__promptLine__ = "+-----------------------------------------"
        self.initGroup = function initGroup(prompt) {
            self.__prompt__ = prompt || "| "
            process.stdout.write(self.__promptLine__ + eol)
            self.__proxy__ = true
        }
        self.pushMsg = function pushMsg(msg) {
            if (self.__proxy__ == true) {
                if (msg instanceof Array) {
                    msg.forEach(function (msg) {
                        process.stdout.write(self.__prompt__ + message.stringfy(msg) + eol)
                    })
                } else {
                    process.stdout.write(self.__prompt__ + message.stringfy(msg) + eol)
                }
            } else {
                process.stdout.write(message.stringfy(msg) + eol)
            }
        }
        self.log = function log(msg) {
            if (self.__proxy__ == true) {
                self.__cache__.push(msg)
            } else {
                process.stdout.write(message.stringfy(msg) + eol)
            }
            message.send((function (msg) {
                var __msg__ = {
                    "src": msg.src || "log",
                    "msg": msg.msg || msg,
                    "flag": "log"
                }
                return __msg__
            })(msg), self.__logger__)
        }
        self.error = function error(msg) {
            if (self.__proxy__ == true) {
                self.__cache__.push(msg)
            } else {
                process.stdout.write(message.stringfy(msg) + eol)
            }
            message.send((function (msg) {
                var __msg__ = {
                    "src": msg.src || "ERROR",
                    "msg": msg.msg || msg,
                    "flag": "log"
                }
                return __msg__
            })(msg), self.__logger__)
        }
        self.endGroup = function endGroup() {
            self.__proxy__ = false
            process.stdout.write(self.__promptLine__ + eol)
            self.__cache__.forEach(function (msg) {
                self.log(msg)
            })
            self.__prompt__ = ""
            self.__cache__ = []
        }
    }
}

module.exports = Terminal
