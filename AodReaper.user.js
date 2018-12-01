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
// @grant        GM_xmlhttpRequest
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';

    /* GLOBAL VARIABLES AND FUNCTIONS */
    var pass = GM_getValue("_PASS");
    function AccountCheck(){
        if(pass == undefined || pass == null){
            pass = prompt("Enter your password here"); //In production save this password to the database.
            console.log(pass);
            GM_setValue("_PASS", pass);
            console.log(`this is gm`, GM_getValue("_PASS"));
        }else{
            console.log("hey wtf", GM_getValue("_PASS"));
            //GM_deleteValue("_PASS");
            console.log("hey wtf delete", GM_getValue("_PASS"));
        }
    }
    // define the css link from the repo
    var styler = document.createElement('link');
    styler.rel = "stylesheet";
    styler.href="https://cdn.jsdelivr.net/gh/magnumbaguette/notes/test.css"
    document.getElementsByTagName('head')[0].appendChild(styler);


    //Caller conditions.
    if( window.location.href != 'https://www.kingsofchaos.com/'){
        if(pass){
        AoDMenu();
        }
    }

    if( window.location.href == 'https://www.kingsofchaos.com/base.php'){
        if(pass){
        AoDNews();
        AccountCheck();
        }else{
            var oopsies = document.createElement('div');
            document.querySelectorAll('table')[6].querySelector('tbody').appendChild(oopsies);
            oopsies.innerHTML = `<center><img src="https://cdn.frankerfacez.com/emoticon/292440/4" alt="Thonking">
                                 <br><sub>refresh page if you registered</sub>
                                 <br><h1>Seems like you dont have a Reaper account to access AoD goodies..</h1></center>`;
            var centerer = document.createElement('center');
            var registerbutton = document.createElement('button');
            centerer.appendChild(registerbutton);
            registerbutton.innerHTML = "<b>Click to register</b>";
            document.querySelectorAll('table')[6].querySelector('tbody').appendChild(centerer);
            registerbutton.addEventListener("click", AccountCheck);
            //console.log(owo);
        }
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
       // menu.onclick = CustomPage();
        menu.querySelectorAll('a')[0].addEventListener("click", AoDCenter);
    }



/////////// CUSTOM PAGE ///////////
    function AoDCenter(){
            document.querySelectorAll('td')[45].innerHTML = '<h1>Loading</h1><h3>Loading... Please wait...</h3>';
            setTimeout(()=>{ document.querySelectorAll('td')[45].innerHTML = '<h1>Reaper settings are loading....</h1>'; }, 1000);
            setTimeout(()=>{ document.querySelectorAll('td')[45].innerHTML =`<h1>Horrible example.</h1>
                                                                              <table>
  <tr>
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
    <td>Francisco Chang</td>
    <td>Mexico</td>
  </tr>
  <tr>
    <td>Ernst Handel</td>
    <td>Roland Mendel</td>
    <td>Austria</td>
  </tr>
  <tr>
    <td>Island Trading</td>
    <td>Helen Bennett</td>
    <td>UK</td>
  </tr>
  <tr>
    <td>Laughing Bacchus Winecellars</td>
    <td>Yoshi Tannamuri</td>
    <td>Canada</td>
  </tr>
  <tr>
    <td>Magazzini Alimentari Riuniti</td>
    <td>Giovanni Rovelli</td>
    <td>Italy</td>
  </tr>
</table>`;}, 2000);
    }
///////// END CUSTOM PAGE /////////
})();
