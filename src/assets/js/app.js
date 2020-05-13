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
const environment = 'production';
const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
let domains = [
    'ansv.gov.co',
    'apps.migracioncolombia.gov.co',
    'bogota.gov.co',
    'bomberos.mininterior.gov.co',
    'buscadordeempleo.gov.co',
    'centroderelevo.gov.co',
    'dapre.presidencia.gov.co',
    'derechodeautor.gov.co',
    'es.presidencia.gov.co',
    'finlandia.embajada.gov.co',
    'http://ansv.gov.co',
    'http://apps.migracioncolombia.gov.co',
    'http://bogota.gov.co',
    'http://bomberos.mininterior.gov.co',
    'http://buscadordeempleo.gov.co',
    'http://centroderelevo.gov.co',
    'http://dapre.presidencia.gov.co',
    'http://derechodeautor.gov.co',
    'http://es.presidencia.gov.co',
    'http://finlandia.embajada.gov.co',
    'http://id.presidencia.gov.co',
    'http://portal.gestiondelriesgo.gov.co',
    'http://portal.icetex.gov.co',
    'http://saludcapital.gov.co',
    'http://serviciodeempleo.gov.co',
    'http://telecafe.gov.co',
    'http://unidad.serviciodeempleo.gov.co',
    'http://ww1.upme.gov.co',
    'http://www.adr.gov.co',
    'http://www.adres.gov.co',
    'http://www.aerocivil.gov.co',
    'http://www.agenciadetierras.gov.co',
    'http://www.agenciavirgiliobarco.gov.co',
    'http://www.ane.gov.co',
    'http://www.anh.gov.co',
    'http://www.ani.gov.co',
    'http://www.anla.gov.co',
    'http://www.anm.gov.co',
    'http://www.ansv.gov.co',
    'http://www.apccolombia.gov.co',
    'http://www.apps.migracioncolombia.gov.co',
    'http://www.aunap.gov.co',
    'http://www.barranquilla.gov.co',
    'http://www.bogota.gov.co',
    'http://www.bomberos.mininterior.gov.co',
    'http://www.bucaramanga.gov.co',
    'http://www.buscadordeempleo.gov.co',
    'http://www.cali.gov.co',
    'http://www.cancilleria.gov.co',
    'http://www.caroycuervo.gov.co',
    'http://www.casur.gov.co',
    'http://www.centroderelevo.gov.co',
    'http://www.cnsc.gov.co',
    'http://www.colciencias.gov.co',
    'http://www.coldeportes.gov.co',
    'http://www.colombiacompra.gov.co',
    'http://www.colpensiones.gov.co',
    'http://www.consejosuperior.gov.co',
    'http://www.contaduria.gov.co',
    'http://www.contraloria.gov.co',
    'http://www.contratos.gov.co',
    'http://www.corteconstitucional.gov.co',
    'http://www.cortesuprema.gov.co',
    'http://www.cra.gov.co',
    'http://www.crcom.gov.co',
    'http://www.creg.gov.co',
    'http://www.dane.gov.co',
    'http://www.dapre.presidencia.gov.co',
    'http://www.datos.gov.co',
    'http://www.defensacivil.gov.co',
    'http://www.defensajuridica.gov.co',
    'http://www.defensoria.gov.co',
    'http://www.derechodeautor.gov.co',
    'http://www.dian.gov.co',
    'http://www.dni.gov.co',
    'http://www.dnp.gov.co',
    'http://www.dps.gov.co',
    'http://www.es.presidencia.gov.co',
    'http://www.finlandia.embajada.gov.co',
    'http://www.fiscalia.gov.co',
    'http://www.fna.gov.co',
    'http://www.funcionpublica.gov.co',
    'http://www.gov.co',
    'http://www.icetex.gov.co',
    'http://www.icfes.gov.co',
    'http://www.id.presidencia.gov.co',
    'http://www.indumil.gov.co',
    'http://www.inm.gov.co',
    'http://www.irc.gov.co',
    'http://www.itrc.gov.co',
    'http://www.jcc.gov.co',
    'http://www.medellin.gov.co',
    'http://www.migracioncolombia.gov.co',
    'http://www.minagricultura.gov.co',
    'http://www.minambiente.gov.co',
    'http://www.mincit.gov.co',
    'http://www.mincultura.gov.co',
    'http://www.mindefensa.gov.co',
    'http://www.mineducacion.gov.co',
    'http://www.minenergia.gov.co',
    'http://www.minhacienda.gov.co',
    'http://www.mininterior.gov.co',
    'http://www.minjusticia.gov.co',
    'http://www.minsalud.gov.co',
    'http://www.mintic.gov.co',
    'http://www.mintrabajo.gov.co',
    'http://www.mintransporte.gov.co',
    'http://www.minvivienda.gov.co',
    'http://www.orgsolidarias.gov.co',
    'http://www.paiweb.gov.co',
    'http://www.parquesnacionales.gov.co',
    'http://www.pereira.gov.co',
    'http://www.policia.gov.co',
    'http://www.portal.gestiondelriesgo.gov.co',
    'http://www.portal.icetex.gov.co',
    'http://www.positivaenlinea.gov.co',
    'http://www.procuraduria.gov.co',
    'http://www.prosperidadsocial.gov.co',
    'http://www.ramajudicial.gov.co',
    'http://www.registraduria.gov.co',
    'http://www.reincorporacion.gov.co',
    'http://www.renovacionterritorio.gov.co',
    'http://www.restituciondetierras.gov.co',
    'http://www.saludcapital.gov.co',
    'http://www.sedboyaca.gov.co',
    'http://www.serviciodeempleo.gov.co',
    'http://www.shd.gov.co',
    'http://www.sic.gov.co',
    'http://www.sisben.gov.co',
    'http://www.ssf.gov.co',
    'http://www.superfinanciera.gov.co',
    'http://www.supernotariado.gov.co',
    'http://www.supersalud.gov.co',
    'http://www.superservicios.gov.co',
    'http://www.supersociedades.gov.co',
    'http://www.supersolidaria.gov.co',
    'http://www.supertransporte.gov.co',
    'http://www.supervigilancia.gov.co',
    'http://www.telecafe.gov.co',
    'http://www.ugpp.gov.co',
    'http://www.uiaf.gov.co',
    'http://www.unidad.serviciodeempleo.gov.co',
    'http://www.unidadvictimas.gov.co',
    'http://www.unp.gov.co',
    'http://www.upra.gov.co',
    'http://www.urf.gov.co',
    'http://www.uspec.gov.co',
    'https://ansv.gov.co',
    'https://apps.migracioncolombia.gov.co',
    'https://bogota.gov.co',
    'https://bomberos.mininterior.gov.co',
    'https://buscadordeempleo.gov.co',
    'https://centroderelevo.gov.co',
    'https://dapre.presidencia.gov.co',
    'https://derechodeautor.gov.co',
    'https://es.presidencia.gov.co',
    'https://finlandia.embajada.gov.co',
    'https://id.presidencia.gov.co',
    'https://portal.gestiondelriesgo.gov.co',
    'https://portal.icetex.gov.co',
    'https://saludcapital.gov.co',
    'https://serviciodeempleo.gov.co',
    'https://telecafe.gov.co',
    'https://unidad.serviciodeempleo.gov.co',
    'https://ww1.upme.gov.co',
    'https://www.adr.gov.co',
    'https://www.adres.gov.co',
    'https://www.aerocivil.gov.co',
    'https://www.agenciadetierras.gov.co',
    'https://www.agenciavirgiliobarco.gov.co',
    'https://www.ane.gov.co',
    'https://www.anh.gov.co',
    'https://www.ani.gov.co',
    'https://www.anla.gov.co',
    'https://www.anm.gov.co',
    'https://www.ansv.gov.co',
    'https://www.apccolombia.gov.co',
    'https://www.apps.migracioncolombia.gov.co',
    'https://www.aunap.gov.co',
    'https://www.barranquilla.gov.co',
    'https://www.bogota.gov.co',
    'https://www.bomberos.mininterior.gov.co',
    'https://www.bucaramanga.gov.co',
    'https://www.buscadordeempleo.gov.co',
    'https://www.cali.gov.co',
    'https://www.cancilleria.gov.co',
    'https://www.caroycuervo.gov.co',
    'https://www.casur.gov.co',
    'https://www.centroderelevo.gov.co',
    'https://www.cnsc.gov.co',
    'https://www.colciencias.gov.co',
    'https://www.coldeportes.gov.co',
    'https://www.colombiacompra.gov.co',
    'https://www.colpensiones.gov.co',
    'https://www.consejosuperior.gov.co',
    'https://www.contaduria.gov.co',
    'https://www.contraloria.gov.co',
    'https://www.contratos.gov.co',
    'https://www.corteconstitucional.gov.co',
    'https://www.cortesuprema.gov.co',
    'https://www.cra.gov.co',
    'https://www.crcom.gov.co',
    'https://www.creg.gov.co',
    'https://www.dane.gov.co',
    'https://www.dapre.presidencia.gov.co',
    'https://www.datos.gov.co',
    'https://www.defensacivil.gov.co',
    'https://www.defensajuridica.gov.co',
    'https://www.defensoria.gov.co',
    'https://www.derechodeautor.gov.co',
    'https://www.dian.gov.co',
    'https://www.dni.gov.co',
    'https://www.dnp.gov.co',
    'https://www.dps.gov.co',
    'https://www.es.presidencia.gov.co',
    'https://www.finlandia.embajada.gov.co',
    'https://www.fiscalia.gov.co',
    'https://www.fna.gov.co',
    'https://www.funcionpublica.gov.co',
    'https://www.gov.co',
    'https://www.icetex.gov.co',
    'https://www.icfes.gov.co',
    'https://www.id.presidencia.gov.co',
    'https://www.indumil.gov.co',
    'https://www.inm.gov.co',
    'https://www.irc.gov.co',
    'https://www.itrc.gov.co',
    'https://www.jcc.gov.co',
    'https://www.medellin.gov.co',
    'https://www.migracioncolombia.gov.co',
    'https://www.minagricultura.gov.co',
    'https://www.minambiente.gov.co',
    'https://www.mincit.gov.co',
    'https://www.mincultura.gov.co',
    'https://www.mindefensa.gov.co',
    'https://www.mineducacion.gov.co',
    'https://www.minenergia.gov.co',
    'https://www.minhacienda.gov.co',
    'https://www.mininterior.gov.co',
    'https://www.minjusticia.gov.co',
    'https://www.minsalud.gov.co',
    'https://www.mintic.gov.co',
    'https://www.mintrabajo.gov.co',
    'https://www.mintransporte.gov.co',
    'https://www.minvivienda.gov.co',
    'https://www.orgsolidarias.gov.co',
    'https://www.paiweb.gov.co',
    'https://www.parquesnacionales.gov.co',
    'https://www.pereira.gov.co',
    'https://www.policia.gov.co',
    'https://www.portal.gestiondelriesgo.gov.co',
    'https://www.portal.icetex.gov.co',
    'https://www.positivaenlinea.gov.co',
    'https://www.procuraduria.gov.co',
    'https://www.prosperidadsocial.gov.co',
    'https://www.ramajudicial.gov.co',
    'https://www.registraduria.gov.co',
    'https://www.reincorporacion.gov.co',
    'https://www.renovacionterritorio.gov.co',
    'https://www.restituciondetierras.gov.co',
    'https://www.saludcapital.gov.co',
    'https://www.sedboyaca.gov.co',
    'https://www.serviciodeempleo.gov.co',
    'https://www.shd.gov.co',
    'https://www.sic.gov.co',
    'https://www.sisben.gov.co',
    'https://www.ssf.gov.co',
    'https://www.superfinanciera.gov.co',
    'https://www.supernotariado.gov.co',
    'https://www.supersalud.gov.co',
    'https://www.superservicios.gov.co',
    'https://www.supersociedades.gov.co',
    'https://www.supersolidaria.gov.co',
    'https://www.supertransporte.gov.co',
    'https://www.supervigilancia.gov.co',
    'https://www.telecafe.gov.co',
    'https://www.ugpp.gov.co',
    'https://www.uiaf.gov.co',
    'https://www.unidad.serviciodeempleo.gov.co',
    'https://www.unidadvictimas.gov.co',
    'https://www.unp.gov.co',
    'https://www.upra.gov.co',
    'https://www.urf.gov.co',
    'https://www.uspec.gov.co',
    'id.presidencia.gov.co',
    'portal.gestiondelriesgo.gov.co',
    'portal.icetex.gov.co',
    'saludcapital.gov.co',
    'serviciodeempleo.gov.co',
    'telecafe.gov.co',
    'unidad.serviciodeempleo.gov.co',
    'ww1.upme.gov.co',
    'www.adr.gov.co',
    'www.adres.gov.co',
    'www.aerocivil.gov.co',
    'www.agenciadetierras.gov.co',
    'www.agenciavirgiliobarco.gov.co',
    'www.alemania.embajada.gov.co',
    'www.ane.gov.co',
    'www.anh.gov.co',
    'www.ani.gov.co',
    'www.anla.gov.co',
    'www.anm.gov.co',
    'www.ansv.gov.co',
    'www.apccolombia.gov.co',
    'www.apps.migracioncolombia.gov.co',
    'www.aunap.gov.co',
    'www.barranquilla.gov.co',
    'www.bogota.gov.co',
    'www.bomberos.mininterior.gov.co',
    'www.bucaramanga.gov.co',
    'www.buscadordeempleo.gov.co',
    'www.cali.gov.co',
    'www.cancilleria.gov.co',
    'www.caroycuervo.gov.co',
    'www.casur.gov.co',
    'www.centroderelevo.gov.co',
    'www.cnsc.gov.co',
    'www.colciencias.gov.co',
    'www.coldeportes.gov.co',
    'www.colombiacompra.gov.co',
    'www.colpensiones.gov.co',
    'www.consejosuperior.gov.co',
    'www.contaduria.gov.co',
    'www.contraloria.gov.co',
    'www.contratos.gov.co',
    'www.corteconstitucional.gov.co',
    'www.cortesuprema.gov.co',
    'www.cra.gov.co',
    'www.crcom.gov.co',
    'www.creg.gov.co',
    'www.dane.gov.co',
    'www.dapre.presidencia.gov.co',
    'www.datos.gov.co',
    'www.defensacivil.gov.co',
    'www.defensajuridica.gov.co',
    'www.defensoria.gov.co',
    'www.derechodeautor.gov.co',
    'www.dian.gov.co',
    'www.dni.gov.co',
    'www.dnp.gov.co',
    'www.dps.gov.co',
    'www.es.presidencia.gov.co',
    'www.finlandia.embajada.gov.co',
    'www.fiscalia.gov.co',
    'www.fna.gov.co',
    'www.funcionpublica.gov.co',
    'www.gov.co',
    'www.icetex.gov.co',
    'www.icfes.gov.co',
    'www.id.presidencia.gov.co',
    'www.indumil.gov.co',
    'www.inm.gov.co',
    'www.irc.gov.co',
    'www.itrc.gov.co',
    'www.jcc.gov.co',
    'www.medellin.gov.co',
    'www.migracioncolombia.gov.co',
    'www.minagricultura.gov.co',
    'www.minambiente.gov.co',
    'www.mincit.gov.co',
    'www.mincultura.gov.co',
    'www.mindefensa.gov.co',
    'www.mineducacion.gov.co',
    'www.minenergia.gov.co',
    'www.minhacienda.gov.co',
    'www.mininterior.gov.co',
    'www.minjusticia.gov.co',
    'www.minsalud.gov.co',
    'www.mintic.gov.co',
    'www.mintrabajo.gov.co',
    'www.mintransporte.gov.co',
    'www.minvivienda.gov.co',
    'www.orgsolidarias.gov.co',
    'www.paiweb.gov.co',
    'www.parquesnacionales.gov.co',
    'www.pereira.gov.co',
    'www.policia.gov.co',
    'www.portal.gestiondelriesgo.gov.co',
    'www.portal.icetex.gov.co',
    'www.positivaenlinea.gov.co',
    'www.procuraduria.gov.co',
    'www.prosperidadsocial.gov.co',
    'www.ramajudicial.gov.co',
    'www.registraduria.gov.co',
    'www.reincorporacion.gov.co',
    'www.renovacionterritorio.gov.co',
    'www.restituciondetierras.gov.co',
    'www.saludcapital.gov.co',
    'www.sedboyaca.gov.co',
    'www.serviciodeempleo.gov.co',
    'www.shd.gov.co',
    'www.sic.gov.co',
    'www.sisben.gov.co',
    'www.ssf.gov.co',
    'www.superfinanciera.gov.co',
    'www.supernotariado.gov.co',
    'www.supersalud.gov.co',
    'www.superservicios.gov.co',
    'www.supersociedades.gov.co',
    'www.supersolidaria.gov.co',
    'www.supertransporte.gov.co',
    'www.supervigilancia.gov.co',
    'www.telecafe.gov.co',
    'www.ugpp.gov.co',
    'www.uiaf.gov.co',
    'www.unidad.serviciodeempleo.gov.co',
    'www.unidadvictimas.gov.co',
    'www.unp.gov.co',
    'www.upra.gov.co',
    'www.urf.gov.co',
    'www.uspec.gov.co'
];
var my_autoComplete = new autoComplete({
    selector: '#evaluate-url',
    minChars: 2,
    source: function (term, suggest) {
        console.log('foi');
        console.log(domains);
        term = term.toLowerCase();
        console.log('term');
        console.log(term);
        var choices = domains;
        console.log('choices');
        console.log(choices);
        var matches = [];
        console.log('matches');
        console.log(matches);
        for (var i = 0; i < choices.length; i++)
            if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
        suggest(matches);
        console.log('matches after suggest');
        console.log(matches);
    }
});
var reportsRepositoryURI = 'https://dejusticia.github.io/mota-reports/';
if ( 'production' !== environment){
    reportsRepositoryURI = './reports/';
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
        console.log('urlObject');
        console.log(urlObject);
        // cleanup results containers and site info
        resultsContainers.forEach(function (elem, index) {
            elem.innerHTML = '<div role="progressbar" class="mdc-linear-progress mdc-linear-progress--indeterminate"><div class="mdc-linear-progress__buffering-dots"></div><div class="mdc-linear-progress__buffer"></div><div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar"><span class="mdc-linear-progress__bar-inner"></span></div><div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar"><span class="mdc-linear-progress__bar-inner"></span></div></div>';
        });

        // fetch a report from the report repository
        atomic( reportsRepositoryURI + urlObject.reportBasename + '.json') //
            .then(function (response) {
                report = response.data;
                processReport(report);
                return report;
            })
            .catch(function (error) {
                console.log('error:');
                console.log(error);
                processReportError(error, urlObject);
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
        var detailsElement = markup.querySelector('.results-criteria');
        var ruleTypeName = 'obligación';
        if ( 'recommendation' ===  rule.type ){
            ruleTypeName = 'recomendación';
        }
        markup.querySelector('.results-criteria h3').innerHTML = rule.title + '<span class = "results-criteria--tags"> <span id="grade-freeAccess" id="grade-' + rule.ruleId + '" class="faux-meter" data-gradePoints="' + rule.gradePoints + '">grado: ' + rule.grade + '</span><span class= "results-criteria-type results-criteria-type--' + rule.type + '"> tipo: ' + ruleTypeName + ' </span></span>';
        markup.querySelector('.results-criteria--description').innerHTML = rule.shortDescription + ' <a href="' + rule.ruleSpecificationUrl + '" class="more-link" target="mota-specs">Más Informaciones.</a>';
        detailsElement.setAttribute('id', 'criteria-' + ruleId);
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
            generalGradeText = 'no conformidad (' + generalGrade + ')';
        } else if (generalGrade <= 20) {
            generalGradeText = 'Deficiente (' + generalGrade + ')';
        } else if (generalGrade <= 50) {
            generalGradeText = 'Insuficiente (' + generalGrade + ')';
        } else if (generalGrade <= 80) {
            generalGradeText = ' conformidad parcial (' + generalGrade + ')';
        } else if (generalGrade < 100) {
            generalGradeText = 'Conformidad (' + generalGrade + ')';
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
        obligationsCompliantContainer.innerHTML = '';
        obligationsPartialCompliantContainer.innerHTML = '';
        obligationsUnsufficientContainer.innerHTML = '';
        obligationsDeficientContainer.innerHTML = '';
        obligationsNotCompliantContainer.innerHTML = '';

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
    var processReportError = function (error, urlObject) {
        if (404 === error.status) {
            console.error('error code 404, buscar nova página', error.status);

            // check if domain exists
            atomic('https://' + urlObject.host, {
                timeout: 30000
                }) //
                .then(function (response) {
                    console.log('found page, response');
                    console.log(response);
                    summaryErrorElement.classList.remove('inactive');
                    resultsDialogElement.innerHTML = '<b>Procesado</b> con error!';
                    summaryErrorElement.innerHTML = '<p>No encontramos el informe que estaba buscando, pero aparentemente el sitio es válido y está en línea. Lo estamos agregando a nuestra cola de evaluación y debería estar listo dentro de las 12 horas.</p>';
                    throw new Error('Report not found, but domains exists.');
                })
                .catch(function (error) {
                    console.log('page not found, error:');
                    console.log(error);
                    summaryErrorElement.classList.remove('inactive');
                    resultsDialogElement.innerHTML = '<b>Procesado</b> con error!';
                    summaryErrorElement.innerHTML = '<p>No encontramos el informe que estaba buscando, y aparentemente el sitio que busca no está en línea. Por favor, verifique que haya ingresado la dirección (URL) correctamente y que el sitio esté activo.</p>';
                    throw new Error('Report not found, but domains exists.');
                });
        }
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
