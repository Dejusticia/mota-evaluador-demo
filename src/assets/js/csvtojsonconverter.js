/* Used to convert manually generate CSV reports into JSON
 * according to MOTA specification.
 */

const fs = require('fs');
const csv = require('csvtojson');

// find CSV files on reports directory
var reportsInFolder = fs.readdirSync('src/copy/reports/').filter(fn => fn.endsWith('.csv'));
console.log('reportsInFolder =');
console.log(reportsInFolder);

// for each file, add meta information and generate a json file
reportsInFolder.forEach(function(element){
    let csvFilePath = 'src/copy/reports/' + element;
    let jsonFilePath = csvFilePath.replace('.csv', '.json');
    let fileBasename = element.substr(7).replace( '-gov-co', '').replace('.csv', '');
    let entityName = fileBasename.replace('www-', '').toUpperCase();
    let entityUrl = fileBasename + '.gov.co';
    let obj = {
        meta: {
            entityName: entityName,
            entityUrl: entityUrl,
            lastEvaluationDate: "2019-05-21T22:44:57+00:00",
            lastEvaluationEpoch: "1558478697",
            protocolSpeficication: "https://mota.dejusticia.org/specs/mota-active-transparency-specificiation/",
            specificationUri: "https://mota.dejusticia.org/specs/colombia-corte-constitucional/",
            sitemap: "http://www.corteconstitucional.gov.co/sitemap.xml",
            transparencyConfig: "http://www.corteconstitucional.gov.co/transparency.xml",
            generalGrade: "275",
            generalGradeNormalized: "40",
        },
    };
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj);
            obj.rules = jsonObj;
            var json = JSON.stringify(obj);
            console.log('json =');
            console.log(json);
            fs.writeFile( jsonFilePath, json, 'utf8', function (err) {
                if (err) throw err;
                console.log('Saved this file!');
                console.log(jsonFilePath);
            });
        });


});

