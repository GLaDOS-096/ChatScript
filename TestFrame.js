// Chatroom app for consoles
// This is a no-hard-code version
// Unit test frame powered by JavaScript

console.log('<system> Initializing test frame...')
const spawn = require('child_process').spawn
const message = require('./modules/Terminal.js')
const eol = require('os').eol

var msg = new message.MsgGroup()

// module check
if (msg) {
    console.log('<system> Terminal module loaded.')
} else {
    console.error('<ERROR> Failed to load Message module.')
    process.exit()
}

msg.log({
    "src": "frame",
    "msg": "Running server process..."
})
var server = spawn('nodejs', ['Server.js'])

msg.log({
    "src": "frame",
    "msg": "Running client process..."
})
var client1 = spawn('nodejs', ['Client.js'])
var client2 = spawn('nodejs', ['Client.js'])

server.stdout.on('data', function (data) {
    process.stdout.write(data.toString())
})
client1.stdout.on('data', function (data) {
    process.stdout.write(data.toString())
})
client2.stdout.on('data', function (data) {
    process.stdout.write(data.toString())
})
server.on('exit',function(){
    server = spawn('nodejs', ['Server.js'])
})
client1.on('exit',function(){
    client1 = spawn('nodejs', ['Client.js'])
})
client2.on('exit',function(){
    client2 = spawn('nodejs', ['Client.js'])
})

msg.log({
    "src": "frame",
    "msg": "Initialization done."
})

// Testing client command
msg.log({
    "src": "frame",
    "msg": "Testing commands for clients..."
})

function testClient() {
    var cmdlist = [
        "config",
        "roomspawn",
        "setpolicy",
        "setlimit",
        "join",
        "exit"
    ]
    cmdlist.forEach(function (cmd) {
        msg.log({
            "src": "frame",
            "msg": "Testing '" + cmd + "' ..."
        })
        switch (cmd) {
            case "config":
                client1.stdin.write(':config name cli_1' + eol)
                client2.stdin.write(':config name cli_2' + eol)
                break
            case "roomspawn":
                client1.stdin.write(':roomspawn' + eol)
                client1.stdin.write('hey' + eol)
                break
            case "setpolicy":
                client1.stdin.write(':setpolicy private' + eol)
                client1.stdin.write(':setpolicy asdasda' + eol)
                break
            case "join":
                client1.stdin.write(':join 1' + eol)
                client1.stdin.write(':join 0' + eol)
                break
            case "exit":
                client2.stdin.write(':exit' + eol)
                break
        }
    })
    msg.log({
        "src": "frame",
        "msg": "Testing commands for clients done."
    })
}

setTimeout(testClient,1500)