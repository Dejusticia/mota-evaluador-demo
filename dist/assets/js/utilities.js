/*!
 * mota-evaluador v0.1.0
 * Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA
 * (c) 2019 
 * MIT License
 * https://github.com/Dejusticia/mota-evaluador-publico
 */

/*  A series of utilities and polyfills used by the main app */
/*  TODO: Test HTML5 template element Polyfill on IE */
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
/**
 * Array.prototype.forEach() polyfill
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}
/**
 * NodeList.prototype.forEach() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
 */
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

/*!
 * Deep merge two or more objects into the first.
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param   {Object} objects  The objects to merge together
 * @returns {Object}          Merged values of defaults and options
 */
var deepAssign = function () {

    // Make sure there are objects to merge
    var len = arguments.length;
    if (len < 1) return;
    if (len < 2) return arguments[0];

    // Merge all objects into first
    for (var i = 1; i < len; i++) {
        for (var key in arguments[i]) {
            // If it's an object, recursively merge
            // Otherwise, push to key
            if (Object.prototype.toString.call(arguments[i][key]) === '[object Object]') {
                arguments[0][key] = deepAssign(arguments[0][key] || {}, arguments[i][key]);
            } else {
                arguments[0][key] = arguments[i][key];
            }
        }
    }

    return arguments[0];

};
/**
 * ChildNode.prepend() polyfill
 * Adapted from https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
 * @author Chris Ferdinandi
 * @license MIT
 */
(function (elem) {

    // Check if element is a node
    // https://github.com/Financial-Times/polyfill-service
    var isNode = function (object) {

        // DOM, Level2
        if (typeof Node === 'function') {
            return object instanceof Node;
        }

        // Older browsers, check if it looks like a Node instance)
        return object &&
            typeof object === "object" &&
            object.nodeName &&
            object.nodeType >= 1 &&
            object.nodeType <= 12;

    };

    // Add append() method to prototype
    for (var i = 0; i < elem.length; i++) {
        if (!window[elem[i]] || 'prepend' in window[elem[i]].prototype) continue;
        window[elem[i]].prototype.prepend = function () {
            var argArr = Array.prototype.slice.call(arguments);
            var docFrag = document.createDocumentFragment();

            for (var n = 0; n < argArr.length; n++) {
                docFrag.appendChild(isNode(argArr[n]) ? argArr[n] : document.createTextNode(String(argArr[n])));
            }

            this.appendChild(docFrag);
        };
    }

})(['Element', 'CharacterData', 'DocumentType']);

