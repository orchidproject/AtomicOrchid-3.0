/*
This is a virtual agent template
usage:

node agent.js [game_id]

//it moves an agent along a fix route

*/

var events = require('events');
var http = require('http');
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
var game_playing=false;

function setHandler(){

    //act on events
    socket.on('data', function(data) {
        if(typeof data.system != "undefined"){
            if(data.system == "end"){
                game_playing=false;
                clearInterval(truckUpdateID);
            }
        }
        
        if(typeof data.player != "undefined"){
            //receivePlayerData(data.player);
        }
        
        if(typeof data.textMassage != "undefined"){
            //receiveTextMassage(data.textMassage);
        }
        
        if(typeof data.location != "undefined"){
            //receiveLocationData(data.location);
        }
        
        if(typeof data.request != "undefined"){
            //receiveRequestData(data.request);
        }
        
        if(typeof data.reading != "undefined"){
               // receiveReadingData(data.reading);
        }
            
        if(typeof data.cargo != "undefined"){
                //receiveCargoData(data.cargo);
        }
        
        if(typeof data.cleanup != "undefined"){
                //cleanup(data.cleanup);
        }
    
    });
    
}


function mainloop(){    
  fetchLocation(function(obj){
    console.log(obj.agents[0].coordinate.latitude); 
    helper.player.lat=  obj.agents[0].coordinate.latitude; 
    helper.player.lng=  obj.agents[0].coordinate.longitude;
    updateTruckLocation();
  });
}

function fetchLocation(onResult){
  var options = {
    host: 'localhost',
    port: 8000,
    path: '/state.json',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
  }; 

  var req = http.request(options, function(res) {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
	    onResult(obj);
        });
   });

   //do not know what is this doing 
   req.on('error', function(err) {
       //res.send('error: ' + err.message);
   });
   req.end();
}


function updateTruckLocation(){
    socket.emit('location-push',{"player_id":helper.player.user_id,"latitude":helper.player.lat,"longitude":helper.player.lng,"skill":helper.player.skill,"initials":helper.player.initials});
}

/////////////////////////////
//this code control movement of truck
/////////////////////////////


var previousMoveId=0;
var count=0;
var lngPerStep;
var latPerStep;
var steps;


var MoveEvent=function MoveEvent(){};
MoveEvent.prototype=new events.EventEmitter;
var event= new MoveEvent;

function moveTruck(ori,des){
    var speed = 3; //5 m/s
    
    helper.api('GET','/agent_utility/distance_between',{lat1:ori.lat,lng1:ori.lng,lat2:des.lat,lng2:des.lng},function(res){
        
        if (res.distance==null){
            return;
        }
        console.log(res.distance);
        //supposed to be finished within distance/speed sec
        var time = res.distance*1000/speed;
        //time interval for each small movement is 0.1 sec, so the whole movement should be finished within time*10 steps
        steps= time*10;
    
        lngPerStep = (des.lng-ori.lng)/steps;
        latPerStep = (des.lat-ori.lat)/steps;
        count=0;
    
    
        clearInterval(previousMoveId);
        previousMoveId = setInterval(moveOneStep,100);
    });

}

function moveOneStep() {
        if(count<steps){
            helper.player.lat=helper.player.lat+latPerStep;
            helper.player.lng=helper.player.lng+lngPerStep;
            
            //console.log(helper.player.lat+","+helper.player.lng);
            count++;
        
        }
        else{
            clearInterval(previousMoveId);
            
            //notify that a section has be completed
            event.emit('section-finish');
        }
        
}

//join game
helper.join('agent','a@agent.com','truck',1,'AA', function(p){
    
    
    if (p.user_id != null){
        //wait for starting signal 
        /*console.log("wait for starting signal ");
        
        socket.on('data', function(data) {
            if(data.system == "start"){
                game_playing=true;
                console.log("start playing");
                
                
            }
        });*/
        
        //initialize
        helper.player=p;
        setHandler();
        setInterval(mainloop,500); 
        //console.log("game join successful");
    }
    console.log(p);
});

