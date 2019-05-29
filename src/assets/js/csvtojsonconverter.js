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
