// Chatroom app for consoles
// This is a no-hard-code version
// Server app powered by JavaScript

// loading CORE
var CORE = {
    __spawn__: require('child_process').spawn,
    spawnServer: function spawnServer() {
        var server = CORE.__spawn__('nodejs', [process.cwd() + '/server/threads/Server.js'])
        process.stdin.on('data', function (data) {
            server.stdin.write(data.toString())
        })
        server.stdout.on('data', function (data) {
            process.stdout.write(data)
        })
        server.stderr.on('data', function (data) {
            process.stdout.write(data)
        })
        server.on('exit', function () {
            server = CORE.spawnServer()
        })
        return server
    },
}

server = CORE.spawnServer()