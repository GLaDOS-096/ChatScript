/* 
    Command Extension for the interface.
    Command 'roomspawn':
        Type in to create a new chatroom and move you into this room.
 */

const Command = require('../../classes/Prototype_Command.js')
var Interface = require('../../../app.js').Interface

var cmd_roomspawn = new Command('roomspawn', [
    "   Spawn a chat room with a random room ID."
], function cmd_roomspawn(){
    Interface.commands['roomspawn'].guide()
})

module.exports = cmd_roomspawn
