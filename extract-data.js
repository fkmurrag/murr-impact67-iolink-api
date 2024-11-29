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
        let decimals = parseInt (config.decimals);

        

        // Verarbeitet den Payload basierend auf dem Datentyp
        function parseValue(payload, dataType, valid) {
			let val;
            let hexString="";
            let binaryString="";

            switch (dataType) {
                case 0: // Boolean Values
                     hexString= Buffer.from(payload).toString('hex'); // Hex-String ohne Trennzeichen
                    // Hex-String in Binärdarstellung umwandeln
                     binaryString = BigInt("0x" + hexString).toString(2).padStart(hexString.length * 4, "0");
                    // Extrahiere das einzelne Bit
                    let singleBit = binaryString[binaryString.length - 1 - bitOffset]; // Von rechts gezählt
                    val= parseInt(singleBit,2);
                    val = val === 1;
                    node.status({fill: "green", shape: "dot", text: "Successfully parsed Boolean"});
                    break;

                case 1: // Integer Values


                    // Input Hex-String (z. B. von msg.payload)
                     hexString= Buffer.from(payload).toString('hex'); // Hex-String ohne Trennzeichen
                    binaryString = BigInt("0x" + hexString).toString(2).padStart(hexString.length * 4, "0");

                    // Berechne den Offset von links
                    let bitOffsetFromLeft = binaryString.length - bitOffset - bitLength;

                    // Bits extrahieren
                    let extractedBits = binaryString.substr(bitOffsetFromLeft, bitLength);
    
                    let intVal = parseInt(extractedBits, 2);

                    val = gradient !== 1.00 ? intVal * gradient : intVal;
                    node.status({fill: "green", shape: "dot", text: "Successfully parsed Number"});
                    break;

                case 2: // IEEE754 Float


                    hexString= Buffer.from(payload).toString('hex'); // Hex-String ohne Trennzeichen
                    binaryString = BigInt("0x" + hexString).toString(2).padStart(hexString.length * 4, "0");
                    let bitOffsetFromLeftFloat = binaryString.length - bitOffset - 32;
                    let extractedBitsFloat = binaryString.substr(bitOffsetFromLeftFloat, 32);
                
                
                    let intgerVal = parseInt(extractedBitsFloat,2);
                    let bufferFloat = Buffer.alloc(4);
                
                
                    bufferFloat.writeUInt32BE(intgerVal, 0);
                
                    let realVal = bufferFloat.readFloatBE(0);

                    val = realVal
                    if(decimals>0)
                    {
                        val = val.toFixed(decimals);
                        val = parseFloat(val);     
                    }
                    
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
            if (msg.hasOwnProperty('decimals') && typeof(msg.decimals) === 'number') {
                decimals = msg.decimals;
            }
			
			msg.topic = Label;
			try{
            msg.payload = parseValue(msg.payload, dataType, pdValid);
			node.send(msg);
            }
            catch(e)
            {
                node.error("Error parsing Data" + e.message);
                node.status({fill: "red", shape: "dot", text: e.message});

            }
			
        });
    }

    RED.nodes.registerType("extract-data", extractData);
}
