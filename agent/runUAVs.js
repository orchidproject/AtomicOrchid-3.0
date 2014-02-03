var events = require('events');
var http = require('http');
var game_id=process.argv[2];

var Helper = require('./agent_helper');

//logout of game when the pragram terminates
var stdin = process.openStdin();
process.on('SIGINT', function () {
  process.exit(0);
});

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

function move(helper,socket,lat,lng){
	console.log(lat);
    socket.emit('location-push',{"player_id":helper.player.user_id,"latitude":lat,"longitude":lng,"skill":helper.player.skill,"initials":helper.player.initials});
}

function mainloop(){
	fetchLocation(function(obj){
		for(i = 0; i < obj.agents.length ; i++){
			if(UAVs[i]!=null){
				move(UAVs[i].helper,UAVs[i].socket,obj.agents[i].coordinate.latitude,obj.agents[i].coordinate.longitude);
			}
		}
	});
}

var UAVs = []
fetchLocation(function(obj){
    console.log(obj.agents.length); 
    //join game
    for(i = 0; i < obj.agents.length ; i++){
    	var helper = new Helper(game_id);
		// get a socket io connection to server
		var socket = helper.getSocket();
    	helper.join('agent','a@agent.com','truck',1,'UA', function(p){
    		if (p.user_id != null){
    			//put to array
    			//unknown reason, to prevent multiple helpers being the same
    			var helper = {};
    			helper.player=p;
    			console.log(JSON.stringify(p) + "!!!!!!!!");
        		UAVs.push({helper:helper,socket:socket});
    		}
    		
		});
	}
	setInterval(mainloop,500);
});