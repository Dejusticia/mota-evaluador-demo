/*!
 * mota-evaluador v0.1.0
 * Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA
 * (c) 2019 
 * MIT License
 * https://github.com/Dejusticia/mota-evaluador-publico
 */

/* POLYFILL */
(function templatePolyfill(d) {
	if ('content' in d.createElement('template')) {
		return false;
	}

	var qPlates = d.getElementsByTagName('template'),
		plateLen = qPlates.length,
		elPlate,
		qContent,
		contentLen,
		docContent;

	for (var x = 0; x < plateLen; ++x) {
		elPlate = qPlates[x];
		qContent = elPlate.childNodes;
		contentLen = qContent.length;
		docContent = d.createDocumentFragment();

		while (qContent[0]) {
			docContent.appendChild(qContent[0]);
		}

		elPlate.content = docContent;
	}
})(document);
var container = document.querySelector('.obligaciones-legales.insatisfactorias');
var ruleset;
var getRuleset = function(){
	atomic('http://localhost:3000/rulesets/ruleset-general.json', { responseType: 'json'})
		.then((function (response) {
			ruleset = response.data;
			console.log('success ruleset', ruleset); // xhr.responseText
			console.log('success full response', response.xhr);  // full response
			return response.data;
		}))
		.catch((function (error) {
			console.log('error code', error.status); // xhr.status
			console.log('error description', error.statusText); // xhr.statusText
		}));
}
var processRuleset = function (ruleset) {
	var rules = ruleset.rules;
	// Loop through each of the comments and add them to the comments list.
	for (var i = 0; i < rules.length; i++) {
		var rule = rules[i];
		var tmpl = document.getElementById('template-resultados-criteria').content.cloneNode(true);
		tmpl.querySelector('summary').innerText = rule.rule;
		tmpl.querySelector('details p').innerText = rule.shortDescription +  ' <a href="#" class="more-link">Más Informaciones.</a>';
		tmpl.querySelector('td.resultados-criteria-tipo').innerText = rule.type;
		container.appendChild(tmpl);
	}
};
var processResults = function(results){
	var gradeGeneral = grades.general;
	var gradeGeneralNormalized = grades.generalNormalized;
	var obligations = grades.obligations;
	var recommendations = grades.recommendations;
	// Loop through each of the comments and add them to the comments list.
	for (var i = 0; i < obligations.length; i++) {
		var obligation = obligations[i];
		var tmpl = document.getElementById('template-resultados-criteria').content.cloneNode(true);
		tmpl.querySelector('.comment-author').innerText = comment.author;
		tmpl.querySelector('.comment-body').innerText = comment.body;
		commentsList.appendChild(tmpl);
	}
}

