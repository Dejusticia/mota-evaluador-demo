/*!
 * mota-evaluador v0.1.0
 * Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA
 * (c) 2019 
 * MIT License
 * https://github.com/Dejusticia/mota-evaluador-publico
 */

const csvFilePath = 'src/copy/reports/report-corteconstitucional-gov-co.csv'
const csv = require('csvtojson')
csv()
	.fromFile(csvFilePath)
	.then((jsonObj) => {
		console.log(jsonObj);
		/**
		 * [
		 * 	{a:"1", b:"2", c:"3"},
		 * 	{a:"4", b:"5". c:"6"}
		 * ]
		 */
	})
