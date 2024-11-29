module.exports = function(RED) {
    function InReadDIOHub(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        
		let pinPort = parseInt(config.pinPort);
        let fwFeatures =parseInt(config.fwFeatures);
        node.on('input', function(msg) {
			let pD={};
       
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
				
				 if (msg.hasOwnProperty('fwFeatures') && typeof msg.fwFeatures === "number") {
					
					
					if(msg.fwFeatures===1 ||msg.fwFeatures===0)
					{
						fwFeatures = msg.fwFeatures;
					}
					else
					{
						node.status({fill: "yellow", shape: "dot", text:"Processdata msg.fwFeatures has wrong value"});
						fwFeatures = 0;
					}
					
                }
				
				
				let pdIn = {};
				switch(pinPort)
				{
					case 0:
							//Pin based
							for(let i=0;i<8;i++)
							{
								let attribPin4 = "";
							
								attribPin4 = `port${i}Pin4`;
							
								pdIn[attribPin4] = !! (((msg.payload.iolink.value[0])>>i) & 0x01);
								
							}
							
							for(let i=0;i<8;i++)
							{
								attribPin2 = `port${i}Pin2`;
								pdIn[attribPin2] = !! (((msg.payload.iolink.value[1])>>i) & 0x01);
							}
							
							break;
					case 1:
							//Port based
							let j=0;
							for (let i=0;i<8;i=i+2)
							{
								
								pdIn["port"+(j).toString()+"Pin4"] = !! (((msg.payload.iolink.value[0])>>i) & 0x01);
								pdIn["port"+(j).toString()+"Pin2"] = !! (((msg.payload.iolink.value[0])>>(i+1)) & 0x01);
								j++;
								
									
							}
							
							
							for (let i=0;i<8;i=i+2)
							{
								
								pdIn["port"+(j).toString()+"Pin4"] = !! (((msg.payload.iolink.value[1])>>i) & 0x01);
								pdIn["port"+(j).toString()+"Pin2"] = !! ((msg.payload.iolink.value[1])>>(i+1) & 0x01);
								j++;
									
							}
							
									
							break;
					default:
							
							node.status({fill: "yellow", shape: "dot", text:"Processdata msg.pinPort has wrong value, reset outputs"});
							msg.payload = "";
							break;
				}
				
				if(fwFeatures ===1)
				{
								
					pdIn['diagnosticSupplyVoltage']= !! (msg.payload.iolink.value[2] & 0x01);
					pdIn['diagnosticTemperature']= !! ((msg.payload.iolink.value[2]>>1) & 0x01);
					pdIn['activeError']= !! ((msg.payload.iolink.value[2]>>2) & 0x01);
					pdIn['channelNumber']=  (msg.payload.iolink.value[2] & 0x78)>>3;
					pdIn['globalStaus']=  !! ((msg.payload.iolink.value[2]>>7) & 0x01);
					pdIn['moduleIdentification']=  msg.payload.iolink.value[3] ;
				}
				
				var newMsg = {payload:pdIn};
				node.send(newMsg);
				
				
        });
    }

    RED.nodes.registerType("in-DIOHub", InReadDIOHub);
}
