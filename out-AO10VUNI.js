module.exports = function(RED) {
    function OutWriteAO10VUni(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        let { analogValue } = config;
        
        node.on('input', function(msg) {
			let pD=[0,0];
       
                node.status({fill: "green", shape: "dot", text:"Processdata ready"});
                if (msg.hasOwnProperty('analogValue') && typeof msg.analogValue === "number") {
					
					if(msg.analogValue<= 11.8518239 && msg.analogValue>=0)
					{
                    analogValue = msg.analogValue;
					}
					else
					{
						node.status({fill: "yellow", shape: "dot", text:"Processdata msg.analogValue has wrong value"});
						analogValue = 0;
					}
					
                }
				
				let dezVal = Math.ceil(analogValue/0.0003617);
				
				// 
				
				pD[1]= dezVal&0x00FF;
				pD[0]= (dezVal &0xFF00)>>8;
				
	
				var newMsg = {payload:"",pD:pD};
				node.send(newMsg);
				
				
        });
    }

    RED.nodes.registerType("out-AO10VUNI", OutWriteAO10VUni);
}
