import { MDCTextField } from '@material/textfield';
import * as atomic from 'atomicjs';
import {
    sanitizeHTML,
    log,
    parseUri,
    templatePolyfill,
    arrayForEach,
    nodeListForEach,
    deepAssign
} from './modules/mota-utilities/index.js';
templatePolyfill(document);
arrayForEach();
nodeListForEach();

const textField = new MDCTextField(document.querySelector('.mdc-text-field'));

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

    var obligationsNotCompliantContainer, obligationsDeficientContainer, obligationsUnsufficientContainer, obligationsPartialCompliantContainer, obligationsCompliantContainer, resultsContainers, generalGrade = 0;
    var form, input, report, resultsDialogElement, summaryElement, summaryErrorElement, summaryGeneralGradeElement, summaryGeneralGradeLabel, summaryUrlElement, summaryDateElement, summaryStatusElement;

    //
    // Methods
    //

    /**
     * Parse URL, validate it and return domain info.
     *
     * @description Checks if URI is from a .gov.co site and return an array with (sub)domain, basename
     *              for files, report file names and other info.
     * @requires parseUri by Steven Levithan. @see <stevenlevithan.com>
     * @param  {string}  url  the url for retrieving the domain info.
     * @return {object}  domainInfo  Domain info.
     */
    var getValidDomainInfo = function (url) {
        var domainInfo, basename, urlParameters = parseUri(sanitizeHTML(String(url)));
        if ( null === urlParameters.host.match(/\w\.gov\.co$/)) {
            summaryErrorElement.classList.remove('inactive');
            resultsDialogElement.innerHTML = '<b>Procesado</b> con error!';
            summaryErrorElement.innerHTML = '<p>El enlace que buscó no es válido!</p><p>Por favor, use una URL .gov.co de um sítio web existente.</p>';
            throw new Error('This URI is invalid');
        }
        basename = urlParameters.host.replace(/\./g, '-');
        domainInfo = {
            host: urlParameters.host,
            basename: basename,
            reportBasename: 'report-' + basename,
        };
        return domainInfo;
    };

    /**
     * Retrieves transparency report data from a given url.
     * @requires Atomic by Chris Ferdinandi. See <https://github.com/cferdinandi/atomic/>
     * @param  {string}  url  the url for retrieving the data from.
     * @return {object} report object on success, error object on error.
     */
    var getReport = function (url) {
        summaryElement.classList.add('inactive');
        resultsDialogElement.innerHTML = '<b>Procesando</b>: Los resultados se mostrarán aquí.';
        var urlObject = getValidDomainInfo(url);
        // cleanup results containers and site info
        resultsContainers.forEach(function (elem, index) {
            elem.innerHTML = '<div role="progressbar" class="mdc-linear-progress mdc-linear-progress--indeterminate"><div class="mdc-linear-progress__buffering-dots"></div><div class="mdc-linear-progress__buffer"></div><div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar"><span class="mdc-linear-progress__bar-inner"></span></div><div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar"><span class="mdc-linear-progress__bar-inner"></span></div></div>';
        });

        // fetch a report from the report repository
        atomic('https://dejusticia.github.io/mota-reports/' + urlObject.reportBasename + '.json') //
            .then(function (response) {
                report = response.data;
                processReport(report);
                return report;
            })
            .catch(function (error) {
                console.log('error:');
                console.log(error);
                processReportError(error);
            });
    };

    /**
     * Add a result markup to one of the results container in main page.
     * @param  {string}  markup  The result markup.
     * @param  {object}  rule    The rule object.
     */
    var addResult = function (markup, rule) {
            if (rule.gradePoints >= 81) {
                obligationsCompliantContainer.prepend(markup);
            } else if (rule.gradePoints >= 51) {
                obligationsPartialCompliantContainer.prepend(markup);
            } else if (rule.gradePoints >= 21) {
                obligationsUnsufficientContainer.prepend(markup);
            } else if (rule.gradePoints >= 1) {
                obligationsDeficientContainer.prepend(markup);
            } else {
                obligationsNotCompliantContainer.prepend(markup);
            }

    };
    /**
     * Process a result template markup.
     * @param  {string}  markup    The result template markup.
     * @param  {object}  rule     The rule object.
     * @param  {string}  markup    The processed result markup.
     */
    var processResultMarkup = function (markup, rule) {
        var ruleId = rule.ruleId;
        var gradeMeter = markup.querySelector('.results-criteria-grade meter');
        var gradeLabel = markup.querySelector('.results-criteria-grade label');
        var detailsElement = markup.querySelector('.results-criteria');
        markup.querySelector('summary').innerText = rule.title;
        markup.querySelector('details p').innerHTML = rule.shortDescription + ' <a href="' + rule.ruleSpecificationUrl + '" class="more-link" target="mota-specs">Más Informaciones.</a>';
        detailsElement.setAttribute('id', 'criteria-' + ruleId);
        gradeLabel.innerText = rule.grade;
        gradeLabel.setAttribute('for', 'grade-' + ruleId);
        gradeMeter.setAttribute('value', rule.gradePoints);
        gradeMeter.setAttribute('id', 'grade-' + ruleId);
        gradeMeter.setAttribute('name', 'grade-' + ruleId);
        gradeMeter.innerText = rule.gradePoints;
        return markup;
    };

    /**
     * Process a result template markup.
     * @param  {number}  generalGrade    The general grade for this report.
     */
    var processSummaryMarkup = function (generalGrade, report) {
        var generalGradeText = '';

        // coerce to number
        generalGrade = +generalGrade;
        if (generalGrade < 20) {
            generalGradeText = 'Deficiente (' + generalGrade + ')';
        } else if (generalGrade < 50) {
            generalGradeText = 'Insuficiente (' + generalGrade + ')';
        } else if (generalGrade < 90) {
            generalGradeText = ' Parcial, debe mejorar (' + generalGrade + ')';
        } else if (generalGrade < 100) {
            generalGradeText = 'Bien (' + generalGrade + ')';
        } else {
            generalGradeText = 'Perfecto! (' + generalGrade + ')';
        }
        summaryGeneralGradeElement.value = generalGrade;
        summaryGeneralGradeLabel.innerHTML = generalGradeText;
        if (report.meta.evaluationStatus && 'updating' === report.meta.evaluationStatus) {
            resultsDialogElement.innerHTML = '<b>Procesando</b>.';
        } else {
            resultsDialogElement.innerHTML = '<b>Procesado</b> con éxito!';
        }
        summaryElement.classList.remove('inactive');

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
        obligationsNotCompliantContainer = document.querySelector('.legal-obligations.not-compliant .results-content');
        obligationsDeficientContainer = document.querySelector('.legal-obligations.deficient .results-content');
        obligationsUnsufficientContainer = document.querySelector('.legal-obligations.unsufficient .results-content');
        obligationsPartialCompliantContainer = document.querySelector('.legal-obligations.partial-compliant .results-content');
        obligationsCompliantContainer = document.querySelector('.legal-obligations.compliant .results-content');
        form = document.getElementById('evaluate-form');
        input = document.getElementById('evaluate-url');
        resultsDialogElement = document.querySelector('.results-dialog');
        summaryElement = document.getElementById('results-summary');
        summaryErrorElement = document.getElementById('results-summary-error');
        summaryGeneralGradeElement = document.getElementById('results-grade-final');
        summaryGeneralGradeLabel = document.querySelector('label[for="results-grade-final"]');
        summaryUrlElement = document.querySelector('#results-summary-url span');
        summaryDateElement = document.querySelector('#results-summary-date span');
        summaryStatusElement = document.querySelector('#results-summary-status span');
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

        summaryErrorElement.classList.add('inactive');
        summaryElement.classList.add('inactive');
        summaryUrlElement.innerHTML = '';
        summaryDateElement.innerHTML = '';
        summaryStatusElement.innerHTML = '';

        for (var i = 0; i < rules.length; i++) {

            var rule = rules[i];
            var grade = rule.grade;
            var gradePoints = '0';
            if (0 === i) {
                generalGrade = +rule.gradePoints;
            } else {
                rule.gradePoints = +rule.gradePoints
                generalGrade = generalGrade + rule.gradePoints;
            }
            var markup = document.getElementById('template-results-criteria').content.cloneNode(true);
            markup = processResultMarkup(markup, rule);
            addResult(markup, rule);
        }
        console.log('generalGrade brute');
        console.log(generalGrade);
        generalGrade = Math.floor(generalGrade / rules.length);
        console.log('generalGrade Normalized');
        console.log(generalGrade);
        processSummaryMarkup(generalGrade, report);
        summaryUrlElement.innerText = report.meta.entityUrl;
        summaryDateElement.innerText = transformDate(summaryDate);
        if (report.meta.evaluationStatus && 'updating' === report.meta.evaluationStatus ) {
            summaryStatusElement.innerText =  'actualización Por favor regrese en unas horas.';
        } else {
            summaryStatusElement.innerText = 'completada';
        }
    };

    /**
     * Process report report error and show results to the main content area.
     */
    var processReportError = function (error) {
        // error.status//summaryElement
        summaryErrorElement.classList.remove('inactive');
        resultsDialogElement.innerHTML = '<b>Procesado</b> con error!';
        summaryErrorElement.innerHTML = '<p>No se encontró el informe para esta evaluación. Estamos agregando a nuestra cola de evaluación y, si existe el sitio, tendremos la evaluación en unas pocas horas.</p>';
        console.error('error code', error.status); // xhr.status
        console.error('error description', error.statusText); // xhr.statusText
        throw new Error('This request returned an error with the code:' + "\n" + error.status);
    }


    /**
     * Handle all document submit events.
     * @param  {object}  event   The event object.
     */
    var submitHandler = function (event) {
        event.preventDefault();
        if (form === event.target) {
            console.log(input.value);
            getReport(input.value);
        }
    };

    getDomElements();
    // Create a submit event listener
    document.addEventListener('submit', submitHandler, false);

}));
