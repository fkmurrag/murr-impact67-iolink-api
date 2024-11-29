module.exports = function(RED) {
    function OutWriteAO420mAUni(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        let { analogValue } = config;
        
        node.on('input', function(msg) {
			let pD=[0,0];
       
                node.status({fill: "green", shape: "dot", text:"Processdata ready"});
                if (msg.hasOwnProperty('analogValue') && typeof msg.analogValue === "number") {
					
					if(msg.analogValue<= 22.96 && msg.analogValue>=4)
					{
                    analogValue = msg.analogValue;
					}
					else
					{
						node.status({fill: "yellow", shape: "dot", text:"Processdata msg.analogValue has wrong value"});
						analogValue = 4;
					}
					
                }
				
				let dezVal = Math.ceil((analogValue-4)/0.0005787);
				
				// 
				
				pD[1]= dezVal&0x00FF;
				pD[0]= (dezVal &0xFF00)>>8;
				
	
				var newMsg = {payload:"",pD:pD};
				node.send(newMsg);
				
				
        });
    }

    RED.nodes.registerType("out-AO4_20mAUNI", OutWriteAO420mAUni);
}
