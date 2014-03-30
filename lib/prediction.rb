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
		@http = build_uri
		body = {:id=> "INITIALISE_ESTIMATOR",:payload => ""}
		#response = @http[0].post(@http[1].path,body.to_json) 
		#puts response
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
		#body = {:id=> "FUSE_MEASUREMENTS",:payload => data}
		#response = @http[0].post(@http[1].path,body.to_json) 
		puts "prediction " + data.to_json
	end 

	def next
		#body = {:id=> "NEXT_STEP",:payload => ""}
		#response = @http[0].post(@http[1].path,body.to_json) 
		puts "prediction next step"
	end 

	def receive(data)
		#convert data

	end

	def requestCurrent
		#body = {:id=> "REQUEST_CURRENT_STATE",:payload => ""}
		#response = @http[0].post(@http[1].path,body.to_json) 
	end
end