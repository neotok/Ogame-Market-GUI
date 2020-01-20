// ==UserScript==
// @name         temp fix AGR : transport button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  quick & dirty
// @author       Kaori
// @include     	*.ogame*gameforge.com/game/index.php*
// @grant        none
// @license MIT
// @copyright 2019, kaori00 (https://openuserjs.org/users/kaori00)
// ==/UserScript==

(function () {
    'use strict';
    var getParams = function (url) {
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    };

    function updateRess() {
        let params = getParams(window.location.href);
        let metalGet = params.metal;
        let cristalGet = params.crystal;
        let deutGet = params.deut;

        let ressourceInputs = document.querySelector("#sendfleet #resources");

        let metalInput = ressourceInputs.querySelector('input[name="metal"]');
        let crystalInput = ressourceInputs.querySelector('input[name="crystal"]');
        let deuteriumInput = ressourceInputs.querySelector('input[name="deuterium"]');

        if (metalInput && metalGet) {
            fleetDispatcher.cargoMetal = metalGet;
            formatNumber($('#metal'), metalGet);
        }

        if (crystalInput && cristalGet) {
            fleetDispatcher.cargoCrystal = cristalGet;
            formatNumber($('#crystal'), cristalGet);
        }

        if (deuteriumInput && deutGet) {
            fleetDispatcher.cargoDeuterium = deutGet;
            formatNumber($('#deuterium'), deutGet);
        }

    }
    //fix AGR ressource
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutationRecord) {
            updateRess();
        });
    });

    var target = document.getElementById('fleet3');
    if (target)
        observer.observe(target, { attributes: true, attributeFilter: ['style'] });

})();