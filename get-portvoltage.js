module.exports = function(RED) {
    function GetPortVoltage(config) {  
        RED.nodes.createNode(this, config);
        var node = this;

        let ip = config.ip;
        let port = config.port.toString();
        let url = `http://${ip}/iolink/v1/vendor/masters/1/ports/${port}/diagnostics/voltage`;

        const http = require('http');

        node.on('input', function(msg) {   
            // Update the URL if msg contains new values
            if (msg.hasOwnProperty('ip') && typeof msg.ip === "string") {
                ip = msg.ip;
            } 
			
            if (msg.hasOwnProperty('port') && typeof msg.port === "number") {
                port = msg.port.toString();
            } 
			
			// Error handling for incorrect formats
			if (typeof ip !== "string")  node.error("msg.ip is wrong formatted, should be string");
			if (typeof port !== "string")  node.error("msg.port is wrong formatted, should be number");
			
			
            url = `http://${ip}/iolink/v1/vendor/masters/1/ports/${port}/diagnostics/voltage`;
			node.status({fill: "yellow", shape: "dot", text: "requesting " +url});
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            let request = http.get(url, options, function(result) {
                let body = '';

                // Collect data
                result.on('data', function(chunk) {
                    body += chunk;
                });

                // End of response
                result.on('end', function() {
                    if (result.statusCode === 200) {
                        try {
                            let newJson = JSON.parse(body);

                            let responseMsg = {};
                            responseMsg.payload = newJson;
                            responseMsg.statusCode = result.statusCode;   
                            node.status({fill: "green", shape: "dot", text: "request sucessfull"});
                            node.send(responseMsg);
                        } catch(e) {
                            node.error("Error parsing JSON: " + e.message);
							node.status({fill: "red", shape: "dot", text: e.message});
                        }
                    } else {
                        node.error(`HTTP Request failed with status code: ${result.statusCode}`);
						node.status({fill: "red", shape: "dot", text: result.statusCode});
                    }
                });
            });

            request.on('error', function(error) {
                node.error("HTTP Request Error: " + error.message);
				node.status({fill: "red", shape: "dot", text: error.message});
            });
        });
    }

    RED.nodes.registerType("get-portvoltage", GetPortVoltage);
}
