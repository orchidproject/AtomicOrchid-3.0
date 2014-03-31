class Controller < Sinatra::Base 
	#object templates in this fuction
	get '/game/:layer_id/status.json' do
	    content_type :json

	    if params[:layer_id]=="-1"
			return {}.to_json  #reserved for replay method 2
	    end 

	    @game = Game.get params[:layer_id]
		#TODO make it for replay
	    data = snapshot @game, false

	    if params[:task_only] == "true"
	    	data.delete :terrains
	    	data.delete :players
	    	data.delete :simulation_file
	    	data.delete :sim_update_interval
	    	data.delete :grid_size
	    	data.delete :dropoffpoints
	    	data.delete :instructions
	    end 

	    data.to_json
    
	end

	post '/game/:layer_id/find_target'  do
		data = JSON.parse(request.body.read)
		t = Task.get(data["target_id"])
		puts t.state 
		puts Task::State::IDLE
		if t.nil?
			return {state:"error", msg:"no target found"}.to_json
		elsif t.state == Task::State::UNSEEN
			t.state = Task::State::IDLE
			t.save
			t.broadcast(socketIO);
		else
			return {state:"error", msg:"target already discovered"}.to_json
		end

		return {state:"ok"}.to_json
	end


	post '/prediction'  do
		game= Game.last(:is_active => 0)
		sim = getSim(game)
		data_to_send = [];


		data = JSON.parse(request.body.read)
		if data["id"] == "REQUEST_CURRENT_STATE"
			data["payload"]["MEAN"].each_with_index  do |row,y|
				row.each_with_index do |value,x|
					data_to_send << sim.constructNodeWithValue(x,y,value)
				end
			end
			socketIO.broadcast({ 
                    :channel=> "#{game.layer_id}-5",  #to a extra channel so that the agent can decide to listen to it or not.           
                    :data=>{
                        :heatmap=>data_to_send
                    }
		    }.to_json)
		end 
	end
end
