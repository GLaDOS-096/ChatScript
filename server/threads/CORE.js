// Chatroom app for consoles
// This is a no-hard-code version
// CORE powered by JavaScript

// loading dependencies
const logger = require('./modules/Log.js')

// loading CORE
var CORE = {
    __threads__: [],
    __spawn__: require('child_process').spawn,
    startServer: function startServer(path) {
        var server = CORE.__spawn__('nodejs', [path])
        server.stderr.on('data', function (data) {
            process.stdout.write(data)
        })
        server.on('exit', function () {
            server = CORE.startServer()
        })
        CORE.__threads__.push(server)
        return server
    },
}

module.exports = CORE
