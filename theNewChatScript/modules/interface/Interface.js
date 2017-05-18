/*  
    Extendable command line interface for both server side and client sideof ChatScript.

 */

const EXEC = require('child_process').exec
const EOL = require('os').EOL
const Message = require('../classes/Prototype_Message.js')

var Interface = function Interface() {
    var self = this
    self.__init__ = function initializeInterface() {
        EXEC('ls utils/', function (stderr, stdout) {
            stdout.split(EOL).forEach(function (item, index) {
                if (item != '') {
                    var __cmd__ = require('./utils/' + item)
                    cmds[__cmd__.commandName] = __cmd__.commandFunction
                }
            })
            console.log(cmds)
        })
        process.stdin.on('data', function (data) {
            var __cmd__ = data.toString().substring(0, data.toString().length - EOL.length)
            var args = []
            cmds[__cmd__](args)
        })
    }
}
