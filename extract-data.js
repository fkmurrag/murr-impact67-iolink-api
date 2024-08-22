module.exports = function(RED) {
    function extractData(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        // Standardwerte für die Konfiguration
        let dataType = parseInt(config.dataType);
        let bitOffset = parseInt(config.bitOffset);
        let Label = config.Label;
        let bitLength = parseInt(config.bitLength);
        let gradient = parseFloat(config.gradient);

        // Hilfsfunktion zum Verarbeiten von Payloads
        function processPayload(payload) {
            let value = 0;
			let multiplier=0;
            for (let i = payload.length - 1; i >= 0; i--) {
                value += payload[i] << (8 *multiplier);
				multiplier++;
            }
            return value;
        }

        // Verarbeitet den Payload basierend auf dem Datentyp
        function parseValue(payload, dataType, valid) {
			let val;
            switch (dataType) {
                case 0: // Boolean Values
                    let valbool = processPayload(payload);
                    let maskBool = Math.pow(2,bitOffset);
                    let boolVal = (valbool & maskBool) >> bitOffset;
                    val = boolVal === 1;
                    node.status({fill: "green", shape: "dot", text: "Successfully parsed Boolean"});
                    break;

                case 1: // Integer Values
                    let valint = processPayload(payload);
                    let maskInt = Math.pow(2,bitLength)-1;
                    let intVal = (valint & maskInt) >> bitOffset;
                    val = gradient !== 1.00 ? intVal * gradient : intVal;
                    node.status({fill: "green", shape: "dot", text: "Successfully parsed Number"});
                    break;

                case 2: // IEEE754 Float
                    let intReal = processPayload(payload);
                    const bytes = new Uint8Array(4);
                    bytes[0] = (intReal >> 24) & 0xFF;
                    bytes[1] = (intReal >> 16) & 0xFF;
                    bytes[2] = (intReal >> 8) & 0xFF;
                    bytes[3] = intReal & 0xFF;
                    const view = new DataView(bytes.buffer);
                    val = view.getFloat32(0);
                    node.status({fill: "green", shape: "dot", text: "Successfully parsed Float"});
                    break;

                case 3: // String
                    val = String.fromCharCode(...payload);
                    node.status({fill: "green", shape: "dot", text: "Successfully parsed String"});
                    break;

                default:
                    node.status({fill: "red", shape: "dot", text: "Datatype not known, please check the documentation"});
                    node.error("Datatype not known, please check the documentation", msg);
                    return;
            }
            if(valid===false)
			{
				node.status({fill: "yellow", shape: "dot", text: "Parsed Processdata aren't valid!"});
			}
            return val;
		
        }

        node.on('input', function(msg) {
            this.status({fill: "yellow", shape: "dot", text: "Started parsing..."});

            let payloadKeys = Object.keys(msg.payload);
			let pdValid = true;
            if (payloadKeys[0] === "iolink") 
			{	
				pdValid = msg.payload.iolink.valid
                msg.payload = msg.payload.iolink.value;
            } else if (payloadKeys[0] === "value") {
                msg.payload = msg.payload.value;
            } else {
                this.status({fill: "red", shape: "dot", text: "No IO-Link Dataset according to spec!"});
                node.error("No IO-Link Dataset according to JSON/API spec!", msg);
                return;
            }

            if (msg.hasOwnProperty('dataType') && typeof(msg.dataType) === 'number') {
                dataType = msg.dataType;
            }
            if (msg.hasOwnProperty('bitOffset') && typeof(msg.bitOffset) === 'number') {
                bitOffset = msg.bitOffset;
            }
            if (msg.hasOwnProperty('bitLength') && typeof(msg.bitLength) === 'number') {
                bitLength = msg.bitLength;
            }
            if (msg.hasOwnProperty('gradient') && typeof(msg.gradient) === 'number') {
                gradient = msg.gradient;
            }
            if (msg.hasOwnProperty('Label') && typeof(msg.Label) === 'string') {
                Label = msg.Label;
            }
			
			msg.topic = Label;
			
            msg.payload = parseValue(msg.payload, dataType, pdValid);
			node.send(msg);
			
        });
    }

    RED.nodes.registerType("extract-data", extractData);
}
