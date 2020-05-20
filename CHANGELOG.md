# Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA

Project: Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA
Description: Una herramienta para evaluar el cumplimiento con obligaciones e mejores prácticas de transparencia activa en sitios gubernamentales de Colombia. Iniciativa MOTA.
Version: 0.9.1
URL: https://github.com/Dejusticia/mota-evaluador-publico
Keywords: transparency, transparencia, transparencia activa, active transparency, monitor, veeduria, Colombia

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/)

## Unreleased

## [2020-04-09] - 0.9.1

## Added
- auto suggestions for domains;
-

### Security
- removed webpack-dev-server from dev dependencies for security reasons;

## [2020-04-09] - 0.9.0

### Changed
- improved results design and style;

## [2020-03-05] - 0.8.8

### Changed
- bumped version
- rebuild dist folder

## [2020-03-05] - 0.8.7

### Fixed
- fixed spelling and grammar errors

## [2020-03-05] - 0.8.6

### Fixed
- fixed results blocks behavior

## [2020-03-05] - 0.8.5

### Fixed
- minor typographic errors

## [2020-03-04] - 0.8.4

### Added
- test reports for local development testing;

### Changed
- updated npm modules;

### Fixed
- fixed spelling and grammar;
- fixed CHANGELOG.md;

## [2020-02-24] - 0.8.3

### Fixed
- style and script loading

## [2020-02-24] - 0.8.2

### Changed
- some style tweaks
- bumped version

## [2020-02-24] - 0.8.0

### Changed
- some refactoring to the app
- simplified logic and interface
- new grades reference and points logic, following specification 0.4.0
- style improvements
- improved copy

## [2020-01-29] - 0.7.4

### Fixed
- fixed changelog
- bumped version

## [2020-01-29] - 0.7.3

### Fixed
- fixed character encoding

## [2020-01-29] - 0.7.2

### Fixed
- Fixed report status not appearing

## [2020-01-29] - 0.7.1

### Fixed
- app bundle not loading

## [2020-01-29] - 0.7.0

### Changed
- improved results visualization
- improvements to style;
- improved app logic;

## [2020-01-29] - 0.6.3

### Fixed
- fixed markup;

### Changed
- improved markup;
- improved style;
- improved app logic;
- bumped version on README files;

## [2020-01-20] - 0.6.2

### Changed
- Improvements to style
- Moved index.html from src to root

### Fixed
- outdated dist folder

### Removed
- old backup files and folders

## [2020-01-20] - 0.6.1

### Security
- updated npm modules;
- replaced `node-sass` for `sass` for security reasons;

### Added
- Links to other MOTA initiative sites;

### Changed
- Menu markup
- Improved style;
- Improved getValidDomainInfo function;

### Fixed
- Background image logic on stylesheet;

## [2020-01-20] - 0.6.0 [YANKED]

## [2019-10-14] - 0.5.1

### Fixed
- returned results markup
- Sepa más link (href and open in new tab)
- Más informaciones link (open in new tab)
- project description
- CHANGELOG.md info

### Changed
- tweaked results style and markup
- added version number to README files

### Removed
- old backup html files

## [2019-10-03] - 0.5.0

### Added:
    - Background images

### Changed:
    - styling: start using no-js and js CSS classes pattern
    - several style improvements and tweaks, including Tablet Vertical Orientation media query
    - utilities and polyfills moved to mota-utilities module (first iteration)
    - atomic.js now is loaded using npm

## [2019-07-15] - 0.4.5

### Changed
- tweaked order of results categories

## [2019-07-16] - 0.4.4

### Fixed
- missing demo link on README.md

## [2019-07-16] - 0.4.3

### Security
-  js-yaml updated to 3.13.1;
-  lodash updated to 4.17.14
-  lodash.merge updated to 4.6.2

## [2019-07-16] - 0.4.2

### Security
- updated node packages, incluse some with security breaches: lodash, lodash.merge, js-yaml

## [2019-07-16] - 0.4.1

### Fixed
- bumped and correct version number

## [2019-07-16] - 0.4.0

### Added:
- getValidDomainInfo method on app
- parseUri utility
- URIs handling for the form. Only .gov.co domains are valid. A valid domain now is required;
- Read more on items descriptions now links to rules on specification document;

### Changed:

- Improved csvtojsonconverter.js:
	- work with multiples CSV files in a folder;
	- Add meta information based on CSV information;
- New field on rules items on reports JSON  : ruleSpecificationUrl;
- Tweaked styles
- Tweaked markup
- results reports now are fetched from Github repository ( https://github.com/Dejusticia/mota-reports/ )
- processMarkup method name changed to processResultMarkup
- Grades now are categorized in 5 categories:
    - 100 (perfecto!) 100
    - 90-99 (satisfactório) 90-99
    - 50-89 (parcial, debe mejorar) 50-89
    - 20-49 (insatisfactório) 20-49
    - 0-19 (Mucho Insatisfactório!) 0-19

### Fixed
- Recommendations and Obligations results inserted in the wrong places in the page
- Version number on index.html, CHANGELOG.md and package.json;
- general grade was not being calculated

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
