/*!
 * mota-evaluador v0.1.0
 * Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA
 * (c) 2019 
 * MIT License
 * https://github.com/Dejusticia/mota-evaluador-publico
 */

/* HTML5 template element Polyfill */
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
;(function (window, document, undefined) {
    'use strict';
    var container, form, input, report, summaryUrlElement, summaryDateElement;
    var getReport = function () {
        atomic('http://localhost:3000/reports/report-corteconstitucional-gov-co.json', { responseType: 'json' })
            .then((function (response) {
                report = response.data;
                //console.log('success report', report); // xhr.responseText
                processReport(report);
                return report;
            }))
            .catch((function (error) {
                console.error('error code', error.status); // xhr.status
                console.error('error description', error.statusText); // xhr.statusText
            }));
    };
    var processReport = function (report) {
        var rules = report.rules;
        // Loop through each of the comments and add them to the comments list.
        summaryUrlElement.innerHTML = '<b>URL:</b>' + report.meta.entityUrl;
        var summaryDate = report.meta.lastEvaluationDate;
        summaryDate = summaryDate.replace( 'T', ' - ');
        summaryDate = summaryDate.substring(0 , summaryDate.length - 6);
        summaryDateElement.innerHTML = '<b>Fecha de Evaluación:</b>' + summaryDate;
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            var grade = rule.grade;
            var gradePoints = '0';
            var tmpl = document.getElementById('template-resultados-criteria').content.cloneNode(true);
            var gradeMeter = tmpl.querySelector('.resultados-criteria-grado meter');
            var gradeLabel = tmpl.querySelector('.resultados-criteria-grado label');
            if ('AAA' === grade) {
                gradePoints = 100;
            } else if ('AA' === grade) {
                gradePoints = 50;
            } else if ('A' === grade) {
                gradePoints = 20;
            }
            tmpl.querySelector('summary').innerText = rule.title;
            tmpl.querySelector('details p').innerHTML = '<p>' + rule.shortDescription + ' <a href="#" class="more-link">Más Informaciones.</a></p>';
            tmpl.querySelector('td.resultados-criteria-tipo').innerText = rule.type;
            gradeLabel.innerText = grade;
            gradeMeter.setAttribute('value', gradePoints);
            gradeMeter.innerText = gradePoints;
            container.appendChild(tmpl);
        }
    };
    container = document.querySelector('.obligaciones-legales.insatisfactorias');
    form = document.getElementById('evalue-form');
    input = document.getElementById('evalue-url');
    summaryUrlElement = document.getElementById('resultados-sumario-url');
    summaryDateElement = document.getElementById('resultados-sumario-fecha');

    //
    // Methods
    //

    /**
     * Handle submit events
     */
    var submitHandler = function (event) {
        event.preventDefault();
        if ( form === event.target) {
            getReport();
        }
    };
    // Create a submit handler
    document.addEventListener('submit', submitHandler, false);

})(window, document);
