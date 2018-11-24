// ==UserScript==
// @name         AoD Reaper
// @namespace    http://suckitlol.net/
// @version      dev-alpha-0.0.1
// @description  KoC Tool
// @icon         https://i.imgur.com/8unzAfb.png
// @author       magnumbaguette
// @match        https://www.kingsofchaos.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';
    // define the css link from the repo
    var x = document.createElement('link');
    x.rel = "stylesheet";
    x.href="https://cdn.jsdelivr.net/gh/magnumbaguette/notes/test.css"
    document.getElementsByTagName('head')[0].appendChild(x);

    //define the aod news section.
    if( window.location.href == 'https://www.kingsofchaos.com/base.php')
    {
        var para = document.createElement('h1');
        var aod_logo = document.createElement('img');
        aod_logo.src = "https://i.imgur.com/aWlyTRx.png";
        aod_logo.setAttribute('class', 'center');
        para.textContent = 'Welcome to your Reaper account';
        para.style.color = 'red';
        para.style.textAlign = 'center'
        var trr = document.createElement('th')
        trr.appendChild(para);
        trr.appendChild(aod_logo);
        document.querySelectorAll('table')[6].querySelector('tbody').appendChild(para);
        document.querySelectorAll('table')[6].querySelector('tbody').appendChild(aod_logo);
    }

})();
