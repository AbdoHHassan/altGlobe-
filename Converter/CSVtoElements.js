//converts nodes and edges into website-readable format



// read nodes file 

nodeArray=new Array();
var fs = require("fs")
var csv = require("fast-csv");
var jsonfile= require("jsonfile")
var util = require('util');


nodes=new Array()

edges=new Array()

elements= new Array()
iso2={}





jsonfile.readFile('/Users/Abdo/Desktop/Node2/iso2.json', function(err, obj) {
		console.dir('done loading iso-2 file');
		iso2=obj

csv
.fromPath("/Users/Abdo/Downloads/data/pythonConverter/RioGraphInfo/my.csv")
.on("data", function(data){
// console.log(data);
node={}
nodes[data[0]]= data[1]
//console.log(data[0])
nodes.push(node)
})
.on("end", function(){
	//console.log(nodeNum['140']);
	console.log("done loading nodes");
	loadEdges()

});

// read Edges file


function loadEdges(){
	
csv
.fromPath("/Users/Abdo/Documents/MSc\ Thesis/SourceCode/Gephi\ Visualization\ Files/rioEdges.csv")
.on("data", function(data){
element={}


sourceCountry= data[0]
sourceCountry= nodes[sourceCountry]
sourceCountry= iso2[sourceCountry]
//console.log(sourceCountry)
destinationCountry=data[1]
destinationCountry=nodes[destinationCountry]
destinationCountry=iso2[destinationCountry]
weight= data[6]

element['e']=sourceCountry
element['i']= destinationCountry
element['wc']= 'R'
element['v']= weight

elements.push(element)



})
.on("end", function(){
	console.log("done loading Edges ");
	elements = JSON.stringify(elements);

	fs.writeFileSync('AllElements2.json', util.inspect(elements) , 'utf-8');

});

}
});


