// Chatroom app for consoles
// Server side powered by JavaScript
console.log('Starting server...')

const server = require('net').createServer().listen(9999)
const eol = require('os').EOL
var sockets = []
console.log('Server running on 127.0.0.1:9999.')

server.on('connection',function(socket){
    sockets.push(socket)
    console.log('Client connected.')
    console.log('Online clients: ',sockets.length)
    socket.on('data',function(data){
        var str = data.toString().substring(0,data.length-eol.length)
        console.log('Data: ',str)
        sockets.forEach(function(__socket__){
            if (__socket__!=socket){
                __socket__.write(data)
            }
        })
    })
    socket.on('close',function(){
        console.log('Client offline.')
        var index = sockets.indexOf(socket)
        sockets.splice(index,1)
    })
})

server.on('error',function(err){
    console.log('Server error: ',err.message)
})

server.on('close',function(){
    console.log('Server offline.')
})

process.stdin.resume()
process.stdin.on('data',function(data){
    if (data.toString().trim().toLowerCase()==='exit'){
        console.log('Server closed.')
        process.exit()
    }
})