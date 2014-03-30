require 'uri'
require 'net/http'
require 'json'
class Prediction

	@@instances = []	
	#@status = 0 #0 for not init, -1 for error, 1 for initializing, 2 for initialized 
	
	def self.instances(session_id) 	
		return @@instances[session_id]||= Prediction.new(session_id)	
	end

	def initialize(session_id)
		@host = 'osculate.it'
		@port = '3000'
		@post_ws = "/"

		json = {"id"=> "INITIALISE_ESTIMATOR","payload" => ""}.to_json
		req = Net::HTTP::Post.new(@post_ws, initheader = {'Content-Type' =>'application/json'})
        req.body = json
        response = Net::HTTP.new(@host, @port).start {|http| http.request(req) }
        puts "Response #{response.code} #{response.message}:
        #{response.body}"
	end

	def build_uri
		uri = URI("http://osculate.it:3000/")
		http = nil
=begin
		if (Controller::PROXY_ADDRESS == "no_proxy")	
			puts "init with no proxy"
			http = Net::HTTP.new(uri.host, uri.port)
		else 
			proxy = URI(Controller::PROXY_ADDRESS)
			puts "init with proxy " + proxy.host+ " " + proxy.port.to_s
			http = Net::HTTP.new(uri.host, uri.port, proxy.host, proxy.port)
		end	
		http = Net::HTTP.new(uri.host, uri.port)
=end
		http = Net::HTTP.new(uri.host, uri.port)
		return http,uri

	end 

	def report(data)
		body = {"id"=> "FUSE_MEASUREMENTS","payload" => data}.to_json
		req = Net::HTTP::Post.new(@post_ws, initheader = {'Content-Type' =>'application/json'})
        req.body = json
        response = Net::HTTP.new(@host, @port).start {|http| http.request(req) }
        puts "Response #{response.code} #{response.message}:
        #{response.body}"
	end 

	def next
		json = {"id"=> "NEXT_STEP","payload" => ""}.to_json
		req = Net::HTTP::Post.new(@post_ws, initheader = {'Content-Type' =>'application/json'})
        req.body = json
        response = Net::HTTP.new(@host, @port).start {|http| http.request(req) }
        puts "Response #{response.code} #{response.message}:
        #{response.body}"
	end 

	def receive(data)
		#convert data

	end

	def requestCurrent
		json ={
    		"id" => "REQUEST_CURRENT_STATE",
    		"payload" => "",
  	 	}.to_json
    	req = Net::HTTP::Post.new(@post_ws, initheader = {'Content-Type' =>'application/json'})
        req.body = json
        response = Net::HTTP.new(@host, @port).start {|http| http.request(req) }
        puts "Response #{response.code} #{response.message}:
        #{response.body}"
	end
end



 



