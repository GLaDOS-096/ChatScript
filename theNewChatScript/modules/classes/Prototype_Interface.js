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
        console.log("Starting ChatScript Server v0.01...")
        console.log("Initializing interface ...")
        EXEC('ls ./modules/interface/utils/', function (stderr, stdout) {
            stdout.split(EOL).forEach(function (item, index) {
                if (item != '') {
                    console.log('Loading command ' + item + '...')
                    var __cmd__ = require('../interface/utils/' + item)
                    self.commands[__cmd__.commandName] = __cmd__.commandFunction
                    self.commands[__cmd__.commandName].guide = __cmd__.guide
                }
            })
            console.log("All modules loaded.")
            process.stdout.write("ChatScript> ")
        })
        process.stdin.on('data', function (data) {
            var __cli__ = data.toString().substring(0, data.toString().length - EOL.length)
            var __cmd__ = __cli__.split(' ')[0]
            // it be a trap or a, say, hack
            try {
                var params = __cli__.split(' ')[1]
                if (params!=undefined){
                    self.commands[__cmd__](params)
                } else {
                    self.commands[__cmd__]()
                }
            } catch(e) {
                console.log("Command '" + __cmd__ + "' not found.")
            } finally {
                process.stdout.write("ChatScript> ")
            }
        })
    }
    self.printMessage = function printMessage(__MsgInstance__){
        // this function completely trust the data source.
        try {
            process.stdout.write("[" + __MsgInstance__.type + "]" +  __MsgInstance__.src + ": " + __MsgInstance__.content)
            process.stdout.write(EOL)
        } catch (e) {
            return ERR_CODE.PARAM_INVALID
        }
    }
}

module.exports = Interface
