/*!
 * mota-evaluador v0.3.0
 * Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA
 * (c) 2019 
 * MIT License
 * https://github.com/Dejusticia/mota-evaluador-publico
 */

var jsonexport = require('jsonexport');
var fs = require('fs');

var reader = fs.createReadStream('src/copy/reports/report-corteconstitucional-gov-co.json');
var writer = fs.createWriteStream('src/copy/reports/report-corteconstitucional-gov-co.csv');

reader.pipe(jsonexport()).pipe(writer);
