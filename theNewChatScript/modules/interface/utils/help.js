/* 
    Command Extension for the interface.
    Command 'exit':
        Type in to quit the whole ChatScript process.
 */

const Command = require('../../classes/Prototype_Command.js')
var Interface = require('../../../app.js').Interface

var cmd_help = new Command('help', [
    "   Type in 'help' plus command name to show help."
], function cmd_help(cmd){
    Interface.commands[cmd].guide()
})

module.exports = cmd_help
