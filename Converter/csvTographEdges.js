//make table of nodes


//var csvStream = csv.createWriteStream({headers: true}),
//    writableStream = fs.createWriteStream("rioNodes.csv");
nodeArray=new Array();
var fs = require("fs")
var csv = require("fast-csv");
var ya = require('ya-csv');
var strsplit= require('strsplit')

//var csvStream = csv.format({headers: true}),
   // writableStream = fs.createWriteStream("rioNodess.csv");
//var ws = fs.createWriteStream("rioNodess.csv");
var id=0;
cache={};

table1=new(Array)

var nodeid={};
//load node dictionary
csv
 .fromPath("parisNodes.csv")
 .on("data", function(data){
     console.log(data);
  key= data[1]
//console.log(key)
  nodeid[key]=data[0]
         console.log("node ID is ", nodeid);

 })
 .on("end", function(){
       console.log(nodeid);

     console.log("done loading dictionary");
     process()
    // console.log(nodeid['EG']);
 });





function process(){



csv
 .fromPath("ParisFullPredicted.csv")
 .on("data", function(data){
    
  console.log(data)
 	node={}
  parsedSource=data[data.length-2]
  parsedSource=parsedSource.replace(/['"]+/g, '')
    parsedSource=parsedSource.replace(/(\?)*/g, '')



  //Source,Target,Type,id,label,timeset,weight
  parsedTarget=data[0];



  //since destinations are in the form: "Dest1,Dest2,Dest3", split them into ['Dest1','Dest2','Dest3']
  parsedTarget=parsedTarget.replace(/['"]+/g, '')
  parsedTarget=parsedTarget.replace(/(\?)*/g, '')
  parsedTarget=strsplit(parsedTarget,',');


    sourceID=nodeid[parsedSource]
  targetID=nodeid[parsedTarget[0]]
  console.log("===========",targetID)

//if entry doesnt previously exist
  if(cache[parsedSource+parsedTarget[0]] ==undefined){
      nodeID=id++;

  node['source']=sourceID
  node['Target']=targetID
  node['Type']='Directed'
  node['id']=nodeID;
  node['Label']=parsedSource+'/'+parsedTarget[0];
  node['timeset']=null
  node['weight']=1;
  nodeArray.push(node)
  cache[parsedSource+parsedTarget[0]]=nodeID;


  }
 else{
  //  console.log("already exists")
  //console.log("the weight is",nodeArray[cache[parsedSource+parsedTarget]])
  nodeArray[cache[parsedSource+parsedTarget[0]]].weight= nodeArray[cache[parsedSource+parsedTarget[0]]].weight+1 ;
 }



     //csvStream.write(node);
     console.log(node)
  //   var writer = ya.createCsvStreamWriter(fs.createWriteStream('rioNodess.csv', node)); 

 })
 .on("end", function(){
        console.log("done readnig!");

 //var writer = csvWriter({ headers: ["id", "label","timeSeries"]})

csv
   .writeToPath("parisEdges.csv", nodeArray, {headers: true})
   .on("finish", function(){
      console.log()
       console.log("done writing!");
   });
     
//csvStream.end();

 });	
// writableStream.on("finish", function(){
//   console.log("DONE with writing!");
// });
}
