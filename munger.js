var readline        = require('readline'),
    fs              = require('fs'),
    inputFilePath   = "Crimes_-_2001_to_present.csv",
    theftFilePath   = "theft.json",
    assaultFilePath = "assault.json",
    fileTheft = fs.openSync(theftFilePath,"w+"),
    fileAssault = fs.openSync(assaultFilePath,"w+"),
    lineCounter,
    arTheft = [],
    arAssault = [],
    initializeArrays = function(){
      for( i=1; i<=16; i++){
        var obTheft = {"THEFT OVER $500": 0, "THEFT $500 AND UNDER" : 0},
            obAssault = {"ARRESTED": 0, "NOT ARRESTED": 0},
            year = 2000 + i;

            obTheft.YEAR = year;
            obAssault.YEAR = year;

            arTheft.push(obTheft);
            arAssault.push(obAssault);
      }
      console.log("Arrays initialized");
    },
    reader          = fs.createReadStream(inputFilePath),
    csvConverter,
    regex           = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

//    On Opening file, add '[' to the beginning of the file and initialize file counter.
reader.on('open', function(){
    console.time("conversionTime");
    lineCounter = -1;
    initializeArrays();
    csvConverter    = readline.createInterface({
      input   : reader
    });


    //    Create JSON objects of CSV rows and write them to file.
    csvConverter.on('line',function(line){

      //  Increment line counter and skip for header row.
      if(lineCounter++ < 0 ){
          return;
        }

      //  Log line count
      console.log("Reading line ",lineCounter);
      //console.log(line);

      //  Create JSON object from CSV Row

      var rowValues = line.match(regex);
      //console.log(JSON.stringify(rowValues));
      /*  Legend for Row Values
      *
      *   rowValues[5]  - Primary Type
      *   rowValues[6]  - Description
      *   rowValues[8]  - Arrest
      *   rowValues[17] - Year
      *
      */

      var year  = +(rowValues[17].replace(',',"")),
      index = year - 2001;

      if (rowValues[5] == "THEFT," && rowValues[6].indexOf('$500') != -1) {

        if(rowValues[6].toUpperCase().indexOf('UNDER') != -1){
          arTheft[index]['THEFT $500 AND UNDER']++;
          // console.log("THEFT $500 AND UNDER");
        }else {
          arTheft[index]['THEFT OVER $500']++;
          // console.log("THEFT OVER $500");
        }
      }

      if (rowValues[5] == "ASSAULT,") {
        if(rowValues[8].toUpperCase().indexOf("TRUE") != -1){
          arAssault[index]['ARRESTED']++;
          // console.log("ASSAULT ARRESTED");
        }else {
          arAssault[index]['NOT ARRESTED']++;
          // console.log("ASSAULT NOT ARRESTED");
        }
      }

    });

});


//    On end of input file, write objects to their respective files.
reader.on('end',function(){

  console.log("======End of Input File======");

  fs.write(fileTheft,JSON.stringify(arTheft));
  fs.write(fileAssault,JSON.stringify(arAssault));

  console.log("Total Records read : ",lineCounter);
  console.timeEnd("conversionTime");

});
