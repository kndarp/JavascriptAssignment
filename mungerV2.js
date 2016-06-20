var readline        = require('readline'),
    fs              = require('fs'),
    inputFilePath   = "Crimes_-_2001_to_present_1.csv",
    theftFilePath   = "theft.json",
    assaultFilePath = "assault.json",
    fileTheft = fs.openSync(theftFilePath,"w+"),
    fileAssault = fs.openSync(assaultFilePath,"w+"),
    lineCounter,
    arTheft = [],
    arAssault = [],
    initializeArrays = function(){
      for( var i=1; i<=16; i++){
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
    csvConverter    = readline.createInterface({
      input   : reader
    }),
    statics = {
        theft : "THEFT",
        assault : "ASSAULT",
        under500 : "THEFT $500 AND UNDER",
        over500 : "THEFT OVER $500",
        arrested  : "ARRESTED",
        notArrested : "NOT ARRESTED",
        yearBound : 2001,
        dollar500: "$500"
    },
    regex             =  /,(?=(?:(?:[^"]*"){2})*[^"]*$)/g,
    arHeader,
    indices = {
      strPrimaryType : "Primary Type",
      strDesc : "Description",
      strArrested : "Arrest",
      strYear : "Year"
    };
    // regex2           = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
    // regex           = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;


//    On Opening file, add '[' to the beginning of the file and initialize file counter.
reader.on('open', function(){
    console.time("conversionTime");
    lineCounter = -1;
    initializeArrays();
  });


    //    Create JSON objects of CSV rows and write them to file.
csvConverter.on('line',function(line){


    // console.log(line);

    //  Create JSON object from CSV Row

    var rowValues = line.split(regex);
    // console.log(JSON.stringify(rowValues));
    /*  Legend for Row Values
    *
    *   rowValues[5]  - Primary Type
    *   rowValues[6]  - Description
    *   rowValues[8]  - Arrest
    *   rowValues[17] - Year
    *
    */

    //  Increment line counter and skip for header row.
    if(lineCounter++ < 0 ){
      arHeader = rowValues;
      for( var i=0; i<arHeader.length; i++){
        switch (arHeader[i]) {
          case indices.strPrimaryType:
            indices.iPrimType = i;
            break;
          case indices.strDesc:
            indices.iDesc = i;
            break;
          case indices.strArrested:
            indices.iArrest = i;
            break;
          case indices.strYear:
            indices.iYear = i;
            break;

        }
      }
      return;
    }

    //  Log line count
    console.log("Reading line ",lineCounter);

    var year  = +(rowValues[indices.iYear]);
    index = year - statics.yearBound;

    switch (rowValues[indices.iPrimType]) {
      case statics.theft:  (iFound = rowValues[indices.iDesc].toUpperCase().indexOf(statics.dollar500)) != -1 && ((iFound == 0) ? arTheft[index][statics.under500]++ : arTheft[index][statics.over500]++);
                    break;
      case statics.assault: (rowValues[indices.iArrest].toUpperCase().indexOf("TRUE") != -1) ? arAssault[index][statics.arrested]++ : arAssault[index][statics.notArrested]++;
                    break;
    }

});


//    On end of input file, write objects to their respective files.
reader.on('end',function(){

    console.log("======End of Input File======");

    fs.write(fileTheft,JSON.stringify(arTheft));
    fs.write(fileAssault,JSON.stringify(arAssault));

    console.log("Total Records read : ",lineCounter);
    console.timeEnd("conversionTime");

});
