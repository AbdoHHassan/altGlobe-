//calculates the political relevance of the attacks on thecountries. based on the World Terrorism index report of 2015


 var csv = require("fast-csv");
		   var jsonfile= require("jsonfile")


var fs = require("fs")

		   var jsonfile= require("jsonfile")
nodeArray=new Array();

Bias={}
nodeNum={}


csv
.fromPath("/Users/Abdo/Documents/MSc\ Thesis/SourceCode/Converter/ParisNodes.csv")
.on("data", function(data){
// console.log(data);
	nodeNum[data[0]]= data[1];

})
.on("end", function(){
	//console.log(nodeNum['140']);
	console.log("done loading nodes dictionary");
	loadBias()
});



function loadBias(){

csv
.fromPath("//Users/Abdo/Documents/MSc\ Thesis/SourceCode/Converter/relevanceBias.csv")
.on("data", function(data){
// console.log(data);
Bias[data[0]]= data[1]
})
.on("end", function(){
	//console.log(nodeNum['140']);
	console.log("done loading Bias");
	loadEdges()
});
}



function loadEdges(){

csv
.fromPath("/Users/Abdo/Documents/MSc\ Thesis/SourceCode/Converter/ParisEdges2.csv")
.on("data", function(data){
// console.log(data);
		//assume a score of one for undefined

		node={}
		source=nodeNum[data[0]];
		//console.log("source",source)
		//console.log("source bias",Bias[source])



				weightFactor= 1-(Bias[source])/10
		if( Bias[source] == undefined){
			weightFactor=.9;
		}

		console.log("WF: ",weightFactor)

		//console.log(data[0])
		node['Source']= data[0]
		node['Target']= data[1]
		node['Type']='Directed'
		node['Id']=data[3]
		node['Label']=data[4]
		node['Weight']= data[6]*weightFactor;
		console.log(node['Weight'])

		nodeArray.push(node);

})
.on("end", function(){
	//console.log(nodeNum['140']);
	console.log("done loading Edges");
	csv
   .writeToPath("ParisRelevanceEdges.csv", nodeArray, {headers: true})
   .on("finish", function(){
      console.log()
       console.log("done writing!");
   });
});



}
