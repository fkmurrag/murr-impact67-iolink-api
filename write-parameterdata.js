module.exports = function(RED) {
    function WriteParameterData(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        let { ip, user, password, devicealias, index, subindex } = config;
        index = index.toString();
        subindex = subindex.toString();
        let path = `/iolink/v1/devices/${devicealias}/parameters/${index}/subindices/${subindex}/value`;
        let pD = JSON.parse(config.parameterData);

        const http = require('http');

        node.on('input', function(msg) {
            // Überprüfe, ob die Eigenschaften im msg-Objekt vorhanden sind und aktualisiere die Variablen entsprechend
            if (msg.hasOwnProperty('pD') && typeof msg.pD === "object") pD = msg.pD;
            if (msg.hasOwnProperty('ip') && typeof msg.ip === "string") ip = msg.ip;
            if (msg.hasOwnProperty('deviceAlias') && typeof msg.deviceAlias === "string") devicealias = msg.deviceAlias;
            if (msg.hasOwnProperty('index') && typeof msg.index === "number") index = msg.index.toString();
            if (msg.hasOwnProperty('subindex') && typeof msg.subindex === "number") subindex = msg.subindex.toString();
            if (msg.hasOwnProperty('user') && typeof msg.user === "string") user = msg.user;
            if (msg.hasOwnProperty('password') && typeof msg.password === "string") password = msg.password;

            // Fehlerüberprüfung
            if (!Array.isArray(pD))  node.error("msg.pD is wrong formatted, should be JSON");
            if (typeof ip !== "string")  node.error("msg.ip is wrong formatted, should be string");
            if (typeof devicealias !== "string")  node.error("msg.deviceAlias is wrong formatted, should be string");
            if (isNaN(parseInt(index)))  node.error("msg.index is wrong formatted, should be number");
            if (isNaN(parseInt(subindex)))  node.error("msg.subindex is wrong formatted, should be number");
            if (typeof user !== "string")  node.error("msg.user is wrong formatted, should be string");
            if (typeof password !== "string")  node.error("msg.password is wrong formatted, should be string");

            // Aktualisiere den Pfad basierend auf den aktuellen Parametern
            path = `/iolink/v1/devices/${devicealias}/parameters/${index}/subindices/${subindex}/value`;
			node.status({fill: "yellow", shape: "dot", text: "requesting " +ip+path});
            // Erstelle JSON-Anfrage
            const requestJSON = JSON.stringify({ value: pD });

            // HTTP-Anfrageoptionen
            const options = {
                hostname: ip,
                port: 80,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestJSON),
                    'Authorization': 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64')
                }
            };

            // Sende HTTP-Anfrage
            const request = http.request(options, function(result) {
                let responseData = '';
                result.on('data', chunk => responseData += chunk);

                result.on('end', () => {
                    if (result.statusCode === 204) {
                        msg.payload = "WriteParameterDataSuccessful";
                        msg.statusCode = result.statusCode;
						node.status({fill: "green", shape: "dot", text: "request sucessfull"});
                        node.send(msg);
                    } else {
                        node.error(`Error during Write Parameterdata, status code: ${result.statusCode}, response: ${responseData}`);
						node.status({fill: "red", shape: "dot", text: result.statusCode});
                    }
                });
            });

            request.on('error', function(error) {
                node.error("HTTP Request Error: " + error.message);
				node.status({fill: "red", shape: "dot", text: error.message});
            });

            request.write(requestJSON);
            request.end();
        });
    }

    RED.nodes.registerType("write-parameterdata", WriteParameterData);
}
