module.exports = function(RED) {
    function GetMasterIdentification(config) {  
        RED.nodes.createNode(this, config);
        var node = this;

        let ip = config.ip;
        let url = `http://${ip}/iolink/v1/gateway/identification`;

        const http = require('http');

        node.on('input', function(msg) {
            // Überprüfen und Aktualisieren von IP, falls vorhanden und vom richtigen Typ
            if (msg.hasOwnProperty('ip') && typeof msg.ip === "string") {
               
                 ip = msg.ip;
            }
			
			// Error handling for incorrect formats
			if (typeof ip !== "string")  node.error("msg.ip is wrong formatted, should be string");


			url = `http://${ip}/iolink/v1/gateway/identification`;
			node.status({fill: "yellow", shape: "dot", text: "requesting " +url});
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };
			
			
			
            const request = http.get(url, options, function(result) {
                let body = '';

                // Daten sammeln
                result.on('data', chunk => body += chunk);

                // Ende der Antwort
                result.on('end', function() {
                    if (result.statusCode === 200) {
                        try {
                            let newJson = JSON.parse(body);

                            let responseMsg = {};
                            responseMsg.payload = newJson;
                            responseMsg.statusCode = result.statusCode;
							node.status({fill: "green", shape: "dot", text: "request sucessfull"});
                            node.send(responseMsg);
                        } catch (e) {
                            node.error("Error parsing JSON: " + e.message);
							node.status({fill: "red", shape: "dot", text: e.message});
                        }
                    } else {
                        node.error("HTTP Request failed with status code: " + result.statusCode);
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

    RED.nodes.registerType("get-masteridentification", GetMasterIdentification);
}
