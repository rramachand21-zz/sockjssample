var http = require('http');
var sockjs = require('sockjs');
var node_static = require('node-static');

// 1. Echo sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};

var sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', function(conn) {
    conn.on('data', function(message) {
        conn.write(message);
    });
});

// 2. Static files server
var static_directory = new node_static.Server(__dirname);

// 3. Usual http stuff
var server = http.createServer();
server.addListener('request', function(req, res) {
    static_directory.serve(req, res);
});
server.addListener('upgrade', function(req,res){
    res.end();
});

sockjs_echo.installHandlers(server, {prefix:'/echo'});

console.log( process.env.PORT || 8000  );
server.listen( process.env.PORT || 8000 );