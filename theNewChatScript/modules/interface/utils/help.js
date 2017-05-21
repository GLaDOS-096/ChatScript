/* 
    Command Extension for the interface.
    Command 'exit':
        Type in to quit the whole ChatScript process.
 */

const Command = require('../../classes/Prototype_Command.js')

var cmd_help = new Command('help', [
    "   Type in 'help' plus command name to show help."
], function cmd_help(cmd){
    var __cmd__ = cmd[0]
    Interface.commmands[__cmd__].guide()
})

module.exports = cmd_help
