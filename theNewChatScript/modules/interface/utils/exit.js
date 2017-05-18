/* 
    Command Extension for the interface.
    Command 'exit':
        Type in to quit the whole ChatScript process.
 */

const Command = require('../../classes/Prototype_Command.js')

var cmd_exit = new Command('exit',function(){
    process.exit()
})

module.exports = cmd_exit