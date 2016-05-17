var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream');

var lineNr = 0;

function getType(str){
    console.log(str);
    if (typeof str !== 'string') str = str.toString();
    var nan = isNaN(Number(str));
    var isfloat = /^\d*(\.|,)\d*$/;
    var commaFloat = /^(\d{0,3}(,)?)+\.\d*$/;
    var dotFloat = /^(\d{0,3}(\.)?)+,\d*$/;
    var date = /^\d{0,4}(\.|\/)\d{0,4}(\.|\/)\d{0,4}$/;
    if (!nan){
        if (parseFloat(str) === parseInt(str)) {
            console.log("integer");
        }
        else console.log("float");
    }
    else if (isfloat.test(str) || commaFloat.test(str) || dotFloat.test(str)) console.log("float");
    else if (date.test(str)) console.log("date");
    else {
        console.log("string");
    }
};

function typeDetector(filename) {
    var s = fs.createReadStream('census.csv')
        .pipe(es.split())
        .pipe(es.mapSync(function(line){

            // pause the readstream
            s.pause();

            lineNr += 1;

            // process line here and call s.resume() when rdy
            // function below was for logging memory usage
            console.log(line)
            columns = line.split(',')
            columns.forEach(function(part, index){
                columns[index] = part.replace(/\"/g,'');
            })
            columns.forEach(getType)
            console.log('-------------------------')

            // resume the readstream, possibly from a callback
            s.resume();
        })
        .on('error', function(){
            console.log('Error while reading file.');
        })
        .on('end', function(){
            console.log('Read entire file.')
        })
    );
};

module.exports = {
    getType: getType,
    typeDetector: typeDetector,
}
