//calculate all the countries and their distances from france
//load data from Edges
file1= '/Users/Abdo/Documents/workspace/JSON\ reader\ test/country-lat-long.json'
nodeNum={}
var fs = require("fs")
 var geolib = require('geolib');

		   var csv = require("fast-csv");
		   var jsonfile= require("jsonfile")
nodeArray=new Array();


//load dictinoary of the countries and their coordinates
dictionary={}
jsonfile.readFile(file1, function(err, obj) {
  console.dir('done loading dictionary');

  dictionary=obj;
  loadNodes();
})
//load dictionary with dic['Node id']= node label
function loadNodes(){
csv
.fromPath("/Users/Abdo/Documents/MSc\ Thesis/SourceCode/Converter/ParisNodes.csv")
.on("data", function(data){
// console.log(data);
	nodeNum[data[0]]= data[1];

})
.on("end", function(){
	//console.log(nodeNum['140']);
	console.log("done loading nodes dictionary");
	loadEdges()
});
}








//load the file containing the edges
function loadEdges(){

csv
 .fromPath("/Users/Abdo/Documents/MSc\ Thesis/SourceCode/Converter/parisEdges2.csv")
 .on("data", function(data){
 		console.log("REACHED");

 	node={}


 	//origin is a number
 	origin= data[0]
 		console.log(origin);

 	//origin now iso-2 code
 	origin= nodeNum[origin]
 	 		console.log(origin);


 	//origin is now a set of coordinates
 	origin=origin.toLowerCase()

 	console.log("origin is    ", origin)

 	dest='fr'

 	 		console.log(dictionary[dest][1]);

 	dist =geolib.getDistance(
		    {latitude: dictionary[origin][0], longitude: dictionary[origin][1]},
		    {latitude: dictionary[dest][0], longitude: dictionary[dest][1]}
		)

	newWeight= (dist/20003931)
		node['Source']= data[0]
		node['Target']= data[1]
		node['Type']='Directed'
		node['Id']=data[3]
		node['Label']=data[4]
		node['Weight']= newWeight;
		nodeArray.push(node)
     
 })
 .on("end", function(){
        console.log("done readnig!");


		console.log("done edges");
		csv
   .writeToPath("ParisDistanceBiasEdges.csv", nodeArray, {headers: true})
   .on("finish", function(){
      console.log()
       console.log("done writing!");
   });
   });

}

