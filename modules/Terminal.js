// Chatroom app module of terminals
// Module powered by JavaScript

const readline = require('readline')

function Terminal(options){
    var self = this
    self.__instance__ = readline.createInterface(options)
    self.__instance__.setPrompt(options.prompt || "<client> ")
    self.clearScreen = function clearScreen(stream){
        var stream = stream || process.stdout
        readline.cursorTo(,stream,0,0)
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
}