module.exports = function(RED) {
    function OutWriteComlight56(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        let { ledColor, ledMode, buzzPattern, buzzState } = config;
        
        node.on('input', function(msg) {
			let pD=[0,0];
       
                node.status({fill: "green", shape: "dot", text:"Processdata ready"});
                if (msg.hasOwnProperty('ledColor') && typeof msg.ledColor === "number") {
					
					if(msg.ledColor<= 7 && msg.ledColor>=0)
					{
                    ledColor = msg.ledColor;
					}
					else
					{
						node.status({fill: "yellow", shape: "dot", text:"Processdata msg.ledColor has wrong value"});
						ledColor = 0;
					}
					
                }
				
                if (msg.hasOwnProperty('ledMode') && typeof msg.ledMode === "number") {
					
					if(msg.ledMode<= 8 && msg.ledMode>=0)
					{
                    ledMode = msg.ledMode;
					}
					else
					{
						node.status({fill: "yellow", shape: "dot", text:"Processdata msg.ledMode has wrong value"});
						ledMode = 0;
					}
					
                   
                }
				
                if (msg.hasOwnProperty('buzzPattern') && typeof msg.buzzPattern === "number") {
                   
					
					if(msg.buzzPattern<= 8 && msg.buzzPattern>=0)
					{
                    buzzPattern = msg.buzzPattern;
					}
					else
					{
						node.status({fill: "yellow", shape: "dot", text:"Processdata msg.buzzPattern has wrong value"});
						buzzPattern = 0;
					}
                }
				if (msg.hasOwnProperty('buzzState') && (typeof msg.buzzState === "number"||typeof msg.buzzState === "boolean")) {
                    
					if(msg.buzzState<= 8 && msg.buzzState>=0)
					{
                    buzzState = msg.buzzState;
					}
					else
					{
						node.status({fill: "yellow", shape: "dot", text:"Processdata msg.buzzState has wrong value"});
						buzzState = 0;
					}
                }
				
                
				
				
				
				// 
				
				pD[1]= parseInt(ledColor) + (parseInt(buzzState)<<4);
				pD[0]= parseInt(ledMode) + (parseInt(buzzPattern)<<4);
				
				
				var newMsg = {payload:"",pD:pD};
				node.send(newMsg);
				
				
        });
    }

    RED.nodes.registerType("out-Comlight56", OutWriteComlight56);
}
