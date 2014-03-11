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

//join game
helper.join('agent','a@agent.com','truck',1,'AA', function(p){
    
});
helper.join('agent','a@agent.com','truck',1,'AA', function(p){
    
});
helper.join('agent','a@agent.com','truck',2,'AA', function(p){
    
});
helper.join('agent','a@agent.com','truck',2,'AA', function(p){
    
});
helper.join('agent','a@agent.com','truck',3,'AA', function(p){
    
});
helper.join('agent','a@agent.com','truck',3,'AA', function(p){
    
});
helper.join('agent','a@agent.com','truck',4,'AA', function(p){
    
});
helper.join('agent','a@agent.com','truck',4,'AA', function(p){
    
});


