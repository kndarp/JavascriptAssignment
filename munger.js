var readline        = require('readline'),
    fs              = require('fs'),
    inputFilePath   = "data/Crimes_-_2001_to_present.csv",
    outputFilePath  = "data/output.json",
    reader          = fs.createReadStream(inputFilePath),
    csvConverter   = readline.createInterface({
      input   : reader
    }),
    outputFile    = fs.openSync(outputFilePath,'w+'),
    seperator     = "",
    lineCounter;

//    On Opening file, add '[' to the beginning of the file and initialize file counter.
reader.on('open', function(){
    console.time("conversionTime");
    fs.write(outputFile,"[");
    lineCounter = -1;
});

//    Create JSON objects of CSV rows and write them to file.
csvConverter.on('line',function(line){

  //  Increment line counter and skip for header row.
  if(lineCounter++ < 0 ){
      return;
    }

  //  Create JSON object from CSV Row
  var rowValues = line.split(",");
  var rowObject = {
    "Primary Type" : rowValues[5],
    "Description" : rowValues[6],
    "Arrest" : rowValues[8],
    "Year" : rowValues[17]
  }

  //  Write JSON object to file with prepended seperator
  fs.write(outputFile,seperator+JSON.stringify(rowObject));

  if(!seperator)
    seperator = ",\n";

  //  Log line count
  console.log("Reading line ",lineCounter);
});


//    On end of input file, add ']' to output file
reader.on('end',function(){

  fs.write(outputFile,"]");
  console.log("======End of Input File======");
  console.log("Total Records read : ",lineCounter);
  console.timeEnd("conversionTime");

});
