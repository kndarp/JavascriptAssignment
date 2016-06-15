var Converter = require('csvtojson').Converter,
    fs = require('fs'),
    inputFilePath = "data/FoodFacts.csv",
    outputFilePath = "data/output.json",
    csvConverter = new Converter({ constructResult:false}),
    readStream = fs.createReadStream(inputFilePath),
    writeStream = fs.createWriteStream(outputFilePath);


readStream.pipe(csvConverter).pipe(writeStream);
