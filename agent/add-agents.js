/*
This is a virtual agent template
usage:

node agent.js [game_id]

it moves an agent along a fix route

*/

var events = require('events');
var RUBY_PORT = 49992;
var game_id=process.argv[2];

var Helper = require('./agent_helper');
var helper = new Helper(game_id);
// get a socket io connection to server
var socket = helper.getSocket();

//logout of game when the pragram terminates
var stdin = process.openStdin();
process.on('SIGINT', function () {
  process.exit(0);
});

var SOCKET_IO_ADDRESS = helper.socketAddress;
var NODE_JS_ADDRESS = helper.nodeAddress;
var RUBY_ADDRESS = helper.rubyAddress;


//handlers and main loop


/////////////////////////////
//this code control movement of truck
/////////////////////////////


//join game
helper.join('agent','a@agent.com','truck',0,'AA', function(p){
    console.log(p);
});
helper.join('agent','a@agent.com','truck',0,'AA', function(p){
    console.log(p);
});
helper.join('agent','a@agent.com','truck',1,'AA', function(p){
    console.log(p);
});
helper.join('agent','a@agent.com','truck',1,'AA', function(p){
    console.log(p);
});
helper.join('agent','a@agent.com','truck',2,'AA', function(p){
    console.log(p);
});
helper.join('agent','a@agent.com','truck',2,'AA', function(p){
    console.log(p);
});
helper.join('agent','a@agent.com','truck',3,'AA', function(p){
    console.log(p);
});
helper.join('agent','a@agent.com','truck',3,'AA', function(p){
    console.log(p);
});

