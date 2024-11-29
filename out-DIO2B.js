module.exports = function(RED) {
    function OutWriteDIO2B(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        let { pin4X0, pin4X1, pin4X2, pin4X3,pin4X4,pin4X5, pin4X6,pin4X7,pin2X0,pin2X1,pin2X2,pin2X3,pin2X4,pin2X5,pin2X6,pin2X7} = config;
		let pinPort = parseInt(config.pinPort);
        
        node.on('input', function(msg) {
			let pD=[0,0];
       
                node.status({fill: "green", shape: "dot", text:"Processdata ready"});
				
				
                if (msg.hasOwnProperty('pinPort') && typeof msg.pinPort === "number") {
					
					
					if(msg.pinPort===1 ||msg.pinPort===0)
					{
						pinPort = msg.pinPort;
					}
					else
					{
						node.status({fill: "yellow", shape: "dot", text:"Processdata msg.pinPort has wrong value"});
						pinPort = 0;
					}
					
                }
				
				if (msg.hasOwnProperty('pin4X0')) { if (typeof msg.pin4X0 === "boolean") { pin4X0 = msg.pin4X0; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin4X0 has wrong value"}); } }
				if (msg.hasOwnProperty('pin4X1')) { if (typeof msg.pin4X1 === "boolean") { pin4X1 = msg.pin4X1; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin4X1 has wrong value"}); } }
				if (msg.hasOwnProperty('pin4X2')) { if (typeof msg.pin4X2 === "boolean") { pin4X2 = msg.pin4X2; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin4X2 has wrong value"}); } }
				if (msg.hasOwnProperty('pin4X3')) { if (typeof msg.pin4X3 === "boolean") { pin4X3 = msg.pin4X3; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin4X3 has wrong value"}); } }
                if (msg.hasOwnProperty('pin4X4')) { if (typeof msg.pin4X4 === "boolean") { pin4X4 = msg.pin4X4; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin4X4 has wrong value"}); } }
				if (msg.hasOwnProperty('pin4X5')) { if (typeof msg.pin4X5 === "boolean") { pin4X5 = msg.pin4X5; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin4X5 has wrong value"}); } }
				if (msg.hasOwnProperty('pin4X6')) { if (typeof msg.pin4X6 === "boolean") { pin4X6 = msg.pin4X6; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin4X6 has wrong value"}); } }
				if (msg.hasOwnProperty('pin4X7')) { if (typeof msg.pin4X7 === "boolean") { pin4X7 = msg.pin4X7; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin4X7 has wrong value"}); } }
                
				
				if (msg.hasOwnProperty('pin2X0')) { if (typeof msg.pin2X0 === "boolean") { pin2X0 = msg.pin2X0; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin2X0 has wrong value"}); } }
				if (msg.hasOwnProperty('pin2X1')) { if (typeof msg.pin2X1 === "boolean") { pin2X1 = msg.pin2X1; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin2X1 has wrong value"}); } }
				if (msg.hasOwnProperty('pin2X2')) { if (typeof msg.pin2X2 === "boolean") { pin2X2 = msg.pin2X2; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin2X2 has wrong value"}); } }
				if (msg.hasOwnProperty('pin2X3')) { if (typeof msg.pin2X3 === "boolean") { pin2X3 = msg.pin2X3; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin2X3 has wrong value"}); } }
                if (msg.hasOwnProperty('pin2X4')) { if (typeof msg.pin2X4 === "boolean") { pin2X4 = msg.pin2X4; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin2X4 has wrong value"}); } }
				if (msg.hasOwnProperty('pin2X5')) { if (typeof msg.pin2X5 === "boolean") { pin2X5 = msg.pin2X5; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin2X5 has wrong value"}); } }
				if (msg.hasOwnProperty('pin2X6')) { if (typeof msg.pin2X6 === "boolean") { pin2X6 = msg.pin2X6; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin2X6 has wrong value"}); } }
				if (msg.hasOwnProperty('pin2X7')) { if (typeof msg.pin2X7 === "boolean") { pin2X7 = msg.pin2X7; } else { node.status({fill: "yellow", shape: "dot", text: "Processdata msg.pin2X7 has wrong value"}); } }
				
				
				
				switch(pinPort)
				{
					case 0:
							//Pin based
							pD[1]= pin2X0 +(pin2X1<<1)+(pin2X2<<2)+ (pin2X3<<3)+ (pin2X4<<4)+(pin2X5<<5)+(pin2X6<<6)+(pin2X7<<7);
							pD[0]= pin4X0 +(pin4X1<<1)+(pin4X2<<2)+ (pin4X3<<3)+ (pin4X4<<4)+(pin4X5<<5)+(pin4X6<<6)+(pin4X7<<7); 
							break;
					case 1:
							//Port based
							pD[1]= pin4X4 +(pin2X4<<1)+(pin4X5<<2)+ (pin2X5<<3)+ (pin4X6<<4)+(pin2X6<<5)+(pin4X7<<6)+(pin2X7<<7);
							pD[0]= pin4X0 +(pin2X0<<1)+(pin4X1<<2)+ (pin2X1<<3)+ (pin4X2<<4)+(pin2X2<<5)+(pin4X3<<6)+(pin2X3<<7);
							break;
					default:
							pD[1]= 0;
							pD[0]= 0;
							node.status({fill: "yellow", shape: "dot", text:"Processdata msg.pinPort has wrong value, reset outputs"});
							break;
				}
				
				
				var newMsg = {payload:"",pD:pD , pinPort:pinPort};
				node.send(newMsg);
				
				
        });
    }

    RED.nodes.registerType("out-DIO2B", OutWriteDIO2B);
}
