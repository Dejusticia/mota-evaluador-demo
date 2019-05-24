/*!
 * mota-evaluador v0.1.0
 * Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA
 * (c) 2019 
 * MIT License
 * https://github.com/Dejusticia/mota-evaluador-publico
 */

/*  TODO: Test on IE */
/**
* HTML5 template element Polyfill by Brian Blakely. See <https://jsfiddle.net/brianblakely/h3EmY/>
* @param  {object}  d  The document.
*/
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
/*  TODO: Test on IE */
/**
* HTML5 template element Polyfill by Brian Blakely. See <https://jsfiddle.net/brianblakely/h3EmY/>
* @param  {object}  d  The document.
*/

/*!
 * Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA 0.2.0
 * Evaluates governmental websites compliances to legal obligations and best practices.
 * (c) 2019 Celso Bessa
 * MIT License
 * https://github.com/Dejusticia/mota-evaluador-publico
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], (function () {
            return factory(root);
        }));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.Gumshoe = factory(root);
    }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, (function (window) {
    'use strict';

    //
    // Variables
    //

    var obligationsUnsatisfactoryContainer, obligationsPartialContainer, obligationsSatisfactoryContainer, recommendationsUnsatisfactoryContainer, recommendationsPartialContainer, recommendationsSatisfactoryContainer;
    var form, input, report, summaryUrlElement, summaryDateElement;

    //
    // Methods
    //

    /**
    * Retrieves transparency report data from a given url.
    * @requires Atomic by Chris Ferdinandi. See <https://github.com/cferdinandi/atomic/>
    * @param  {string}  url  the url for retrieving the data from.
    */
    var getReport = function ( url) {
        atomic('http://localhost:3000/reports/report-corteconstitucional-gov-co.json', { responseType: 'json'})
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

    /**
    * Add a result markup to one of the results container in main page.
    * @param  {string}  markup    The result markup.
    * @param  {string}  grade     The grade received by the related evaluation.
    * @param  {string}  ruleType  The type of the criteria (obligation or recommendation).
    */
    var addResult = function (markup, grade, ruleType) {
        if ('recommendation' === ruleType) {
            switch (grade) {
                case 'AAA':
                    obligationsSatisfactoryContainer.appendChild(markup);
                    break;
                case 'AA':
                    obligationsPartialContainer.appendChild(markup);
                    break;
                default:
                    obligationsUnsatisfactoryContainer.appendChild(markup);
            }
        } else {
            switch (grade) {
                case 'AAA':
                    recommendationsSatisfactoryContainer.appendChild(markup);
                    break;
                case 'AA':
                    recommendationsPartialContainer.appendChild(markup);
                    break;
                default:
                    recommendationsUnsatisfactoryContainer.appendChild(markup);
            }
        }

    };

    /**
    * Process report JSON and add results to the main content area.
    * @requires getReport
    * @requires addResult
    * @param  {string}  report   A JSON object with the evaluation report.
    */
    var processReport = function (report) {

        //
        // Variables
        //
        var rules = report.rules;
        var summaryDate = report.meta.lastEvaluationDate;

        // TODO: cleanup results containers and site info
        // TODO: add loading spinners or similar feature while is evaluating.

        for (var i = 0; i < rules.length; i++) {

            // TODO: Encapsulate as method. START
            var rule = rules[i];
            var ruleId = rule.rule;
            var ruleType = rule.type;
            var grade = rule.grade;
            var gradePoints = '0';
            var resultTemplate = document.getElementById('template-results-criteria').content.cloneNode(true);
            var gradeMeter = resultTemplate.querySelector('.results-criteria-grade meter');
            var gradeLabel = resultTemplate.querySelector('.results-criteria-grade label');
            var detailsElement = resultTemplate.querySelector('.results-criteria');
            if ('AAA' === grade) {
                gradePoints = 100;
            } else if ('AA' === grade) {
                gradePoints = 50;
            } else if ('A' === grade) {
                gradePoints = 20;
            }
            resultTemplate.querySelector('summary').innerText = rule.title;
            resultTemplate.querySelector('details p').innerHTML = '<p>' + rule.shortDescription + ' <a href="#" class="more-link">Más Informaciones.</a></p>';
            resultTemplate.querySelector('td.results-criteria-type').innerText = ruleType;
            detailsElement.setAttribute( 'id', 'criteria-' + ruleId)
            gradeLabel.innerText = grade;
            gradeLabel.setAttribute('for', 'grade-' + ruleId);
            gradeMeter.setAttribute('value', gradePoints);
            gradeMeter.setAttribute('id', 'grade-' + ruleId);
            gradeMeter.setAttribute('name', 'grade-' + ruleId);
            gradeMeter.innerText = gradePoints;
            // TODO: Encapsulate as method. FINISH

            summaryUrlElement.innerHTML = '<b>URL:</b>' + report.meta.entityUrl;

            //TODO: encapsulate as method: normalize date.
            summaryDate = summaryDate.replace('T', ' - ');
            summaryDate = summaryDate.substring(0, summaryDate.length - 6);
            summaryDateElement.innerHTML = '<b>Fecha de Evaluación:</b>' + summaryDate;

            addResult(resultTemplate, grade, ruleType);
        }
    };

    /**
     * Handle submit events
     */
    var submitHandler = function (event) {
        event.preventDefault();
        if (form === event.target) {
            getReport();
        }
    };

    // get all containers. TODO: maybe encapsulate as method
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

    // Create a submit event listener
    document.addEventListener('submit', submitHandler, false);

}));
