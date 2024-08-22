module.exports = function(RED) {
    function GetPortTemperature(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        let { ip, port } = config;
        port = port.toString();
        const http = require('http');

        node.on('input', function(msg) {
			
            // Überprüfen und Aktualisieren der IP, falls im msg-Objekt vorhanden
            if (msg.hasOwnProperty('ip') && typeof msg.ip === "string") {
                ip = msg.ip;
            }

            // Überprüfen und Aktualisieren des Ports, falls im msg-Objekt vorhanden
            if (msg.hasOwnProperty('port') && typeof msg.port === "number") {
                port = msg.port.toString();
            }

			// Error handling for incorrect formats
			if (typeof ip !== "string")  node.error("msg.ip is wrong formatted, should be string");
			if (typeof port !== "string")  node.error("msg.port is wrong formatted, should be number");
			
            // URL aktualisieren
            let url = `http://${ip}/iolink/v1/vendor/masters/1/ports/${port}/diagnostics/temperature`;
			node.status({fill: "yellow", shape: "dot", text: "requesting " +url});
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            http.get(url, options, function(result) {
                let body = '';

                // Daten sammeln
                result.on('data', chunk => body += chunk);

                // Ende der Antwort
                result.on('end', () => {
                    if (result.statusCode === 200) {
                        try {
                            const newJson = JSON.parse(body);
                            msg.payload = newJson;
                            msg.statusCode = result.statusCode;
							node.status({fill: "green", shape: "dot", text: "request sucessfull"});
                            node.send(msg);
                        } catch (e) {
                            node.error("Error parsing JSON: " + e.message);
							node.status({fill: "red", shape: "dot", text: e.message});
                        }
                    } else {
                        node.error("HTTP Request failed with status code: " + result.statusCode);
						node.status({fill: "red", shape: "dot", text: result.statusCode});
                    }
                });
            })
			request.on('error', function(error) {
                node.error("HTTP Request Error: " + error.message);
				node.status({fill: "red", shape: "dot", text: error.message});
            });
        });
    }

    RED.nodes.registerType("get-porttemperature", GetPortTemperature);
}
