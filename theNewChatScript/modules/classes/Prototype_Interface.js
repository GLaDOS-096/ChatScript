/*  
    Extendable interactive command line interface for both server side and client sideof ChatScript.
    Usage:
        class Interface():
            commands:                         An object that stores all the command functions inside. 
                                              Use Object<#Interface>.commands["MyCommandName"]([args]) to execute.
            __init__():                       The function that must be executed when a Object<#Interface> is created.
                                              It loads the commands and others.
            printMessage(Object<#Message>):   Print the message out using the formatted ouutput.
 */

const EXEC = require('child_process').exec
const EOL = require('os').EOL
const Message = require('./Prototype_MessageKeeper.js')
const ERR_CODE = require('./_ERR_CODE_.js')

var Interface = function Interface() {
    var self = this
    self.commands = {}
    self.__init__ = function initializeInterface() {
        EXEC('ls ../interface/utils/', function (stderr, stdout) {
            stdout.split(EOL).forEach(function (item, index) {
                if (item != '') {
                    var __cmd__ = require('../interface/utils/' + item)
                    self.commands[__cmd__.commandName] = __cmd__.commandFunction
                }
            })
        })
        process.stdin.on('data', function (data) {
            var __cmd__ = data.toString().substring(0, data.toString().length - EOL.length)
            var args = []
            self.commands[__cmd__](args)
        })
    }
    self.printMessage = function printMessage(__MsgInstance__){
        try {
            process.stdout.write("[" + __MsgInstance__.type + "]" +  __MsgInstance__.src + ": " + __MsgInstance__.content)
            process.stdout.write(EOL)
        } catch (e) {
            return ERR_CODE.PARAM_INVALID
        }
    }
}

var i = new Interface()
i.__init__()
