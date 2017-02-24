
//find out the twitter population based on the world2015 dataset and save it to twitterpopulations.json
var fs = require('fs');
var jsonParser = require('big-json-streamer');
 
var file = process.argv[2];
var output = file ? fs.createWriteStream(file) : process.stdout;
var input = fs.createReadStream('worldboundingbox2.json');
var outputFilename= 'twitterPopulations.json';
countrypop={} 
//Set readableStream from where read the json 
jsonParser.setInput(input);
//Set writableStream from where write the json 
jsonParser.setOutput(output);
//Set callback to get each json found 
jsonParser.onJson(function(json, string, collection) {
 
 
	obj=JSON.parse(string);

	//if string contains keyword
	//	console.log("obj is \n", obj);
		if (countrypop[obj['real_location']] == undefined){
			//add it
			countrypop[obj['real_location']]=0;
		}
		else{
			countrypop[obj['real_location']] = countrypop[obj['real_location']]+1;


      //  return string;
		}
//    } 
 
});
 
//Set callback to do something when the big json finish. 
jsonParser.onEnd(function() {
    console.log('End!');
        console.log(countrypop);
        fs.appendFile (outputFilename, JSON.stringify(countrypop, null, 4),function(err){
				if (err){
					console.log(err);
				} else {
					console.log("JSON saved to "+ outputFilename);
				}
			});
});
 
//Start the parsing 
jsonParser.parse();