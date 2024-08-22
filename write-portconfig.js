module.exports = function(RED) {
    function WritePortConfig(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        let { port, ip, user, password, pin4mode, pin2mode, devicealias } = config;
        let path = `/iolink/v1/masters/1/ports/${port}/configuration`;

        let baseConfig = {
            "mode": pin4mode.toUpperCase(),
            "iqConfiguration": pin2mode.toUpperCase()
        };
        let requestJSON = devicealias ? { ...baseConfig, "deviceAlias": devicealias } : baseConfig;

        const http = require('http');

        node.on('input', function(msg) {
            try {
                // Update request JSON and other parameters based on msg input
                if (msg.hasOwnProperty('ip') && typeof msg.ip === "string") {
                    ip = msg.ip;
                }
                if (msg.hasOwnProperty('deviceAlias') && typeof msg.deviceAlias === "string") {
                    requestJSON.deviceAlias = msg.deviceAlias;
                }
                if (msg.hasOwnProperty('port') && typeof msg.port === "number") {
                    path = `/iolink/v1/masters/1/ports/${msg.port}/configuration`;
                }
                if (msg.hasOwnProperty('pin4Mode') && typeof msg.pin4Mode === "string") {
                    requestJSON.mode = msg.pin4Mode.toUpperCase();
                }
                if (msg.hasOwnProperty('pin2Mode') && typeof msg.pin2Mode === "string") {
                    requestJSON.iqConfiguration = msg.pin2Mode.toUpperCase();
                }
                if (msg.hasOwnProperty('user') && typeof msg.user === "string") {
                    user = msg.user;
                }
                if (msg.hasOwnProperty('password') && typeof msg.password === "string") {
                    password = msg.password;
                }

                // Error handling for incorrect formats
                if (typeof ip !== "string")  node.error("msg.ip is wrong formatted, should be string");
                if (requestJSON.deviceAlias && typeof requestJSON.deviceAlias !== "string") {
                     node.error("msg.deviceAlias is wrong formatted, should be string");
                }
                if (typeof requestJSON.mode !== "string")  node.error("msg.pin4Mode is wrong formatted, should be string");
                if (typeof requestJSON.iqConfiguration !== "string")  node.error("msg.pin2Mode is wrong formatted, should be string");
                if (typeof user !== "string")  node.error("msg.user is wrong formatted, should be string");
                if (typeof password !== "string")  node.error("msg.password is wrong formatted, should be string");

                const requestPayload = JSON.stringify(requestJSON);
				node.status({fill: "yellow", shape: "dot", text: "requesting " +ip+path});
                let options = {
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
                            msg.payload = "PortConfigSuccessful";
                            msg.statusCode = result.statusCode;
							node.status({fill: "green", shape: "dot", text: "request sucessfull"});
                            node.send(msg);
                        } else {
                            node.error(`Error during Port configuration, status code: ${result.statusCode}, response: ${responseData}`);
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

            } catch (err) {
                node.error("Invalid configuration format", err);
            }
        });
    }

    RED.nodes.registerType("write-portconfig", WritePortConfig);
}
