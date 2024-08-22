module.exports = function(RED) {
    function WriteProcessData(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        let { devicealias, ip, processData, user, password, valuePin2 } = config;
        let pD = JSON.parse(processData);
        let path = `/iolink/v1/devices/${devicealias}/processdata/value`;
        let requestJSON = {
            "iolink": { "valid": true, "value": pD },
            "iqValue": valuePin2.toLowerCase() === "true"
        };

        const http = require('http');

        node.on('input', function(msg) {
            // Überprüfen und aktualisieren der JSON-Request-Daten und Parameter von msg, falls vorhanden
            if (msg.hasOwnProperty('pD') && typeof msg.pD === "object") {
                requestJSON.iolink.value = msg.pD;
            }
            if (msg.hasOwnProperty('ip') && typeof msg.ip === "string") {
                ip = msg.ip;
            }
            if (msg.hasOwnProperty('deviceAlias') && typeof msg.deviceAlias === "string") {
                devicealias = msg.deviceAlias;
                path = `/iolink/v1/devices/${devicealias}/processdata/value`;
            }
            if (msg.hasOwnProperty('valuePin2') && typeof msg.valuePin2 === "boolean") {
                requestJSON.iqValue = msg.valuePin2;
            }
            if (msg.hasOwnProperty('password') && typeof msg.password === "string") {
                password = msg.password;
            }
            if (msg.hasOwnProperty('user') && typeof msg.user === "string") {
                user = msg.user;
            }

            // Fehlerüberprüfung für msg-Eigenschaften
            if (!Array.isArray(requestJSON.iolink.value)) {
                 node.error("msg.pD is wrong formatted, should be JSON");
            }
            if (typeof hostname !== "string") {
                 node.error("msg.ip is wrong formatted, should be string");
            }
            if (typeof devicealias !== "string") {
                 node.error("msg.deviceAlias is wrong formatted, should be string");
            }
            if (typeof requestJSON.iqValue !== "boolean") {
                 node.error("msg.valuePin2 is wrong formatted, should be boolean");
            }
            if (typeof user !== "string") {
                 node.error("msg.user is wrong formatted, should be string");
            }
            if (typeof password !== "string") {
                 node.error("msg.password is wrong formatted, should be string");
            }

            const requestPayload = JSON.stringify(requestJSON);
			node.status({fill: "yellow", shape: "dot", text: "requesting " +ip+path});
            const options = {
                hostname: ip,
                port: 80,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestPayload),
                    'Authorization': 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64')
                }
            };

            const request = http.request(options, function(result) {
                let responseData = '';
                result.on('data', chunk => responseData += chunk);

                result.on('end', () => {
                    if (result.statusCode === 204) {
                        msg.payload = "WriteProcessDataSuccessful";
                        msg.statusCode = result.statusCode;
						node.status({fill: "green", shape: "dot", text: "request sucessfull"});
                        node.send(msg);
                    } else {
                        node.error(`Error during WriteProcessData, status code: ${result.statusCode}, response: ${responseData}`);
						node.status({fill: "red", shape: "dot", text: result.statusCode});
                    }
                });
            });

            request.on('error', function(error) {
                node.error("HTTP Request Error: " + error.message);
				node.status({fill: "red", shape: "dot", text: error.message});
            });

            request.write(requestPayload);
            request.end();
        });
    }

    RED.nodes.registerType("write-processdata", WriteProcessData);
}
