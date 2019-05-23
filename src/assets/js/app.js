/* HTML5 template element Polyfill. TODO: Test on IE */
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
    var obligationsUnsatisfactoryContainer, obligationsPartialContainer, obligationsSatisfactoryContainer, recommendationsUnsatisfactoryContainer, recommendationsPartialContainer, recommendationsSatisfactoryContainer;
    var form, input, report, summaryUrlElement, summaryDateElement;
    var getReport = function () {
        atomic('http://localhost:3000/reports/report-corteconstitucional-gov-co.json', { responseType: 'json' })
            .then(function (response) {
                report = response.data;
                //console.log('success report', report); // xhr.responseText
                processReport(report);
                return report;
            })
            .catch(function (error) {
                console.error('error code', error.status); // xhr.status
                console.error('error description', error.statusText); // xhr.statusText
            });
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
            var ruleId = rule.rule;
            var grade = rule.grade;
            var gradePoints = '0';
            var tmpl = document.getElementById('template-results-criteria').content.cloneNode(true);
            var gradeMeter = tmpl.querySelector('.results-criteria-grade meter');
            var gradeLabel = tmpl.querySelector('.results-criteria-grade label');
            var detailsElement = tmpl.querySelector('.results-criteria');
            if ('AAA' === grade) {
                gradePoints = 100;
            } else if ('AA' === grade) {
                gradePoints = 50;
            } else if ('A' === grade) {
                gradePoints = 20;
            }
            tmpl.querySelector('summary').innerText = rule.title;
            tmpl.querySelector('details p').innerHTML = '<p>' + rule.shortDescription + ' <a href="#" class="more-link">Más Informaciones.</a></p>';
            tmpl.querySelector('td.results-criteria-type').innerText = rule.type;
            detailsElement.setAttribute( 'id', 'criteria-' + ruleId)
            gradeLabel.innerText = grade;
            gradeLabel.setAttribute('for', 'grade-' + ruleId);
            gradeMeter.setAttribute('value', gradePoints);
            gradeMeter.setAttribute('id', 'grade-' + ruleId);
            gradeMeter.setAttribute('name', 'grade-' + ruleId);
            gradeMeter.innerText = gradePoints;
            if ( 'recommendation' === rule.type ){
                switch( grade ) {
                    case 'AAA':
                        obligationsSatisfactoryContainer.appendChild(tmpl);
                        break;
                    case 'AA':
                        obligationsPartialContainer.appendChild(tmpl);
                        break;
                    default:
                        obligationsUnsatisfactoryContainer.appendChild(tmpl);
                }
            } else {
                switch (grade) {
                    case 'AAA':
                        recommendationsSatisfactoryContainer.appendChild(tmpl);
                        break;
                    case 'AA':
                        recommendationsPartialContainer.appendChild(tmpl);
                        break;
                    default:
                        recommendationsUnsatisfactoryContainer.appendChild(tmpl);
                }
            }
        }
    };
    obligationsUnsatisfactoryContainer = document.querySelector('.legal-obligations.unsatisfactory');
    obligationsPartialContainer = document.querySelector('.legal-obligations.partial');
    obligationsSatisfactoryContainer = document.querySelector('.legal-obligations.satisfactory');
    recommendationsUnsatisfactoryContainer = document.querySelector('.recommendations.unsatisfactory');
    recommendationsPartialContainer = document.querySelector('.recommendations.partial');
    recommendationsSatisfactoryContainer = document.querySelector('.recommendations.satisfactory');
    form = document.getElementById('evaluate-form');
    input = document.getElementById('evaluate-url');
    summaryUrlElement = document.getElementById('results-summary-url');
    summaryDateElement = document.getElementById('results-summary-date');

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
