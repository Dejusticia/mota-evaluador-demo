import { MDCTextField } from '@material/textfield';
import * as atomic from 'atomicjs';
import DOMPurify from 'dompurify';
import {
    sanitizeHTML,
    log,
    parseUri,
    templatePolyfill,
    arrayForEach,
    nodeListForEach,
    deepAssign
} from './modules/mota-utilities/index.js';
import {
    motaResultsAutoSuggest
} from './modules/results-auto-suggest/index.js';
templatePolyfill(document);
arrayForEach();
nodeListForEach();
const environment = 'production';
const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
let domains = motaResultsAutoSuggest;
var my_autoComplete = new autoComplete({
    selector: '#evaluate-url',
    minChars: 2,
    source: function (term, suggest) {
        term = term.toLowerCase();
        var choices = domains;
        var matches = [];
        for (var i = 0; i < choices.length; i++)
            if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
        suggest(matches);
    }
});
var reportsRepositoryURI = 'https://api.mota.dejusticia.org/v1/reports/';
if ( 'development' === environment){
    reportsRepositoryURI = './reports/';
} else if( 'local' === environment ){
    reportsRepositoryURI = 'http://localhost:3000/v1/reports/'
} else if( 'fallback' === environment ){
    reportsRepositoryURI = 'https://dejusticia.github.io/mota-reports/'
}
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
    var form, input, report, resultsDialogElement, summaryElement, summaryErrorElement, summaryGeneralGradeElement, summaryGeneralGradeLabel, summaryUrlElement, summaryDate, summaryDateElement;
    var containers = {
        notCompliant: {
            selector: '',
            node: '',
            state: 'waiting', // states: waiting, empty, noResults, hasResults
            criteriaNumber: 0
        },
        unsufficient:  {
            selector: '',
            node: '',
            state: 'waiting', // states: waiting, empty, noResults, hasResults
            criteriaNumber: 0
        },
        partialCompliant:  {
            selector: '',
            node: '',
            state: 'waiting', // states: waiting, empty, noResults, hasResults
            criteriaNumber: 0
        },
        compliant:  {
            selector: '',
            node: '',
            state: 'waiting', // states: waiting, empty, noResults, hasResults
            criteriaNumber: 0
        }
    };

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
        if ( null === urlParameters.host.match(/\S+\.(gov|mil)\.co$/)) {
            summaryErrorElement.classList.remove('inactive');
            resultsDialogElement.innerHTML =  DOMPurify.sanitize(`<b>Procesado</b> con error!`);
            summaryErrorElement.innerHTML =  DOMPurify.sanitize(`<p>El enlace que buscó no es válido!</p><p>Por favor, use una URL .gov.co o mil.co de um sítio web activo.</p>`);
            throw new Error('This URI is invalid');
        }
        basename = urlParameters.host.replace(/^www\./g, '');
        basename = basename.replace(/\./g, '-');
        domainInfo = {
            host: urlParameters.host,
            basename: basename,
            reportBasename: 'report-' + basename,
        };
        return domainInfo;
    };

    /**
     * Checks criteria containers states
     * @return {object} report object on success, error object on error.
     */
    var checkContainersStates = function () {
        /*notCompliant: 'waiting', // states: waiting, empty, noResults, hasResults
        unsufficient: 'waiting',
        partialCompliant: 'waiting',
        compliant: 'waiting'*/
        var criteriaNumber = 0;
        for (var key of Object.keys(containers)) {
            criteriaNumber = containers[key].node.querySelectorAll('.results-criteria').length;
            if( criteriaNumber >= 0 ) {
                containers[key].state = 'hasResults';
            }
        }
    };

    /**
     * Retrieves transparency report data from a given url.
     * @requires Atomic by Chris Ferdinandi. See <https://github.com/cferdinandi/atomic/>
     * @param  {string}  url  the url for retrieving the data from.
     * @return {object} report object on success, error object on error.
     */
    var getReport = function (url) {
        var compliantNumber = 0,partialComplianNumber = 0,unsufficientNumber = 0, notCompliantNumber, reportURI = reportsRepositoryURI + encodeURI(url);
            /*notCompliantNumber++;
            unsufficientNumber++
            unsufficientNumber++;
            partialCompliantNumber++;
            compliantNumber++;
            compliantNumber++;*/
         containers.compliant.node.innerHTML =  DOMPurify.sanitize(`<p>Aquí se mostrarán los criterios individuales calificados como en <code>conformidad</code>.</p>`);
         containers.partialCompliant.node.innerHTML =  DOMPurify.sanitize(`<p>Aquí se mostrarán los criterios individuales calificados como <code>conformidad parcial</code>.</p>`);
         containers.unsufficient.node.innerHTML =  DOMPurify.sanitize(`<p>Aquí se mostrarán los criterios individuales calificados como <code>insuficiente</code>.</p>`);
        containers.notCompliant.node.innerHTML =  DOMPurify.sanitize(`<p>Aquí se mostrarán los criterios individuales calificados como en <code> no conformidad</code>.</p>`);
        summaryElement.classList.add('inactive');
        resultsDialogElement.innerHTML = DOMPurify.sanitize(`<b>Procesando</b>: Los resultados se mostrarán aquí.`);
        var urlObject = getValidDomainInfo(url);
        // cleanup results containers and site info

        if ( 'development' === environment || 'fallback' === environment ){
            reportURI = reportsRepositoryURI + urlObject.reportBasename + '.json';
        }

        // fetch a report from the report repository
        atomic( reportURI ) //
            .then(function (response) {
                report = response.data;
                if (!response.data.error) {
                    processReport(report);
                } else {
                    processReportError(response.data.error);
                }
                return;
            })
            .catch(function (error) {
                apiError();
            });
    };

    /**
     * Add a result markup to one of the results container in main page.
     * @param  {string}  markup  The result markup.
     * @param  {object}  rule    The rule object.
     */
    var addResult = function (markup, rule) {
            if (rule.gradePoints >= 81) {
                containers.compliant.node.prepend(markup);
            } else if (rule.gradePoints >= 51) {
                containers.partialCompliant.node.prepend(markup);
            } else if (rule.gradePoints >= 21) {
                containers.unsufficient.node.prepend(markup);
            } else if (rule.gradePoints >= 1) {
                containers.unsufficient.node.prepend(markup);
                //obligationsDeficientContainer.prepend(markup);
            } else {
                containers.notCompliant.node.prepend(markup);
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
        var detailsElement = markup.querySelector('.results-criteria');
        var ruleTypeName = 'obligación';
        if ( 'recommendation' ===  rule.type ){
            ruleTypeName = 'recomendación';
        }
        markup.querySelector('.results-criteria h3').innerHTML = DOMPurify.sanitize(`${rule.title}<span class= "results-criteria--tags"> <span id="grade-${rule.ruleId}" class="faux-meter" data-gradePoints="${rule.gradePoints}">Grado: ${rule.grade}</span><span class= "results-criteria-type results-criteria-type--${rule.type}">Tipo: ${ruleTypeName}</span></span>`);
        markup.querySelector('.results-criteria--description').innerHTML = DOMPurify.sanitize(`${rule.shortDescription} <a href="criteria.html#criteria-${rule.ruleId}" class="more-link">Más información.</a>`);
        detailsElement.setAttribute('id', DOMPurify.sanitize(`criteria-${ruleId}`) );
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
        if (generalGrade < 1) {
            generalGradeText = DOMPurify.sanitize( `no conformidad (${generalGrade})` );
        } else if (generalGrade <= 20) {
            generalGradeText = DOMPurify.sanitize( `deficiente (${generalGrade})`);
        } else if (generalGrade <= 50) {
            generalGradeText = DOMPurify.sanitize( `Insuficiente (${generalGrade})`);
        } else if (generalGrade <= 80) {
            generalGradeText = DOMPurify.sanitize( `conformidad parcial (${generalGrade})`);
        } else if (generalGrade < 100) {
            generalGradeText = DOMPurify.sanitize(`conformidad (${generalGrade})`);
        } else {
            generalGradeText = DOMPurify.sanitize( `perfecto! (${generalGrade})`);
        }
        summaryGeneralGradeElement.value = generalGrade;
        summaryGeneralGradeLabel.innerHTML = DOMPurify.sanitize(generalGradeText);
        if (report.meta.evaluationStatus && 'analyzing' === report.meta.evaluationStatus) {
            resultsDialogElement.innerHTML = DOMPurify.sanitize(`Encontramos una <b>evaluación desactualizada.</b> Añadimos el sitio a la cola para actualización. Por favor regrese en unas horas.`);
        } else {
            resultsDialogElement.innerHTML = DOMPurify.sanitize('<b>Encontramos una evaluación.</b> El puntaje obtenido fue:');
        }
        summaryElement.classList.remove('inactive');
        summaryUrlElement.innerText = report.meta.entityUrl;
        summaryDateElement.innerText = transformDate(report.meta.lastEvaluationDate);

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

        containers.notCompliant.node = document.querySelector('.legal-obligations.not-compliant .results-content');
        //obligationsDeficientContainer = document.querySelector('.legal-obligations.deficient .results-content');
        containers.unsufficient.node  = document.querySelector('.legal-obligations.unsufficient .results-content');
        containers.partialCompliant.node  = document.querySelector('.legal-obligations.partial-compliant .results-content');
        containers.compliant.node  = document.querySelector('.legal-obligations.compliant .results-content');
        form = document.getElementById('evaluate-form');
        input = document.getElementById('evaluate-url');
        resultsDialogElement = document.querySelector('.results-dialog');
        summaryElement = document.getElementById('results-summary');
        summaryErrorElement = document.getElementById('results-summary-error');
        summaryGeneralGradeElement = document.getElementById('results-grade-final');
        summaryGeneralGradeLabel = document.querySelector('label[for="results-grade-final"]');
        summaryUrlElement = document.querySelector('#results-summary-url span');
        summaryDateElement = document.querySelector('#results-summary-date span');
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

        containers.compliant.node.innerHTML = '';
        containers.partialCompliant.node.innerHTML = '';
        containers.unsufficient.node.innerHTML = '';
        containers.notCompliant.node.innerHTML = '';

        for (var i = 0; i < rules.length; i++) {

            var rule = rules[i];
            var grade = rule.grade;
            var gradePoints = '0';
            if (0 === i) {
                generalGrade = +rule.gradePoints;
            } else {
                rule.gradePoints = +rule.gradePoints;
                generalGrade = generalGrade + rule.gradePoints;
            }
            var markup = document.getElementById('template-results-criteria').content.cloneNode(true);
            markup = processResultMarkup(markup, rule);
            addResult(markup, rule);
        }
        generalGrade = Math.floor(generalGrade / rules.length);
        checkContainersStates();
        if ('hasResults' !== containers.compliant.state ) {
            containers.compliant.node.innerHTML =  DOMPurify.sanitize('<p>Ninguno de los criterios individuales fue calificado como en <code>conformidad</code>.</p>');
        }
        if ('hasResults' !== containers.partialCompliant.state) {
            containers.partialCompliant.node.innerHTML =  DOMPurify.sanitize('<p>Ninguno de los criterios individuales fue calificado como en <code>conformidad parcial</code>.</p>');
        }
        if ('hasResults' !== containers.unsufficient.state) {
            containers.unsufficient.node.innerHTML =  DOMPurify.sanitize('<p>Ninguno de los criterios individuales fue calificado como en <code>insuficiente</code>.</p>');
        }
        if ('hasResults' !== containers.notCompliant.state) {
            containers.notCompliant.node.innerHTML =  DOMPurify.sanitize('<p>Ninguno de los criterios individuales fue calificado como en <code>no conformidad</code>.</p>');
        }
        processSummaryMarkup(generalGrade, report);

    };

    /**
     * Process report error and show results to the main content area.
     */
    var processReportError = function (error, urlObject) {
            summaryErrorElement.classList.remove('inactive');
            resultsDialogElement.innerHTML =  DOMPurify.sanitize(`<b>Procesado</b> con error!`);
            summaryErrorElement.innerHTML =  DOMPurify.sanitize(`<p>${sanitizeHTML(error.message)}</p>`);
            return;
    }

    /**
     * show an error message when API is unavailable.
     */
    var apiError = function (error, urlObject) {
            summaryErrorElement.classList.remove('inactive');
            resultsDialogElement.innerHTML =  DOMPurify.sanitize(`<b>Procesado</b> con error!`);
            summaryErrorElement.innerHTML =  DOMPurify.sanitize(`<p>Lamentablemente, no pudimos acceder a nuestra base de datos de informes. Por favor, intente nuevamente más tarde mientras verificamos qué está sucediendo y lo arreglamos.</p>`);
            return;
    }



    /**
     * Handle all document submit events.
     * @param  {object}  event   The event object.
     */
    var submitHandler = function (event) {
        event.preventDefault();
        if (form === event.target) {
            getReport(sanitizeHTML(input.value));
        }
    };

    getDomElements();
    // Create a submit event listener
    document.addEventListener('submit', submitHandler, false);

}));
