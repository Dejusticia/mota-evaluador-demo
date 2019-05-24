/*!
 * mota-evaluador v0.1.0
 * Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA
 * (c) 2019 
 * MIT License
 * https://github.com/Dejusticia/mota-evaluador-publico
 */

/*  Don't forget to load utilities.js first */
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

    var obligationsUnsatisfactoryContainer, obligationsPartialContainer, obligationsSatisfactoryContainer, recommendationsUnsatisfactoryContainer, recommendationsPartialContainer, recommendationsSatisfactoryContainer, resultsContainers;
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
    * @param  {string}  markup  The result markup.
    * @param  {object}  rule    The rule object.
    */
    var addResult = function (markup, rule) {
        if ('recommendation' === rule.type) {
            switch (rule.grade) {
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
            switch (rule.grade) {
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
    * Process a result template markup.
    * @param  {string}  markup    The result template markup.
    * @param  {object}  rule     The rule object.
    * @param  {string}  markup    The processed result markup.
    */
    var processMarkup = function (markup, rule) {
        var ruleId = rule.ruleId;
        var gradeMeter = markup.querySelector('.results-criteria-grade meter');
        var gradeLabel = markup.querySelector('.results-criteria-grade label');
        var detailsElement = markup.querySelector('.results-criteria');
        markup.querySelector('summary').innerText = rule.title;
        markup.querySelector('details p').innerHTML = '<p>' + rule.shortDescription + ' <a href="#" class="more-link">Más Informaciones.</a></p>';
        detailsElement.setAttribute('id', 'criteria-' + ruleId);
        gradeLabel.innerText = rule.grade;
        gradeLabel.setAttribute('for', 'grade-' + ruleId);
        gradeMeter.setAttribute('value', rule.gradePoints);
        gradeMeter.setAttribute('id', 'grade-' + ruleId);
        gradeMeter.setAttribute('name', 'grade-' + ruleId);
        gradeMeter.innerText =rule.gradePoints;
        return markup;
    };

    /**
    * Transforms an ISO formatted date in a more human friendly date.
    * @param  {string}  date   An ISO formatted date string.
    * @return  {return}  date   An more human friendly date string.
    */
    var transformDate = function (date) {
        date = date.replace('T', ' - ');
        date = date.substring(0, date.length - 6);
        return date;
    };

    /**
    * Get all document DOM elements we will need to manipulate
    */
    var getDomElements = function () {
        obligationsUnsatisfactoryContainer = document.querySelector('.legal-obligations.unsatisfactory .results-content');
        obligationsPartialContainer = document.querySelector('.legal-obligations.partial .results-content');
        obligationsSatisfactoryContainer = document.querySelector('.legal-obligations.satisfactory .results-content');
        recommendationsUnsatisfactoryContainer = document.querySelector('.recommendations.unsatisfactory .results-content');
        recommendationsPartialContainer = document.querySelector('.recommendations.partial .results-content');
        recommendationsSatisfactoryContainer = document.querySelector('.recommendations.satisfactory .results-content');
        form = document.getElementById('evaluate-form');
        input = document.getElementById('evaluate-url');
        summaryUrlElement = document.getElementById('results-summary-url');
        summaryDateElement = document.getElementById('results-summary-date');
        resultsContainers = document.querySelectorAll('.results-content');
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

        // cleanup results containers and site info
        resultsContainers.forEach((function (elem, index) {
            elem.innerHTML = '<div role="progressbar" class="mdc-linear-progress mdc-linear-progress--indeterminate"><div class="mdc-linear-progress__buffering-dots"></div><div class="mdc-linear-progress__buffer"></div><div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar"><span class="mdc-linear-progress__bar-inner"></span></div><div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar"><span class="mdc-linear-progress__bar-inner"></span></div></div>';
        }));

        summaryUrlElement.innerHTML = '';
        summaryDateElement.innerHTML = '';

        for (var i = 0; i < rules.length; i++) {

            var rule = rules[i];
            var grade = rule.grade;
            var gradePoints = '0';
            var markup = document.getElementById('template-results-criteria').content.cloneNode(true);
            markup = processMarkup(markup, rule);
            addResult(markup, rule);
        }

        summaryUrlElement.innerHTML = '<b>URL:</b>' + report.meta.entityUrl;
        summaryDateElement.innerHTML = '<b>Fecha de Evaluación:</b>' + transformDate(summaryDate);
    };


    /**
    * Handle all document submit events.
    * @param  {object}  event   The event object.
    */
    var submitHandler = function (event) {
        event.preventDefault();
        if (form === event.target) {
            getReport();
        }
    };

    getDomElements();
    // Create a submit event listener
    document.addEventListener('submit', submitHandler, false);

}));
