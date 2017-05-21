/*  
    Command prototype module for ChatScript.
    CAUTION : IT BE THE ONLY WAY TO GENARATE A COMMAND !!!
    Just use it like this:
        var myCommand = new Command('myCommandName', [
            'this is the help of my command',
            'please check out if there is anything wrong'
        ], function myCommandFunction(){})
 */

var Command = function Command(__name__, __guide__, __function__) {
    var self = this
    // validation check missing
    self.commandName = __name__
    self.commandFunction = __function__
    self.guide = function () {
        __guide__.forEach(function (item, index) {
            console.log(item)
        })
    }
}

module.exports = Command
