/*  
    Message prototype module for ChatScript.
    Turns out to be the universal message template across the app.
    Usage:
        class MessageKeeper():
            generate(Object):               THE ONLY WAY to generate a message. Returns an Object<#Message>.
            serialize(Object<#Message>):    THE ONLY WAY to serialize a message to pass through TCP/UDP.
            unserialize(Object<#Buffer>):   THE ONLY WAY to unseralize a message.
        class Message(Object):
            src:       The source of the message. Cannot be ommited.
            type:      The type of the message. Could be 'command','text','log','error',etc. It be 'text' while ommited.
            content:   The content string of the message. Could not be omitted.
 */

const ERR_CODE = require('./_ERR_CODE_.js')

var Message  = function Message(__MsgPrototype__){
    var self = this
    self.src = __MsgPrototype__.src ? __MsgPrototype__.src : "OMITTED"
    self.type = __MsgPrototype__.type ? __MsgPrototype__.type : "text"
    self.content = __MsgPrototype__.content ? __MsgPrototype__.content : "OMITTED"
}

var MessageKeeper = function MessageKeeper(){
    var self = this
    self.generate = function MessageGenerate(__MsgPrototype__){
        var __Message__ = new Message(__MsgPrototype__)
        if ( __Message__.src != "OMITTED" && __Message__.content != "OMITTED" ){
            return __Message__
        } else {
            return ERR_CODE.MESSAGE_INVALID
        }
    }
    self.serialize = function MessageSerialize(__MsgInstance__){
        if (__MsgInstance__ instanceof Message){
            return Buffer(__MsgInstance__)
        } else {
            return ERR_CODE.PARAM_NOT_A_MSG
        }
    }
    self.unserialize = function MessageUnserialize(__MsgBuffer__){
        if (__MsgBuffer__ instanceof Buffer){
            try {
                var __MsgInstance__ = JSON.parse(__MsgBuffer__.toString())
                return __MsgInstance__
            } catch (e) {
                return ERR_CODE.PARAM_NOT_A_MSG
            }
        } else {
            return ERR_CODE.PARAM_NOT_A_BUFFER
        }
    }
}

module.exports = MessageKeeper
