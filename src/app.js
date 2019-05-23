/*  Don't forget to load utilities.js first */
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
    * @uses Atomic by Chris Ferdinandi. See <https://github.com/cferdinandi/atomic/>
    * @param  {String}  url      The url for retrieving the data from.
    * @param  {Object}  options  An object holding options for this
    * @return {mixed}  a report on
    */
    var getReport = function ( url ) {

        atomic( url, { responseType: 'json' } )
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

    /**
    * Process report JSON populate reports areas with results markup based on a template.
    * @uses getReport method {@link #getReport}
    * @param     {Object}    report    A JSON file with a report.
    */
    var processReport = function (report) {

        //
        // Variables
        //
        var rules = report.rules;
        var summaryDate = report.meta.lastEvaluationDate;

        //
        // Methods
        //

        /**
        * Add the resulting markup to the proper container on the page.
        * @param  {String}   resultTemplate  The markup for a criteria evaluation result instance.
        * @param  {String}   grade           The grade for a criteria evaluation result instance.
        * @param  {String}   ruleType        The type of the rule (obligation or recommendation) for a criteria evaluation result instance.
        */
        var addResult = function (resultTemplate, grade, ruleType) {
            if ('recommendation' === ruleType) {
                switch (grade) {
                    case 'AAA':
                        obligationsSatisfactoryContainer.appendChild(resultTemplate);
                        break;
                    case 'AA':
                        obligationsPartialContainer.appendChild(resultTemplate);
                        break;
                    default:
                        obligationsUnsatisfactoryContainer.appendChild(resultTemplate);
                }
            } else {
                switch (grade) {
                    case 'AAA':
                        recommendationsSatisfactoryContainer.appendChild(resultTemplate);
                        break;
                    case 'AA':
                        recommendationsPartialContainer.appendChild(resultTemplate);
                        break;
                    default:
                        recommendationsUnsatisfactoryContainer.appendChild(resultTemplate);
                }
            }

        };
        summaryUrlElement.innerHTML = '<b>URL:</b>' + report.meta.entityUrl;
        summaryDate = summaryDate.replace('T', ' - ');
        summaryDate = summaryDate.substring(0, summaryDate.length - 6);
        summaryDateElement.innerHTML = '<b>Fecha de Evaluación:</b>' + summaryDate;
        for (var i = 0; i < rules.length; i++) {
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
            addResult(resultTemplate, grade, ruleType);
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
            getReport( 'http://localhost:3000/reports/report-corteconstitucional-gov-co.json' );
        }
    };
    // Create a submit handler
    document.addEventListener('submit', submitHandler, false);

}));
