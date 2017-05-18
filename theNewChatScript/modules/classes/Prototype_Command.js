/*  
    Command prototype module for ChatScript.
    CAUTION : IT BE THE ONLY WAY TO GENARATE A COMMAND !!!
    Just use it like this:
        var myCommand = new Command('myCommandName',function myCommandFunction(){})
 */

var Command = function Command(__name__,__function__){
    var self = this
    // validation check missing
    self.commandName = __name__
    self.commandFunction = __function__
}

module.exports = Command
