module.exports = function(RED) {
    function GetParameterData(config) {  
        RED.nodes.createNode(this, config);
        var node = this;

        let ip = config.ip;
        let devicealias = config.devicealias;
        let index = config.index.toString();
        let subindex = config.subindex.toString();

        const http = require('http');

        node.on('input', function(msg) {
            // Überprüfen und Aktualisieren der IP, wenn vorhanden und vom richtigen Typ
            if (msg.hasOwnProperty('ip') && typeof msg.ip === "string" ) {
               
                ip = msg.ip;
              
            }

            // Überprüfen und Aktualisieren des deviceAlias, wenn vorhanden und vom richtigen Typ
            if (msg.hasOwnProperty('deviceAlias') && typeof msg.deviceAlias === "string") {
                
                devicealias = msg.deviceAlias;
            }

            // Überprüfen und Aktualisieren des Index, wenn vorhanden und vom richtigen Typ
            if (msg.hasOwnProperty('index') && typeof msg.index === "number") {
              
                index = msg.index.toString(); // Um sicherzustellen, dass der Index als String formatiert wird
            }

            // Überprüfen und Aktualisieren des Subindex, wenn vorhanden und vom richtigen Typ
            if (msg.hasOwnProperty('subindex') && typeof msg.subindex === "number") {
                
                subindex = msg.subindex.toString(); // Um sicherzustellen, dass der Subindex als String formatiert wird
            }
			
			// Error handling for incorrect formats
			if (typeof ip !== "string")  node.error("msg.ip is wrong formatted, should be string");
			if (typeof devicealias !== "string")  node.error("msg.deviceAlias is wrong formatted, should be string");
			if (typeof index !== "string")  node.error("msg.index is wrong formatted, should be number");
			if (typeof subindex !== "string")  node.error("msg.subindex is wrong formatted, should be number");
			
			
            let url =`http://${ip}/iolink/v1/devices/${devicealias}/parameters/${index}/subindices/${subindex}/value/?format=byteArray`;
			node.status({fill: "yellow", shape: "dot", text: "requesting " +url});
			
            const options = {
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
                    if (result.statusCode === 200 || result.statusCode === 400) {
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

    RED.nodes.registerType("get-parameterdata", GetParameterData);
}
