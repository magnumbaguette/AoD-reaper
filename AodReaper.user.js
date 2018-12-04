// ==UserScript==
// @name         AoD Reaper
// @namespace    http://suckitlol.net/
// @version      alpha-0.0.1
// @description  KoC Tool
// @icon         https://i.imgur.com/8unzAfb.png
// @author       magnumbaguette
// @match        https://www.kingsofchaos.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    /* GLOBAL VARIABLES AND FUNCTIONS */
    var PASS = GM_getValue("PASS");
    var SERVER = "http://localhost:8080/";
    var USER = GM_getValue("USER");
    var ID = GM_getValue("ID");
    var UID = GM_getValue("UID");

   // GM_deleteValue("PASS");
    console.log(GM_getValue("PASS"));
   //alert(GM_getValue("PASS"));
    ///// THIS FUNCTION NEEDS BETTER AUTH MECHANISM IN PRODUCTION /////
    function Register(){
        if(PASS == undefined || PASS == null){
            PASS = prompt("Enter the password: ");
            GM_setValue("PASS", PASS);
        }
        GM_xmlhttpRequest({
        method: "GET",
        url: SERVER + "register/" + USER + "/" + ID + "/" + UID + '/' + PASS,
        onload: function(response) {
                 document.querySelectorAll('center')[2].querySelectorAll('img')[0].src = "https://cdn.frankerfacez.com/emoticon/219766/4";
                 document.querySelectorAll('center')[2].removeChild(document.querySelectorAll('sub')[0]);
                 document.querySelectorAll('h1')[0].innerText = "You are registered! Please wait for an admin to approve your account.";
                 document.querySelectorAll('center')[3].removeChild(document.querySelectorAll('button')[0]);
        }
    });
    }
    // define the css link from the repo
    var styler = document.createElement('link');
    styler.rel = "stylesheet";
    styler.href="https://cdn.jsdelivr.net/gh/magnumbaguette/notes/test.css"

    document.getElementsByTagName('head')[0].appendChild(styler);


    //Caller conditions.
    if( window.location.href != 'https://www.kingsofchaos.com/'){
        if(PASS){
        AoDMenu();
        }
    }

    if( window.location.href == 'https://www.kingsofchaos.com/base.php'){
        var reaper_user = document.querySelectorAll('a')[29].innerHTML;
        var reaper_id = document.querySelectorAll('a')[29].href.slice(-7);
        var reaper_uid = document.querySelectorAll('a')[27].href.slice(-7);
        if(PASS == undefined || PASS == null){
            PASS = prompt("Enter the password: ");
            GM_setValue("PASS", PASS);
        }
        //alert(PASS);

        GM_setValue("USER", reaper_user);
        GM_setValue("ID", reaper_id);
        GM_setValue("UID", reaper_uid);

        GM_xmlhttpRequest({
        method: "GET",
        url: SERVER + "info/" + USER + "/" + ID + "/" + UID + '/' + PASS,
        onload: function(response) {
            //alert(response.responseText);
             if(response.responseText == "no"){
                 var oopsies = document.createElement('div');
                 document.querySelectorAll('table')[6].querySelector('tbody').appendChild(oopsies);
                 oopsies.innerHTML = `<center><img src="https://cdn.frankerfacez.com/emoticon/292440/4" alt="Thonking">
                                     <br><sub>refresh page if you registered</sub>
                                    <br><h1 style="color: #F4900C">Reaper did some THONKING and it says you are not registered.</h1></center>`;
                 var centerer = document.createElement('center');
                 var registerbutton = document.createElement('button');
                 centerer.appendChild(registerbutton);
                 registerbutton.innerHTML = `<font size="5" color="#FFCC4D">Register</font>`;
                 document.querySelectorAll('table')[6].querySelector('tbody').appendChild(centerer);
                 registerbutton.addEventListener("click", Register);
                 //console.log(owo);
             }
            else if(response.responseText == "yes"){
                AoDNews();
            }
        }
     });
    }


    //Page definitions.
    function AoDNews(){

        var para = document.createElement('h1');
        var aod_logo = document.createElement('img');
        var trr = document.createElement('th');
        aod_logo.src = "https://i.imgur.com/aWlyTRx.png";
        aod_logo.setAttribute('class', 'center');
        para.textContent = `Welcome to your Reaper account(alpha 0.0.1)`;
        para.style.color = 'red';
        para.style.textAlign = 'center'
        trr.appendChild(para);
        trr.appendChild(aod_logo);
        document.querySelectorAll('table')[6].querySelector('tbody').appendChild(para);
        document.querySelectorAll('table')[6].querySelector('tbody').appendChild(aod_logo);

    }

    function AoDMenu(){

        var menu = document.createElement('tr');
        menu.innerHTML = `<td><a href="/base.php#">
                          <img alt="Command Center" border="0" src="https://i.imgur.com/HKZo0sT.png" width="137" height="28">
                          </a></td>`
        var childOfMenuParent = document.getElementsByTagName('tbody')[3].querySelectorAll('tr')[1];
        document.getElementsByTagName('tbody')[3].insertBefore(menu, childOfMenuParent);
        menu.querySelectorAll('a')[0].addEventListener("click", AoDCenter);
    }




/////////// CUSTOM PAGE ///////////
    function AoDCenter(){
        GM_xmlhttpRequest({
        method: "GET",
        url: SERVER + "info/" + USER + "/" + ID + "/" + UID + '/' + PASS,
        onload: function(response) {
            document.querySelectorAll('td')[45].innerHTML = '<h1>Loading</h1><h3>Loading... Please wait...</h3>';
            setTimeout(()=>{ document.querySelectorAll('td')[45].innerHTML = '<h1>Reaper settings are loading....</h1>'; }, 1000);
            setTimeout(()=>{ document.querySelectorAll('td')[45].innerHTML =`<h1>Horrible example.</h1>
                                                                             <h2 class="api">api stuff</h1>`;}, 2000);
            setTimeout(()=>{ document.getElementsByClassName('api')[0].innerText= response.responseText; } , 3000);
             //return(response.responseText);
            //alert(response.responseText);
        }
    });

    }


///////// END CUSTOM PAGE /////////

})();
