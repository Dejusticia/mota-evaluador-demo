# Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA

Project: Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA
Description: Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA
Version: 0.2.0
URL: https://github.com/Dejusticia/mota-evaluador-publico
Keywords: transparency, transparencia, transparencia activa, active transparency, monitor, veeduria, Colombia

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/)

## Unreleased

## [2019-05-29] - 0.3.0

### Added
- Version information to HTML head
- Javascript utilities file:
  - HTML5 template element Polyfill
  - Deep merge for objects by Chris Ferdinandi
  - Array.prototype.forEach() and NodeList.prototype.forEach() polyfills by Chris Ferdinandi
  - ChildNode.prepend() polyfill by Chris Ferdinandi (adapted from jszhou original polyfill )
- Progress Indicator for when results are being retrieved
- CSV/JSON conversion utilities for development purposes
  - csvtojson
  - jsonexport

### Changed
- Added new rules to ruleset-general.json and dummy report;
- Improved ruleset-general and reports json with more information for each criteria;
- Improved javascript inline documentation
- Abstracted some code into new functions/methods on app script:
  - processMarkup
  - getDomElements
- Improved app methods
- moved HTML5 template element Polyfill to utilities.js

### Fixed
- Rogue markdown markup on index.html

## [2019-05-23] - 0.2.0

### Added
- Improved markup
- Improved style
- Added dummy test reports
- Added accessible menu scripts (see <https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html)>
- Initial App Logic
- HTML5 template element Polyfill by Brian Blakely ( see <https://jsfiddle.net/brianblakely/h3EmY/>)

### Changed
- javascript variables, classes and ids changed to english for easier collaboration;

## [2019-05-17] - 0.1.0

### Added
- Basic project structure and files;
- Initial HTML;
- Initial Styles, including some material design styles;
- SanitizeHTML.js script;
- Gulp tasks;