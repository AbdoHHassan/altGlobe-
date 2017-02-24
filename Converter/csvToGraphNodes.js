
/* converts a csv file to graph nodes, readable by gephi */


//make table of nodes


nodeArray=new Array();
var fs = require("fs")
var csv = require("fast-csv");

var id=0;
cache={};

table1=new(Array)
csv
 .fromPath("parisfullpredicted.csv")
 .on("data", function(data){
     
 	node={}



	if (cache[data[data.length-2]]==undefined){ 
		console.log("logging: ",cache[data[data.length-1]])
     node['id']=id++;
     node['Label']=data[data.length-2]
     node['timeSeries']= null
     cache[data[data.length-2]]=1
      nodeArray.push(node)

 }else{
 	console.log("key ",data[data.length-1]," already exists")
 }
 // if (cache[data[0]]==undefined){ 
	// 	console.log(cache[data[0]])
 //     node['id']=id++;
 //     node['Label']=data[0]
 //     node['timeSeries']= null
 //     cache[data[0]]=1
 //      nodeArray.push(node)

 // }
     //csvStream.write(node);
     console.log(node)
  //   var writer = ya.createCsvStreamWriter(fs.createWriteStream('rioNodess.csv', node)); 

 })
 .on("end", function(){
        console.log("done readnig!");

 //var writer = csvWriter({ headers: ["id", "label","timeSeries"]})

csv
   .writeToPath("ParisNodes.csv", nodeArray, {headers: true})
   .on("finish", function(){
       console.log("done writing!");
   });
     
//csvStream.end();

 });	
// writableStream.on("finish", function(){
//   console.log("DONE with writing!");
// });
