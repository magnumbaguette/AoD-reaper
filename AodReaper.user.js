
    // ==UserScript==
// @name           Reaper
// @namespace      aod.reaper
// @version        0.0.5
// @description    KoC Tool
// @icon           https://i.imgur.com/8unzAfb.png
// @include        https://www.kingsofchaos.com/*
// @include        http://lacn.dividinglimits.com/clicker/*
// @include        https://www.cabieri.com/cgi-bin/*
// @exclude 	   https://*.kingsofchaos.com/confirm.login.php*
// @exclude 	   https://*.kingsofchaos.com/security.php*
// @exclude 	   httsp://www.kingsofchaos.com/error.php
// @grant 		   GM_xmlhttpRequest
// @grant 		   GM_setValue
// @grant 		   GM_getValue
// @grant 		   GM_deleteValue
// @grant 		   GM_openInTab
// @grant 		   GM_addStyle
// @grant          GM_getResourceText
// @version        2.8
// @require        https://www.demk.cf/jquery-latest.js
// @require        https://www.demk.cf/jquery.tablesorter.js
// ==/UserScript==



(function() {
    'use strict';



if(DetectRunningInstance() == true)
{
    alert("You are running multiple instances of the NSL script!\nManually remove the duplicates from Greasemonkey menu.");
}

var NSL_version = 2.8;
var NSL_server = "https://blueclaws.in/";

var NSL_username = GM_getValue("NSL_username", "");
var NSL_password = GM_getValue("NSL_password", "");
var NSL_statid = GM_getValue("NSL_statid", "");

var soldiers = "";       // used on some pages like train.php, mercs.php
var mercs = "";          // available mercs
var bfPlayers = []; // list of stats for players on the current bf

var gold = GetGold();
var url = document.location.toString();


var weaponList = ["Blackpowder Missile", "Invisibility Shield", "Chariot", "Dragonskin", "Nunchaku", "Lookout Tower", "Skeleton Key", "Guard Dog", "Grappling Hook"];


if(document.body.innerHTML.indexOf("logout.php") < 0 || document.body.innerHTML.indexOf("is a registered trademark of Kings of Chaos") < 0)
{
    //logged out or incomplete page
}

// Get tables and convert to array

	checkVersion();

	AddMenuItems();

	AddBfSearch();

  CheckExpForNextTech();

if(url.indexOf("/base.php") > 0)
{
    BasePHP();
}
else if(url.indexOf("/clicktop.pl") > 0)
{
    ClicktopPHP();
}
else if(url.indexOf("/armory.php") > 0)
{
    ArmoryPHP();
}
else if(url.indexOf("/train.php") > 0)
{
    TrainPHP();
}
else if(url.indexOf("/mercs.php") > 0)
{
    MercsPHP();
}
else if(url.indexOf("/stats.php") > 0)
{
    StatsPHP();
}
else if(url.indexOf("/attack.php") > 0)
{
    AttackPHP();
}
else if(url.indexOf("/inteldetail.php") > 0)
{
    InteldetailPHP();
}
else if(url.indexOf("/detail.php") > 0)
{
    DetailPHP();
}
else if(url.indexOf("/battlefield.php") > 0)
{
	BattlefieldPHP();
}
else if(url.indexOf("/conquest.php") > 0)
{
	ConquestPHP();
}
else if(url.indexOf("/writemail.php") > 0)
{
	WritemailPHP();
}
else if(url.indexOf("/attacklog.php") > 0)
{
	AttackLogPHP();
}
else if(url.indexOf("/inbox.php") > 0)
{
	InboxPHP();
}
else if(url.indexOf("/recruit.php") > 0)
{
    RecruitPHP();
}

//scroll into the content (on detail php, it scrolls itself)
if(GM_getValue("NSL_OptionScrollIntoContent", 1) != 0 && url.indexOf("/detail.php") < 0)
{
    document.getElementsByTagName('table')[2].scrollIntoView();
}

// If any traces left, disable.
// Disable hotkeys as per mods request
GM_setValue("NSL_OptionKS", 0);

// Disable armory/train/mercs buy helper
GM_setValue("NSL_OptionBH", 1);

// Disable autoredirect
GM_setValue("NSL_OptionARD", 0);

addGlobalStyle('th { border-radius: 5px !important; }');
addGlobalStyle('th { border: 0px solid; !important; }');
addGlobalStyle('input, textarea, button { border-radius: 5px !important; }');
addGlobalStyle('select { border-radius: 5px !important; }');


/*****************************************************************************/
/********************************* PAGES *************************************/
/*****************************************************************************/
function BasePHP()
{

    var statid = GetText("b>Name</b", "id=", "\"");
    var username = GetText("b>Name</b", "\">", "<");
    var uniqid = GetText("uniqid=", "\"");

    GM_setValue("NSL_username", username);
    GM_setValue("NSL_statid", statid);
    GM_setValue("NSL_uniqid", uniqid);

    console.log(username, statid, uniqid, NSL_password);
    // Display the custom div on top
    GM_xmlhttpRequest(
    {
        method: "GET",
        url: NSL_server + "info/" + username + "/" + statid + "/" + uniqid + "/" + NSL_password,

        onload: function(r)
        {
            //alert(r.responseText);
            if(r.status == 200)
            {
				//alert(r.responseText);	// For Debugging
                if(r.responseText == "no")
                {
                    var customDiv = document.createElement("div");
                    customDiv.innerHTML = "<br><center><table class=table_lines width=100%><tr><th style=\"border-color: darkred; background-color:red; height: 4ex;\">You haven't registered a NSL account!</th></tr>"
                                        + "<tr><td><a href=# id=registerNSL onClick=\"return false;\">Click here</a> to register your NSL account. Please choose an unique password"
                                        + "<br><br>If this is not working, contact <a href=https://www.kingsofchaos.com/stats.php?id=4527680>LifeIsOne</a> , <a href=https://www.kingsofchaos.com/stats.php?id=4525625>UmbrusRO_DEMK</a> or <a href=https://www.kingsofchaos.com/stats.php?id=4528239>Kakarot_DEMK</a> via KoC pm.</td></tr>"
                                        + "</table></center><br><br>";
                    document.getElementsByClassName("content")[0].insertBefore(customDiv, document.getElementsByClassName('table_lines')[0]);

                    document.getElementById('registerNSL').addEventListener('click', function(){ BasePHP_OnRegisterNSL(username, statid, uniqid, NSL_password); }, false);
										GM_setValue("NSL_eligable", 0);
                }
                else if(r.responseText == "Invalid Password")
                {
                    var customDiv = document.createElement("div");
                    customDiv.innerHTML = "<br><center><table class=table_lines width=100%><tr><th style=\"border-color: darkred; background-color:red; height: 4ex;\">Your NSL password is invalid!</th></tr>"
                                        + "<tr><td>Click <a href=# id=putNSLPassword onClick=\"return false;\">here</a> to re-enter your NSL password."
                                        + "<br><br>If you do not remember your NSL password, contact <a href=https://www.kingsofchaos.com/stats.php?id=4527680>LifeIsOne</a> , <a href=https://www.kingsofchaos.com/stats.php?id=4525625>UmbrusRO_DEMK</a> or <a href=https://www.kingsofchaos.com/stats.php?id=4528239>Kakarot_DEMK</a>via KoC pm.</td></tr>"
                                        + "</table></center><br><br>";
                    document.getElementsByClassName("content")[0].insertBefore(customDiv, document.getElementsByClassName('table_lines')[0]);

                    document.getElementById('putNSLPassword').addEventListener('click', function(){ BasePHP_OnputNSLPassword(username, NSL_password); }, false);
										GM_setValue("NSL_eligable", 0);
                }
                else if(r.responseText == "wait")
                {
                    var customDiv = document.createElement("div");
                    customDiv.innerHTML = "<br><center><table class=table_lines width=100%><tr><th style=\"border-color: darkorange; background-color:orange; height: 4ex;\">Your NSL account is not activated!</th></tr>"
                                        + "<tr><td>If this is taking too long, contact <a href=https://www.kingsofchaos.com/stats.php?id=4527680>LifeIsOne</a> , <a href=https://www.kingsofchaos.com/stats.php?id=4525625>UmbrusRO_DEMK</a> or <a href=https://www.kingsofchaos.com/stats.php?id=4528239>Kakarot_DEMK</a> via KoC pm.</td></tr>"
                                        + "</table></center><br><br>";
                    document.getElementsByClassName("content")[0].insertBefore(customDiv, document.getElementsByClassName('table_lines')[0]);
										GM_setValue("NSL_eligable", 0);
                }

                else
                {
                    var customDiv = document.createElement("div");
		            customDiv.innerHTML = r.responseText.indexOf("<div id=\"x\">") >= 0 ? r.responseText : "<center><b>Server is currently down. Please wait a few minutes.</b></center><br>";

		            document.getElementsByClassName("content")[0].insertBefore(customDiv, document.getElementsByClassName('table_lines')[0]);
					GM_setValue("NSL_eligable", 1);
                }
            }
        }
    });

    GM_xmlhttpRequest(
    {
        method: "GET",
        url: NSL_server + "statuscheck/" + username + "/" + statid + "/" + uniqid + "/" + NSL_password,

        onload: function(r)
        {
            if(r.status == 200)
            {
				//alert(r.responseText);	// For Debugging
                if(r.responseText == "Admin")
                {
					GM_setValue("NSL_admin", 1);
                }
                else
                {
					GM_setValue("NSL_admin", 0);
                }
            }
        }
    });

		var MilOverviewTable = GetTable("Military Overview");

		if (MilOverviewTable) {
				var projIncomeRow = GetTableRow(MilOverviewTable, 0, "<b>Projected Income");

				if (projIncomeRow >= 0) {
					var projIncome = GetTextIn(MilOverviewTable.rows[projIncomeRow].cells[1].innerHTML, "", " ").replace(/,/g, "");
					MilOverviewTable.insertRow(projIncomeRow + 1).innerHTML = "<td><b>Hourly Income</b></td><td>" + AddCommas(Math.floor((projIncome * 60)).toString()) + " Gold (in 60 mins)</td>";
          MilOverviewTable.insertRow(projIncomeRow + 2).innerHTML = "<td><b>Daily Income</b></td><td>" + AddCommas(Math.floor((projIncome * 60 * 24)).toString()) + " Gold (in 24 hours)</td>";
				}
		}

    var tbgprojec = Math.floor(projIncome * 60);
    var recent = GetTable("Recent Attacks on You");

          for(var i = 2; i < recent.rows.length; i++) {

						if(recent.rows[i].cells[0].innerHTML.match("No incoming attacks reported")) { break; }

						var gold = recent.rows[i].cells[2].innerHTML;


						var color = 'green';
						if(gold == "Attack defended") {
							color = 'red';
						}
						else {
							gold = GetTextIn(recent.rows[i].cells[2].innerHTML, "", " ").replace(/,/g, "");
						}

						if(gold <  tbgprojec) {
							color = 'yellow';
						}

						recent.rows[i].cells[2].innerHTML = '<div style="color: ' + color + '">' + recent.rows[i].cells[2].innerHTML + '</div>';
          }

    // Update own stats
    var sa = GetText(">Strike Action<", "\">", "<").replace(/,/g, "");
		var da = GetText(">Defensive Action<", "\">", "<").replace(/,/g, "");
		var spy = GetText(">Spy Rating<", "\">", "<").replace(/,/g, "");
		var sentry = GetText(">Sentry Rating<", "\">", "<").replace(/,/g, "");
    var officerBonus = GetText("in today (x ",")");

		GM_setValue("NSL_currentOfficerBonus", officerBonus);

		GM_xmlhttpRequest({
		method: "GET",
			url: NSL_server + "selfupdate/" + username + "/"  + statid + "/" + uniqid + "/" + NSL_password + "/" + sa + "/" + da + "/" + spy  + "/" + sentry// + "/" + officerBonus
           // onload: function(r){
               // alert(r.responseText);
            //}
		});

    // Add the NSL options button
  	var tablePreferences = GetTable("Preferences");
    //var table = GetTag('th', "Preferences").parentNode.parentNode;

    tablePreferences.insertRow(2).innerHTML = "<td align=center><a style=\"cursor:pointer\" id=bOpenNSLOptions>NSL Options</a>";
    document.getElementById('bOpenNSLOptions').addEventListener('click', BasePHP_OnToggleNSLOptions, false);

    // Add the NSL options
    var nslOptions = "<table width=100% class=table_lines cellspacing=0 cellpadding=8><tr><th colspan=2>NSL Options</th></tr>"
				  + "<tr><td align=right><label for=nslOptionArmoryDetail>Add Armory Detail Stats</label></td><td><input type=checkbox id=nslOptionArmoryDetail " + (GM_getValue("NSL_OptionArmoryDetail", 1) == 0 ? "" : "checked") + "></input></td></tr>"
                  + "<tr><td align=right><label for=nslOptionScrollIntoContent>Scroll into the content</label></td><td><input type=checkbox id=nslOptionScrollIntoContent " + (GM_getValue("NSL_OptionScrollIntoContent", 1) == 0 ? "" : "checked") + "></input></td></tr>"
                  + "<tr><td align=right><label for=nslOptionSpecialEffects>Special effects</label></td><td><input type=checkbox id=nslOptionSpecialEffects " + (GM_getValue("NSL_OptionSpecialEffects", 1) == 0 ? "" : "checked") + "></input></td></tr>"
				  + "<tr><td align=right><label for=nslOptionShowLastMsgSent>Show last msg sent</label></td><td><input type=checkbox id=nslOptionShowLastMsgSent " + (GM_getValue("NSL_OptionShowLastMsgSent", 1) == 0 ? "" : "checked") + "></input></td></tr>"
                  + "<tr><td align=right>Password</td><td><input id=nslOptionPassword value=\"" + GM_getValue("NSL_password", "") + "\"></input></td></tr>"
                  + "<tr><td colspan=2 align=right style=\"border-bottom:0; padding:2em;\"><button id=bSaveNSLOptions>Save</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id=bCancelNSLOptions>Cancel</button></td></tr>"
                  + "</table>";

    var nslOptionsContainerDiv = document.createElement('div');
    nslOptionsContainerDiv.innerHTML = "<div id=dnslOptionsContainer style=\"display:none; position:fixed; width:100%; height:100%; left:0; top:0; background-color:gray; opacity:0.50; z-index:10;\"></div>";

    var nslOptionsDiv = document.createElement('div');
    nslOptionsDiv.innerHTML = "<div id=dnslOptions style=\"display:none; position:fixed; width:60ex; height:25em; left:50%; margin-left:-30ex; top:50%; margin-top:-10em; background-color:black; z-index:15; padding:10px;\">" + nslOptions + "</div>";

    document.body.appendChild(nslOptionsContainerDiv);
    document.body.appendChild(nslOptionsDiv);

    document.getElementById('bSaveNSLOptions').addEventListener('click', BasePHP_OnSaveNSLOptions, false);
    document.getElementById('bCancelNSLOptions').addEventListener('click', BasePHP_OnToggleNSLOptions, false);

    // Expand/collapse tables
    ExpandCollapseTable("Grow Your Army");
    ExpandCollapseTable("Notice from Commander");
    ExpandCollapseTable("Recent Attacks on You");
    ExpandCollapseTable("Military Overview");
    ExpandCollapseTable("Military Effectiveness");
    ExpandCollapseTable("Previous Logins");
    ExpandCollapseTable("Preferences");
    ExpandCollapseTable("Officers");
}

function ClicktopPHP()
{
  var NSL_version = 1.9;
  var NSL_server = "https://localhost:8000/script/";
  alert(NSL_version);
}

function ArmoryPHP()
{

	if(GM_getValue("NSL_eligable", 0) == 0)
	{

		return;
	}

    // Update own stats
    var sa = GetText(">Strike Action<", "\">", "<").replace(/,/g, "");
    var da = GetText(">Defensive Action<", "\">", "<").replace(/,/g, "");
    var spy = GetText(">Spy Rating<", "\">", "<").replace(/,/g, "");
    var sentry = GetText(">Sentry Rating<", "\">", "<").replace(/,/g, "");

    GM_xmlhttpRequest(
    {
        method: "GET",
        url: NSL_server + "selfupdate/" + GM_getValue("NSL_username") + "/"  + GM_getValue("NSL_statid") + "/" + GM_getValue("NSL_uniqid") + "/" + GM_getValue("NSL_password") + "/" + sa + "/" + da + "/" + spy  + "/" + sentry
    });

    // Read current weapons and tools
    var weaponsTable = GetTable("Current Weapon Inventory");
    var toolsTable = GetTable("Current Tool Inventory");
    var buyWeaponsTable = GetTable("Buy Weapons");

    var weapons = [];   // holds the number of current weapons+tools (length is same as the global weaponList)
    var totalSellValue = 0;
    var totalInvestedValue = 0;

    var totalAttackWeapons = 0;
    var totalDefenseWeapons = 0;
    var totalSpyTools = 0;
    var totalSentryTools = 0;

    for(var i = 0; i < weaponList.length; i++)
    {
        weapons.push(0);
    }

    var passedDefenseWeapons = 0;
    var idxDefenseWeaponsTh = -1;

    for(var i = 0; i < weaponsTable.rows.length; i++)
    {
        if(weaponsTable.rows[i].cells.length < 4) continue;

        var wepName = weaponsTable.rows[i].cells[0].innerHTML;

        if(wepName == "Defense Weapons")
        {
            passedDefenseWeapons = 1;
            idxDefenseWeaponsTh = i;
            continue;
        }

        var wepCount = parseInt( weaponsTable.rows[i].cells[1].innerHTML.replace(/,/g, "") );
        var wepSell = parseInt( GetTextIn(weaponsTable.rows[i].cells[3].innerHTML, "Sell for ", " Gold").replace(/,/g, "") );

        if(isNaN(wepCount) == false && isNaN(wepSell) == false)
        {
            totalSellValue += (wepCount * wepSell);
        }

        var j = GetTableRow(buyWeaponsTable, 0, wepName);
        if(j >= 0)
        {
            var wepCost = parseInt( buyWeaponsTable.rows[j].cells[2].innerHTML.replace(/,/g, "") );
            if(isNaN(wepCount) == false && isNaN(wepCost) == false)
            {
                totalInvestedValue += (wepCount * wepCost);
            }
        }

        var idx = weaponList.indexOf(wepName);
        if(idx >= 0)
        {
            weapons[idx] = wepCount;
        }

        if(passedDefenseWeapons == 0)
        {
            totalAttackWeapons += wepCount;
        }
        else
        {
            totalDefenseWeapons += wepCount;
        }


    }

    // same for the tools
    var passedSentryTools = 0;
    var idxSentryToolsTh = -1;

    for(var i = 0; i < toolsTable.rows.length; i++)
    {
        if(toolsTable.rows[i].cells.length < 4) continue;

        var wepName = toolsTable.rows[i].cells[0].innerHTML;

        if(wepName == "Sentry Tools")
        {
            passedSentryTools = 1;
            idxSentryToolsTh = i;
            continue;
        }



        var wepCount = parseInt( toolsTable.rows[i].cells[1].innerHTML.replace(/,/g, "") );
        var wepSell = parseInt( GetTextIn(toolsTable.rows[i].cells[3].innerHTML, "Sell for ", " Gold").replace(/,/g, "") );

        if(isNaN(wepCount) == false && isNaN(wepSell) == false)
        {
            totalSellValue += (wepCount * wepSell);
        }


        var j = GetTableRow(buyWeaponsTable, 0, wepName);
        if(j >= 0)
        {
            var wepCost = parseInt( buyWeaponsTable.rows[j].cells[2].innerHTML.replace(/,/g, "") );
            if(isNaN(wepCount) == false && isNaN(wepCost) == false)
            {
                totalInvestedValue += (wepCount * wepCost);
            }
        }

        var idx = weaponList.indexOf(wepName);
        if(idx >= 0)
        {
            weapons[idx] = wepCount;
        }

        if(passedSentryTools == 0)
        {
			if(isNaN(wepCount) == false && isNaN(wepSell) == false)
        	{
            	totalSpyTools += wepCount;
			}
        }
        else
        {
			if(isNaN(wepCount) == false && isNaN(wepSell) == false)
        	{
            	totalSentryTools += wepCount;
			}
        }

    }

    // show the aat and sell value (weapons)
    if(weaponsTable.rows.length > 2)
    {
        weaponsTable.rows[1].innerHTML = weaponsTable.rows[1].innerHTML.replace("Weapons</th>", "Weapons</th><th class=subh align=right>AAT</th>");
    }

    for(var i = 2; i < weaponsTable.rows.length; i++)
    {
        if(weaponsTable.rows[i].cells.length < 4) continue;

        var wepName = weaponsTable.rows[i].cells[0].innerHTML;
        if(wepName == "Defense Weapons")
        {
            weaponsTable.rows[i].innerHTML = weaponsTable.rows[i].innerHTML.replace("Weapons</th>", "Weapons</th><th class=subh align=right>AAT</th>");
            continue;
        }

        var wepCount = parseInt( weaponsTable.rows[i].cells[1].innerHTML.replace(/,/g, "") );
		var wepSell = parseInt( GetTextIn(weaponsTable.rows[i].cells[3].innerHTML, "Sell for ", " Gold").replace(/,/g, "") );
		var sellValue = wepCount * wepSell;

        var j = GetTableRow(buyWeaponsTable, 0, wepName);
        var wepCost = parseInt( buyWeaponsTable.rows[j].cells[2].innerHTML.replace(/,/g, "") );

        var aat = parseInt( Math.floor(totalInvestedValue / (wepCost * 400)) );

        weaponsTable.rows[i].insertCell(1).innerHTML = AddCommas(Math.min(aat, wepCount).toString());
        weaponsTable.rows[i].cells[1].setAttribute('align', "right");
		if(GM_getValue("NSL_OptionArmoryDetail", 1) != 0)
		{
			weaponsTable.rows[i].cells[0].innerHTML = weaponsTable.rows[i].cells[0].innerHTML + "<br><span style='padding-left: 5px; color: #FFCC00; font-size: 80%;'>Sell value: " + addCommas(sellValue) + "</span>";
		}
    }

    // show the aat and sell value (tools)
    if(toolsTable.rows.length > 2)
    {
        toolsTable.rows[1].innerHTML = toolsTable.rows[1].innerHTML.replace("Tools</th>", "Tools</th><th class=subh align=right>AAT</th>");
    }

    for(var i = 2; i < toolsTable.rows.length; i++)
    {
        if(toolsTable.rows[i].cells.length < 4) continue;

        var wepName = toolsTable.rows[i].cells[0].innerHTML;
        if(wepName == "Sentry Tools")
        {
            toolsTable.rows[i].innerHTML = toolsTable.rows[i].innerHTML.replace("Tools</th>", "Tools</th><th class=subh align=right>AAT</th>");
            continue;
        }

        var wepCount = parseInt( toolsTable.rows[i].cells[1].innerHTML.replace(/,/g, "") );
        var wepSell = parseInt( GetTextIn(toolsTable.rows[i].cells[3].innerHTML, "Sell for ", " Gold").replace(/,/g, "") );
		var sellValue = wepCount * wepSell;

        var j = GetTableRow(buyWeaponsTable, 0, wepName);
        var wepCost = parseInt( buyWeaponsTable.rows[j].cells[2].innerHTML.replace(/,/g, "") );

        var aat = parseInt( Math.floor(totalInvestedValue / (wepCost * 400)) );

        toolsTable.rows[i].insertCell(1).innerHTML = AddCommas(Math.min(aat, wepCount).toString());
        toolsTable.rows[i].cells[1].setAttribute('align', "right");
		if(GM_getValue("NSL_OptionArmoryDetail", 1) != 0)
		{
			toolsTable.rows[i].cells[0].innerHTML = toolsTable.rows[i].cells[0].innerHTML + "<br><span style='padding-left: 5px; color: #FFCC00; font-size: 80%;'>Sell value: " + addCommas(sellValue) + "</span>";
		}
    }

	if(GM_getValue("NSL_OptionArmoryDetail", 1) != 0)
	{
		// TO-DO: Merge this with above. So we don't have to do another loop
		// Add strength for each weapon
		var htmlHead = document.getElementsByTagName("head")[0].innerHTML;
		var myRace = FindText(FindText(htmlHead,'<link href="/images/css/common.css" rel="','css" r'),'/css/','.');
		var saBonus = 1;
		var daBonus = 1;
		var spyBonus = 1;
		var sentryBonus = 1;

		switch(myRace)
		{
			case 'Humans': { spyBonus = 1.35; break;}
			case 'Dwarves': { daBonus = 1.4; break; }
			case 'Elves': { spyBonus = 1.45; break;}
			case 'Orcs': { daBonus = 1.2; saBonus = 1.35; break; }
			case 'Undead': { sentryBonus = 1.35; break;}
		}

		var techMulti = GM_getValue("NSL_currentTech", 1);
		var officerBonus = GM_getValue("NSL_currentOfficerBonus", 1);

		var myFortText = FindText(FindText(document.body.innerHTML,'Current Fortification','<td align="center">'),'<td>','</td>').split(" (")[0];
		var mySiegeText = FindText(FindText(document.body.innerHTML,'Current Siege Technolog','<td align="center">'),'<td>','</td>').split(" (")[0];

		var SiegeArray = SiegeList(mySiegeText).split('|');
		var FortArray = FortList(myFortText).split('|');
		// Returns: Multiply | Next Upgrade | Next Price | Next Multiply

		var siegeBonus = 0;
		var fortBonus = 0;

		if(SiegeArray[0] != "Max")
			siegeBonus = SiegeArray[0];
		else {
			siegeBonus = 39.37;
		}

		if(FortArray[0] != "Max")
			fortBonus = FortArray[0];
		else
			fortBonus = 35.53;

		var strength = 0;
		var atDefenseWeapons = 0;
		var atSentryTools = 0;

		for(var i = 2; i < weaponsTable.rows.length; i++)
		{
            var wepName = weaponsTable.rows[i].cells[0].innerHTML;
			//alert(wepName);
			if(wepName == "Defense Weapons")
			{
				atDefenseWeapons = 1;
				continue;
			}
			if(wepName.indexOf("repair") > 0)
			{
				continue;
			}
		    var wepCount = parseInt( weaponsTable.rows[i].cells[2].innerHTML.replace(/,/g, "") );
			strength = weaponsTable.rows[i].cells[3].innerHTML.split("/")[1].replace(/,/g, "");

			if(atDefenseWeapons == 0)
			weaponsTable.rows[i].cells[3].innerHTML = weaponsTable.rows[i].cells[3].innerHTML + "<div style=\"display: inline; color: #905000; font-size: 80%; cursor: help;\" title=\"The strength of 1 weapon&#13;Total stats value of the weapon when held\"><br>[" + addCommas(Math.round(strength * techMulti * officerBonus * saBonus * siegeBonus * 5)) + "]<br>[" + addCommas(Math.round(strength * techMulti * officerBonus * saBonus * wepCount * siegeBonus * 5)) + "]</div>";
			else
				weaponsTable.rows[i].cells[3].innerHTML = weaponsTable.rows[i].cells[3].innerHTML + "<div style=\"display: inline; color: #905000; font-size: 80%; cursor: help;\" title=\"The strength of 1 weapon&#13;Total stats value of the weapon when held\"><br>[" + addCommas(Math.round(strength * techMulti * officerBonus * daBonus * fortBonus * 5)) + "]<br>[" + addCommas(Math.round(strength * techMulti * officerBonus * daBonus * wepCount * fortBonus * 5)) + "]</div>";

		}

		for(var i = 2; i < toolsTable.rows.length; i++)
		{
			if(toolsTable.rows[i].cells.length < 4) continue;

            var wepCount = parseInt( toolsTable.rows[i].cells[2].innerHTML.replace(/,/g, "") );
			strength = toolsTable.rows[i].cells[3].innerHTML.replace(/,/g, "");

			var wepName = toolsTable.rows[i].cells[0].innerHTML;
			if(wepName == "Sentry Tools")
			{
				atSentryTools = 1;
				continue;
			}

			if(atSentryTools == 0)
				toolsTable.rows[i].cells[3].innerHTML = toolsTable.rows[i].cells[3].innerHTML + "<div style=\"display: inline; color: #905000; font-size: 80%; cursor: help;\" title=\"The strength of 1 weapon&#13;Total stats value of the weapon when held\"><br>[" + addCommas(Math.round(strength * officerBonus * techMulti * spyBonus * Math.pow(1.60,GM_getValue("Covert_Skill",15)))) + "]<br>[" + addCommas(Math.round(strength * officerBonus * techMulti * wepCount* spyBonus * Math.pow(1.60,GM_getValue("Covert_Skill",15)))) + "]</div>";
			else
				toolsTable.rows[i].cells[3].innerHTML = toolsTable.rows[i].cells[3].innerHTML + "<div style=\"display: inline; color: #905000; font-size: 80%; cursor: help;\" title=\"The strength of 1 weapon&#13;Total stats value of the weapon when held\"><br>[" + addCommas(Math.round(strength * officerBonus * techMulti * sentryBonus * Math.pow(1.60,GM_getValue("Covert_Skill",15)))) + "]<br>[" + addCommas(Math.round(strength * officerBonus * techMulti * wepCount * sentryBonus * Math.pow(1.60,GM_getValue("Covert_Skill",15)))) + "]</div>";
		}
	}


    // Show how much weapon is held
    soldiers = GetSoldiers();



    if(totalAttackWeapons > 0)
    {
        var attackSoldiers = soldiers.tas + soldiers.tam + soldiers.us + soldiers.um;
        var unheld = totalAttackWeapons - attackSoldiers;
        if(unheld > 0)
        {
            weaponsTable.rows[1].cells[0].innerHTML += " <span style='color:red; border-left: 1px solid white'>&nbsp;Unheld: " + unheld + "</span>";
        }
    }

    if(totalDefenseWeapons > 0)
    {
        var defenseSoldiers = soldiers.tds + soldiers.tdm + soldiers.us + soldiers.um;
        var unheld = totalDefenseWeapons - defenseSoldiers;
        if(unheld > 0)
        {
            weaponsTable.rows[idxDefenseWeaponsTh].cells[0].innerHTML += " <span style='color:red; border-left: 1px solid white'>&nbsp;Unheld: " + unheld + "</span>";
        }
    }

    if(totalSpyTools > 0)
    {
        var unheld = totalSpyTools - soldiers.spy;
        if(unheld > 0)
        {
            toolsTable.rows[1].cells[0].innerHTML += " <span style='color:red; border-left: 1px solid white'>&nbsp;Unheld: " + unheld + "</span>";
        }
    }

    if(totalSentryTools > 0)
    {
        var unheld = totalSentryTools - soldiers.sentry;
        if(unheld > 0)
        {
            toolsTable.rows[idxSentryToolsTh].cells[0].innerHTML += " <span style='color:red; border-left: 1px solid white'>&nbsp;Unheld: " + unheld + "</span>";
        }
    }


    // Fix the width of the weapons and tools table together
    if(!weaponsTable.rows[1].cells[0].value == 'There are no weapons in your inventory.')
	{
		weaponsTable.rows[1].cells[0].width = '20%';
		weaponsTable.rows[1].cells[1].width = '15%';
		weaponsTable.rows[1].cells[2].width = '15%';
		weaponsTable.rows[1].cells[3].width = '15%';
		weaponsTable.rows[1].cells[4].width = '35%';
	}

	//alert(toolsTable.rows[1].cells[0].innerHTML);
	if(!toolsTable.rows[1].cells[0] == 'undefined') { toolsTable.rows[1].cells[0].width = '20%'; }
	if(!toolsTable.rows[1].cells[1] == 'undefined') { toolsTable.rows[1].cells[1].width = '15%'; }
	if(!toolsTable.rows[1].cells[2] == 'undefined') { toolsTable.rows[1].cells[2].width = '15%'; }
	if(!toolsTable.rows[1].cells[3] == 'undefined') { toolsTable.rows[1].cells[3].width = '15%'; }
	if(!toolsTable.rows[1].cells[4] == 'undefined') { toolsTable.rows[1].cells[4].width = '35%'; }

    // Fix the centerization of strength in tools table
    for(var i = 0; i < toolsTable.rows.length; i++)
    {
        if(toolsTable.rows[i].cells.length >= 5)
        {
            toolsTable.rows[i].cells[3].align = "right";

            // make the tools sell form 90% to align with the weapons
            var toolId = GetTextIn(toolsTable.rows[i].cells[4].innerHTML, "scrapsell[", "]");
            if(toolId == "")
            {
                continue;
            }

            var e = document.getElementsByName("scrapsell[" + toolId + "]");
            if(e.length != 1)
            {
                continue;
            }

            e[0].parentNode.parentNode.parentNode.parentNode.width = "90%";
            e[0].parentNode.parentNode.parentNode.parentNode.align = "center";
        }
    }

    // Show the armory value
    toolsTable.insertRow(-1).innerHTML = "<td colspan=5></td>";
    toolsTable.insertRow(-1).innerHTML = "<td colspan=5 align=center style='background-color:#003333; border-bottom:0'><strong>Sell value: " + AddCommas(totalSellValue.toString()) + " Gold</strong><strong> - Buy value: " + AddCommas(totalInvestedValue.toString()) + " Gold</strong></td>";

    // Check for loss
    var lostLog = [];

    var nowDate = new Date();
    var now = nowDate.getTime();

	var BPM = 0;
	var CH = 0;
	var DS = 0;
	var IS = 0;

    for(var i = 0; i < weaponList.length; i++)
    {
		if(weaponList[i] == 'Invisibility Shield') { IS = weapons[i]; }
		if(weaponList[i] == 'Dragonskin') { DS = weapons[i]; }
		if(weaponList[i] == 'Blackpowder Missile') { BPM = weapons[i]; }
		if(weaponList[i] == 'Chariot') { CH = weapons[i]; }

        var oldCount = GM_getValue("NSL_armory_" + weaponList[i].replace(/ /g, "_"), -1);
        var soldCount = GM_getValue("NSL_armory_" + weaponList[i].replace(/ /g, "_") + "_sold", 0);

        oldCount -= soldCount;

        if(weapons[i] < oldCount)
        {
            lostLog.push((oldCount - weapons[i]) + ":" + weaponList[i] + ":" + now);
        }

        GM_setValue("NSL_armory_" + weaponList[i].replace(/ /g, "_"), weapons[i]);
        GM_setValue("NSL_armory_" + weaponList[i].replace(/ /g, "_") + "_sold", 0);
    }

    // Keep the last 10 logs of lost weapons
    var lostLogGlobal = [];

    for(var i = 0; i < 10; i++)
    {
        lostLogGlobal.push(GM_getValue("NSL_lost_wep_log_" + i, "::"));
    }

    // Add to the lost weapon log
    var lostLogTop = [];    // to show at the top of the page

    for(var i = 0; i < lostLog.length; i++)
    {
        lostLogGlobal.unshift(lostLog[i]);

        var lostWepDetails = lostLog[i].split(":");
        lostLogTop.push("You are missing " + lostWepDetails[0] + " " + lostWepDetails[1] + (lostWepDetails[0] > 1 ? "s" : ""));
    }

    if(lostLogTop.length > 0)
    {
        weaponsTable.insertRow(0).innerHTML = "<td colspan=5 style='background-color:red'><strong>" + lostLogTop.join("<br>") + "</strong></td>";

        // Special effect, I made this, dont steal!
        if(GM_getValue("NSL_OptionSpecialEffects", 1) != 0)
        {
            var bloodDiv = document.createElement('div');
            bloodDiv.setAttribute('style', "position:fixed; left:0; top:0; width:100%; height:100%; background-color:red; opacity:1.0; z-index:1000;");
            bloodDiv.setAttribute('id', "bloodDiv");
            document.body.appendChild(bloodDiv);

            setTimeout(ArmoryPHP_ReduceBloodEffect, 100);
        }
    }


	if(GM_getValue("NSL_OptionArmoryDetail", 1) != 0)
	{
		var htmlHead = document.getElementsByTagName("head")[0].innerHTML;
		var myRace = FindText(FindText(htmlHead,'<link href="/images/css/common.css" rel="','css" r'),'/css/','.');
		var saBonus=1;
		var daBonus=1;

		var techMulti = GM_getValue("NSL_currentTech", 1);
		var officerBonus = GM_getValue("NSL_currentOfficerBonus", 1);

		switch(myRace)
		{
			case 'Dwarves': { daBonus = 1.4; break }
			case 'Orcs': { daBonus = 1.2;saBonus = 1.35; break }
		}


		//var upgradeTable = GetTable("Armory Autofill Preferences");
//		upgradeTable.insertRow(-1).innerHTML = "<td colspan=3></td>";
//		upgradeTable.insertRow(-1).innerHTML = "<th colspan=3>Upgrade Table</th>";

		var myFort = FindText(FindText(document.body.innerHTML,'Current Fortification','<td align="center">'),'<td>','</td>').split(" (")[0]
		var mySiege = FindText(FindText(document.body.innerHTML,'Current Siege Technolog','<td align="center">'),'<td>','</td>').split(" (")[0]

		FortArray = FortList(myFort).split('|');
		SiegeArray = SiegeList(mySiege).split('|');
		// Returns: Multiply | Next Upgrade | Next Price | Next Multiply

		var BPMMsg = '';
		var CHMsg = '';
		var ISMsg = '';
		var DSMsg = '';

		var attackSol = ((((soldiers.tas + soldiers.tam) * 5) * techMulti) * officerBonus);
		var defenceSol = ((((soldiers.tds + soldiers.tdm) * 5) * techMulti) * officerBonus);
		var untrainedSol = ((((soldiers.us + soldiers.um) * 4) * techMulti) * officerBonus);

		if((!isNaN(BPM)) && (!isNaN(CH))) {

			if(SiegeArray[1] != 'Max') // We have some upgrades left.
			{
				var currentSA = ((((BPM*SiegeArray[0])*1000)*6)*saBonus + ((((CH*SiegeArray[0])*600)*6)*saBonus));  // Forumla is correct.

				var tmpcurrentSA =  addCommas(Math.round((((currentSA * techMulti) * officerBonus) + attackSol) + untrainedSol));


				var sellBPM = Math.round(removeComma(SiegeArray[2]) / 700000);
				var sellCH = Math.round(removeComma(SiegeArray[2]) / 315000);

				var newBPM = BPM-sellBPM; //New amount of BPM after selling for upgrade.
				var newCH = CH-sellCH;


				var newSA = (((newBPM*SiegeArray[3])*1000)*6)*saBonus + (((CH*SiegeArray[3])*600)*6)*saBonus;
				var newSACH = (((newCH*SiegeArray[3])*600)*6)*saBonus + (((BPM*SiegeArray[3])*1000)*6)*saBonus

				if(currentSA < newSA)
				{
					if(sellBPM < BPM)
					{
						BPMMsg += "Sell " + sellBPM + " BPMs and buy " + SiegeArray[1];
						BPMMsg += "<br>You'll gain " + addCommas(Math.round(((newSA-currentSA) * techMulti)*officerBonus)) + " SA...";
					}else{
						BPMMsg += 'Its not profitable to buy ' + SiegeArray[1] + ' yet with BPMs';
					}

					if(currentSA < newSACH)
					{
						if(sellCH < CH){
							CHMsg += "Sell " + sellCH + " Chariots and buy " + SiegeArray[1];
							CHMsg += "<br>You'll gain " + addCommas(Math.round(((newSACH-currentSA) * techMulti)*officerBonus)) + " SA...";
						}else{
							CHMsg += 'Its not profitable to buy ' + SiegeArray[1] + ' yet with CHs';
						}
					}else{
						CHMsg += 'Its not profitable to buy ' + SiegeArray[1] + ' yet with CHs';
					}
				}else{
					BPMMsg += 'Its not profitable to buy ' + SiegeArray[1] + ' yet with BPMs';
					if(currentSA < newSACH)
					{
						if(sellCH < CH)
						{
							CHMsg += "Sell " + sellCH + " Chariots and buy " + SiegeArray[1];
							CHMsg += "<br>You'll gain " + addCommas(Math.round(((newSACH-currentSA) * techMulti)*officerBonus)) + " SA...";
						}
					}else{
						CHMsg += 'Its not profitable to buy ' + SiegeArray[1] + ' yet with CHs';
					}

				}
			}else{
				CHMsg = 'Already got all sa upgrades.';
				BPMMsg = 'Already got all sa upgrades.';
			}
		}else{
				CHMsg = "Couldn't detect your Chariots.";
				BPMMsg = "Couldn't detect your BPMs.";
		}




		if((!isNaN(IS)) && (!isNaN(DS))) {
			if(FortArray[1] != 'Max') // We have some upgrades left.
			{
				//alert((((1*FortArray[0])*256)*5)*daBonus);  //  41,813,923
				var currentDA = ((((IS*FortArray[0])*1000)*6)*daBonus + (((DS*FortArray[0])*256)*6)*daBonus);  // Forumla is correct.
				var tmpcurrentDA =  addCommas(Math.round((((currentDA * techMulti) * officerBonus) + defenceSol) + untrainedSol));

				var sellIS = Math.round(removeComma(FortArray[2]) / 700000);
				var sellDS = Math.round(removeComma(FortArray[2]) / 140000);

				var newIS = IS-sellIS; //New amount ofIS after selling for upgrade.
				var newDS = DS-sellDS; //New amount of DS after selling for upgrade.

				var newDA = ((((newIS*FortArray[3])*1000)*6)*daBonus + (((DS*FortArray[3])*256)*6)*daBonus);  // Forumla is correct.

				var newDADS = ((((newDS*FortArray[3])*256)*6)*daBonus + (((IS*FortArray[3])*1000)*6)*daBonus);  // Forumla is correct.

				if(currentDA < newDA)
				{
					if(newIS < IS){
						ISMsg += "Sell " + sellIS + " ISs and buy " + FortArray[1];
						ISMsg += "<br>You'll gain " + addCommas(Math.round(((newDA-currentDA) * techMulti)*officerBonus))+ " DA...";
					}else{
						ISMsg += 'Its not profitable to buy ' + FortArray[1] + ' yet with ISs';
					}

					if(currentDA < newDADS)
					{
						if(sellDS < DS){
							DSMsg += "Sell " + sellDS + " Dragon Skins and buy " + FortArray[1];
							DSMsg += "<br>You'll gain " + addCommas(Math.round(((newDADS-currentDA) * techMulti)*officerBonus))+ " DA...";
						}else{
							DSMsg += 'Its not profitable to buy ' + FortArray[1] + ' yet with Dragon Skins';
						}
					}else{
						DSMsg += 'Its not profitable to buy ' + FortArray[1] + ' yet with Dragon Skins';
					}
				}else{
					ISMsg += 'Its not profitable to buy ' + FortArray[1] + ' yet with ISs';
					if(currentDA < newDADS)
					{
						if(sellDS < DS){
							DSMsg += "Sell " + sellDS + " DSs and buy " + FortArray[1];
							DSMsg += "<br>You'll gain " + addCommas(Math.round(((newDADS-currentDA) * techMulti)*officerBonus))+ " DA...";
						}else{
							DSMsg = 'Its not profitable to buy ' + FortArray[1] + ' with dragon skins';
						}
					}else{
						DSMsg = 'Its not profitable to buy ' + FortArray[1] + ' with dragon skins';
					}
				}
			}else{
				ISMsg = 'Already got all da upgrades.';
				DSMsg = 'Already got all da upgrades.';
			}
		}else{
			upgradeMsgDA = "Couldn't detect your IS [or] DS count";
		}

	//	`upgradeTable.insertRow(-1).innerHTML = "<td align=right>SA Upgrade</td>"
//										  + "<td align=left>BPM</td>"
	//									  + "<td align=left>" + BPMMsg + "</td>";
	//
	//	upgradeTable.insertRow(-1).innerHTML = "<td align=right>SA Upgrade</td>"
	//									  + "<td align=left>Chariots</td>"
	//									  + "<td align=left>" + CHMsg + "</td>";
	//
	//	upgradeTable.insertRow(-1).innerHTML = "<td align=right>DA Upgrade</td>"
	//									  + "<td align=left>IS</td>"
	//									  + "<td align=left>" + ISMsg + "</td>";
	//
	//	upgradeTable.insertRow(-1).innerHTML = "<td align=right>DA Upgrade</td>"
	//									  + "<td align=left>Dragon Skins</td>"
	//									  + "<td align=left>" + DSMsg + "</td>";`

	//	`upgradeTable.insertRow(-1).innerHTML = "<td colspan=3 align=center><button id=upgradeTest onClick=\"return false;\" style='width:9ex'>Read me</button></td>";

		//document.getElementById('upgradeTest').addEventListener('click', function(event) {
		//	var testUpgrade = "Upgrade Table is in its beta stage, to ensure people don't make mistakes; use this as a guildline\n\n";
		//	testUpgrade += "Your SA is: " + addCommas(sa) + "\n";
		//	testUpgrade += "Our formula calculated your SA to be: " + tmpcurrentSA + "\n";
		//	testUpgrade += "If these two values are similar; its safe to trust our upgrade suggestions.\n\n";

		//	testUpgrade += "Your DA is: " + addCommas(da) + "\n";
		//	testUpgrade += "Our formula calculated your DA to be: " + tmpcurrentDA + "\n";
		//	testUpgrade += "If these two values are similar; its safe to trust our upgrade suggestions.\n\n";

		//	testUpgrade += "\n\n\n If the numbers are highly wrong, please visit training page, and command centre so NSL can store your officer bonus; and tech bonus.";
		//	testUpgrade += "\n\n Please note: Our formula only calculates big weapons, it doesn't include soldiers and small weapons.";
		//	alert(testUpgrade);

		//}, false);//
		// End of when to upgrade.

        var th = GetTag('th', "Armory Autofill Preferences");
        if(!th) return;

        var statsTableHtml = "<table width=100% class=table_lines cellspacing=0 cellpadding=6>"
        + "<tr><th colspan=3>Upgrade Helper</th></tr>"
        + "<tr><td width=30%><b>SA Upgrade</b></td><td align=left>BPM</td><td align=left>" + BPMMsg + "</td></tr>"
        + "<tr><td><b>SA Upgrade</b></td><td align=left>Chariots</td><td align=left>" + CHMsg + "</td></tr>"
        + "<tr><td><b>DA Upgrade</b></td><td align=left>IS</td><td align=left>" + ISMsg + "</td></tr>"
        + "<tr><td><b>DA Upgrade</b></td><td align=left>Dragonskins</td><td align=left>" + DSMsg + "</td></tr>"
        +"</table><br /><br />";


        var statsPlace = th.parentNode.parentNode.parentNode.parentNode;
        statsPlace.innerHTML = statsTableHtml + statsPlace.innerHTML;
        ExpandCollapseTable("Upgrade Helper");
	}

		ExpandCollapseTable("Upgrade Table");

    // Lost weapons log
    var lostTable = GetTable("Armory Autofill Preferences");
    lostTable.insertRow(-1).innerHTML = "<td colspan=3></td>";
    lostTable.insertRow(-1).innerHTML = "<th colspan=3>Lost Weapons Log</th>";

    var anyLossLogged = false;

    for(var i = 0; i < 10; i++)
    {
        GM_setValue("NSL_lost_wep_log_" + i, lostLogGlobal[i]);

        if(lostLogGlobal[i].length > 2) // at least "::"
        {
            var lostWepDetails = lostLogGlobal[i].split(":");

            // fix plural
            lostWepDetails[1] += (lostWepDetails[0] > 1 ? "s" : "");

            // compute elapsed time
            var elapsed = now - parseInt(lostWepDetails[2]);
            lostWepDetails[2] = elapsed > 0 ? PrintableTime(elapsed) + " ago" : "NOW!";

            if(elapsed == 0)
            {
                lostWepDetails[0] = "<strong style='color:red'>" + lostWepDetails[0] + "</strong>";
                lostWepDetails[1] = "<strong style='color:red'>" + lostWepDetails[1] + "</strong>";
                lostWepDetails[2] = "<strong style='color:red'>" + lostWepDetails[2] + "</strong>";
            }

            lostTable.insertRow(-1).innerHTML = "<td align=right>" + lostWepDetails[0] + "</td>"
                                              + "<td align=left>" + lostWepDetails[1] + "</td>"
                                              + "<td align=left>" + lostWepDetails[2] + "</td>";

            anyLossLogged = true;
        }
    }

    if(!anyLossLogged)
    {
        lostTable.insertRow(-1).innerHTML = "<td colspan=3 align=center>Nothing has been logged yet.</td>";
    }

    // Listen to sell buttons so that sells wont be logged as missing
    var sellButtons = document.getElementsByName('doscrapsell');
    for(var i = 0; i < sellButtons.length; i++)
    {
        sellButtons[i].addEventListener('click', ArmoryPHP_OnSellButton, false);
    }

  	 // Add helper buttons for buying, if enabled
	if(GM_getValue("NSL_OptionBH", 0) == 1)
	{
		buyWeaponsTable.rows[1].cells[3].setAttribute('colspan', 2);

		for(var i = 2; i < buyWeaponsTable.rows.length; i++)
		{
			if(buyWeaponsTable.rows[i].cells[0].innerHTML.indexOf("Defense Weapons") >= 0)
			{
				buyWeaponsTable.rows[i].cells[3].setAttribute('colspan', 2);
				continue;
			}

			if(buyWeaponsTable.rows[i].cells[0].innerHTML.indexOf("Spy Tools") >= 0)
			{
				buyWeaponsTable.rows[i].cells[3].setAttribute('colspan', 2);
				continue;
			}
			if(buyWeaponsTable.rows[i].cells[0].innerHTML.indexOf("Sentry Tools") >= 0)
			{
				buyWeaponsTable.rows[i].cells[3].setAttribute('colspan', 2);
				continue;
			}

			if(buyWeaponsTable.rows[i].cells[0].innerHTML.indexOf("Buy Tools") >= 0) continue;
			if(buyWeaponsTable.rows[i].cells.length < 4) continue;

			var buybutId = GetTextIn(buyWeaponsTable.rows[i].cells[3].innerHTML, "name=\"", "\"");
			buyWeaponsTable.rows[i].insertCell(4).innerHTML = "<button id=" + buybutId + " onClick='return false'>0</button>";
			buyWeaponsTable.rows[i].cells[4].align = "center";
			document.getElementById(buybutId).addEventListener('click', function(){ document.getElementsByName(this.id)[0].value = this.innerHTML; ArmoryPHP_UpdateWeaponButtons(); }, false);
			document.getElementsByName(buybutId)[0].addEventListener('blur', ArmoryPHP_UpdateWeaponButtons, false);


		}
	}

    // Add a clear button for the lost weapons log
    lostTable.insertRow(-1).innerHTML = "<td colspan=3 align=center><button id=clearLostLog onClick=\"return false;\" style='width:9ex'>Clear</button></td>";
    document.getElementById('clearLostLog').addEventListener('click', ArmoryPHP_OnClearLostLog, false);


    // Add a buying note on top of the buy table
    buyWeaponsTable.insertRow(1).innerHTML = "<td style='background-color:#222222; border-bottom:0'>Buying:</td>"
                                           + "<td id=BuyingNote colspan=4 style='background-color:#222222; border-bottom:0'>Nothing</td>";

  // Add a clean button to the bottom
    buyWeaponsTable.rows[buyWeaponsTable.rows.length-1].cells[0].innerHTML += "<button id=clearButtonBottom style='float:right; width:9ex; margin-right:6px;' onClick='return false;'>Clear</button>";
    document.getElementsByName('buybut')[0].style.marginRight = "-9ex";
    document.getElementById('clearButtonBottom').addEventListener('click', ArmoryPHP_OnClearBuyButtons, false);
    buyWeaponsTable.rows[buyWeaponsTable.rows.length-1].cells[0].style.backgroundColor = "#222222";


    ArmoryPHP_UpdateWeaponButtons();
}
function TrainPHP()
{
	if(GM_getValue("NSL_eligable", 0) == 0)
	{
		return;
	}

    soldiers = GetSoldiers();

    // Put helper buttons for training, if enabled
	if(GM_getValue("NSL_OptionBH", 0) == 1)
	{
		AddSoldierButton("Attack Specialist", "assign_attack", TrainPHP_OnAssignSoldier);
		AddSoldierButton("Defense Specialist", "assign_defense", TrainPHP_OnAssignSoldier);
		AddSoldierButton("Spy", "assign_spy", TrainPHP_OnAssignSoldier);
		AddSoldierButton("Sentry", "assign_sentry", TrainPHP_OnAssignSoldier);

		document.getElementsByName('train[attacker]')[0].addEventListener('blur', TrainPHP_UpdateTrainingButtons, false);
		document.getElementsByName('train[defender]')[0].addEventListener('blur', TrainPHP_UpdateTrainingButtons, false);
		document.getElementsByName('train[spy]')[0].addEventListener('blur', TrainPHP_UpdateTrainingButtons, false);
		document.getElementsByName('train[sentry]')[0].addEventListener('blur', TrainPHP_UpdateTrainingButtons, false);

		TrainPHP_UpdateTrainingButtons();

	}
    // Fix the training table spannings

    var t = GetTag('th', "Train Your Troops");
    if(t) t.attributes.getNamedItem('colspan').value++;

    t = GetTag('th', "Quantity");
    if(t) t.setAttribute('colspan', 2);

    t = GetElement('input', "Train!");
    if(t) t.parentNode.attributes.getNamedItem('colspan').value++;

	if(GM_getValue("NSL_OptionBH", 0) != 1)
	{
		t = GetTag('td', "Attack Specialist");
		if(t) t.parentNode.innerHTML += "<td>&nbsp;</td>";

		t = GetTag('td', "Defense Specialist");
		if(t) t.parentNode.innerHTML += "<td>&nbsp;</td>";

		t = GetTag('td', "Spy");
		if(t) t.parentNode.innerHTML += "<td>&nbsp;</td>";

		t = GetTag('td', "Sentry");
		if(t) t.parentNode.innerHTML += "<td>&nbsp;</td>";
	}

    t = GetTag('td', "Reassign Attack Specialist");
    if(t) t.parentNode.innerHTML += "<td>&nbsp;</td>";

    t = GetTag('td', "Reassign Defense Specialist");
    if(t) t.parentNode.innerHTML += "<td>&nbsp;</td>";

    // Add a clean button next to the train button
    var input = GetElement('input', "Train!");

    if(input)
    {
        input.parentNode.innerHTML += "<button style=\"margin-left: 6px\" id=clear_training onClick=\"return false;\">Clear</button>";
        document.getElementById('clear_training').addEventListener('click', TrainPHP_ClearTraining, false);

        // Colorize the buttons' row
        input = GetElement('input', "Train!");
        input.parentNode.style.backgroundColor = "#222222";
    }

    // Remove the ! from the Train button (no other spend button has it)
    t = GetElement('input', "Train!");
    if(t) t.value = "Train";

    // Hide the list of techs
    var th = GetTag('th', "Technological Development");

    if(th)
    {
        var table = th.parentNode.parentNode;

        if(table.rows.length > 3)

        {
            table.rows[2].cells[0].innerHTML += "<span id=toggle_techs style=\"float:right;\"><tt>-</tt></span>";
            table.rows[2].addEventListener('click', TrainPHP_OnToggleTechs, false);
            table.rows[2].style.cursor = 'pointer';

            // By default, hide techs
            TrainPHP_OnToggleTechs();
        }
    }

	var x;
	x = FindText(document.body.innerHTML,'upgrade_tech','strength');
	if(x)
	{
		x = FindText(x, "(x "," ");
	}
	else
	{
		// Reseach button is gone, because of highest tech reached
		x = 7.39;

	}

	GM_setValue("NSL_currentTech", x);

    // Get the required exp for the next tech
    var t = GetElement('input', "Research!");
    if(t)
    {
        var str = t.value.toString();
        var pos = str.indexOf(" ", 11);
        var exp = parseInt( str.substring(11, pos).replace(/,/g, ""), 10 );

        GM_setValue("NSL_nextTechExp", exp);
    }
    else
    {
        // highest tech reached?
        GM_setValue("NSL_nextTechExp", -1);
    }



}

function MercsPHP()
{
	if(GM_getValue("NSL_eligable", 0) == 0)
	{
		return;
	}

    soldiers = GetSoldiers();
    mercs = GetAvailableMercs();

    // Put helper buttons for training, if enabled
	if(GM_getValue("NSL_OptionBH", 0) == 1)
	{
		AddSoldierButton("Attack Specialist", "assign_attack", MercsPHP_OnAssignMerc);
		AddSoldierButton("Defense Specialist", "assign_defense", MercsPHP_OnAssignMerc);
		AddSoldierButton("Untrained", "assign_untrained", MercsPHP_OnAssignMerc);

		document.getElementsByName('mercs[attack]')[0].addEventListener('blur', MercsPHP_UpdateMercButtons, false);
		document.getElementsByName('mercs[defend]')[0].addEventListener('blur', MercsPHP_UpdateMercButtons, false);
		document.getElementsByName('mercs[general]')[0].addEventListener('blur', MercsPHP_UpdateMercButtons, false);

		MercsPHP_UpdateMercButtons();
	}

    // Fix the mercs table spannings and shorten some headers
    var t = GetTag('th', "Buy Mercenaries");
    if(t) t.attributes.getNamedItem('colspan').value++;

    t = GetTag('th', "Quantity to Buy");
    if(t) t.setAttribute('colspan', 2);

    t = GetElement('input', "Buy");
    if(t) t.parentNode.attributes.getNamedItem('colspan').value++;

    t =  GetTag('th', "Quantity Available");
    if(t) t.innerHTML = "Available";

    t = GetTag('th', "Quantity to Buy");
    if(t) t.innerHTML = "Quantity";


    // Fix a design bug (main contaioner table is not 100% width in mercs.php)
    document.getElementsByTagName("table")[6].setAttribute('width', '100%');

    // Add a clean button next to the buy button
    var input = GetElement('input', "Buy");

    if(input)
    {
        input.parentNode.innerHTML += "<button style=\"margin-left: 6px\" id=clear_mercs onClick=\"return false;\">Clear</button>";
        document.getElementById('clear_mercs').addEventListener('click', MercsPHP_ClearMercs, false);

        input = GetElement('input', "Buy");
        input.parentNode.style.backgroundColor = "#222222";

		if(document.body.innerHTML.indexOf("There are not enough mercenaries available") > 0)
		{
			MercsPHP_ClearMercs();
		}
    }

}


function StatsPHP()
{
	if(GM_getValue("NSL_eligable", 0) == 0)
	{
		return;
	}

    // Get the statid
    //var endPos = url.indexOf("&");
    //var statid = url.substring(41, endPos > 0 ? endPos : url.length);
    var statid = window['location']['search']['match'](/id=(\d{6,7})/);
    if (!statid) {
        return CustomPage()
    };
    statid = statid[1];
    if (document['body']['innerHTML']['indexOf']('Invalid User ID') > 0) {
        return reportInactive(statid)
    };



	var username = GetText(">Name:<", "<td>", "<").trim();
	InteldetailPHP_CalcReconsLeft(username);
	document.getElementsByName('spyrbut')[0].value = "Recon (" + GM_getValue("NSL_recon_cnt_" + username, 15) + ")";

	document.addEventListener('click', function(event) {

		if(event.target.value)
		{

			if( event.target.value.length > 5)
			{
				var value = String(event.target.value);

				var p = value.indexOf("Raid");
				if(p)
				{
					document.cookie = "attackType=notRaid;";
				}else{
					document.cookie = "attackType=raid;";
				}
			}
		}

	}, true);

    // Gather user specific information
    var commander = GetText(">Commander:<", "<td>", "</td>");
    if(commander != "None") commander = GetText(">Commander:<", "\">", "<");

    var supreme = GetText(">Supreme Commander", "\">", "<");
    if(supreme == "") supreme = "None";

    var chain = GetText(">Chain Name:", "<td>", "</td>");
    if(chain == "") chain = "None";

    var alliance = GetText(">Alliances:", "<b>", "alliances.php?id=", ">", "<");
    if(alliance == "") alliance = "None";

    var treasury = GetText(">Treasury:", "<td>", "</td>").replace(/,/g, "");
    if(treasury == "") treasury = "???";

    var morale = GetText(">Army Morale:", "<td>", "</td>").replace(/,/g, "");

    var race = GetText(">Race:", "<td>", "</td>");

    var rank = GetText("b>Rank:", "<td>", "</td>").replace(/,/g, "");

    var tff = GetText(">Army Size:", "<td>", "</td>").replace(/,/g, "");


    // Add place holders for additional data, such as treasury, tbg, ...
    var userTable = GetTag('th', "User Stats").parentNode.parentNode;
    var treasuryRow = 0;
	var allianceRow = 0;
	var togRow = 0;
    var pastRow = 0;
    for(i = 0; i < userTable.rows.length; i++)
    {

		if(userTable.rows[i].innerHTML.indexOf("Alliances") >= 0)
        {
            allianceRow = i;
        }

        if(userTable.rows[i].innerHTML.indexOf("Army Morale") >= 0)
        {
            if(treasury == "???")
            {
                treasuryRow = userTable.insertRow(i+1);

                treasuryRow.insertCell(0).innerHTML = "<b>Treasury:</b>";
                treasuryRow.insertCell(1).innerHTML = "Loading...";

                togRow = userTable.insertRow(i+2);
                togRow.insertCell(0).innerHTML = "<b>ToG :</b>";
                togRow.insertCell(1).innerHTML = "Loading...";
            }

            var tbgRow = userTable.insertRow(i+3);
            tbgRow.insertCell(0).innerHTML = "<b>TBG (1h):</b>";
            tbgRow.insertCell(1).innerHTML = AddCommas( Math.floor(tff * 120 * (race == "Dwarves" ? 1.2 : (race == "Humans" ? 1.3 : 1))).toString() );

           /* var approveRow = userTable.insertRow(i+4);
            if(GM_getValue("NSL_admin", 1) == 1)
                {
                 approveRow.insertCell(0).innerHTML =  "<td>Approve Target For </td>";
                 approveRow.insertCell(1).innerHTML =  "<td><select id='approvetarget' name='ApproveTarget'><option value='3'>3 Hours</option><option value='6'>6 Hours</option><option value='12'>12 Hours</option><option value='24'>1 Day</option><option value='48'>2 Days</option><option value='72'>3 Days</option><option value='96'>4 Days</option><option value='120'>5 Days</option><option value='144'>6 Days</option><option value='168'>1 Week</option><option value='240'>10 Days</option><option value='336'>2 Weeks</option><option value='504'>3 Weeks</option><option value='772'>4 Weeks</option></select></td>";
                     document.addEventListener('change', function(approve) {
                        if (approve.target.value) {
                            var approveduration = (approve.target.value);
                            alert (approveduration);
                            GM_xmlhttpRequest(
                            {
                              method: "GET",
                              url: NSL_server + "backbone.php?code=approve&whoami=" + NSL_username + "&whoamid=" + NSL_statid + "&password=" + NSL_password + "&target=" + username + "&userid=" + statid + "&duration=" + approveduration,
                                onload: function(r)
                                            {
                                                if(r.status == 200)
                                                {
                                                    alert(r.responseText);	// For Debugging
                                                }
                                            }
                              });
                        }
                    }, true)
                }*/

            if(treasury != "???")
                {
                    var turnshi = "Turns";
                    togRow = userTable.insertRow(i+2);
                    togRow.insertCell(0).innerHTML = "<b>ToG :</b>";
                    togRow.insertCell(1).innerHTML = AddCommas( Math.floor(treasury / (tff * 120 * (race == "Dwarves" ? 1.20 : (race == "Humans" ? 1.3 : 1)))).toString())+ "<span style=\"margin-left: 20px;\">( " + turnshi + " )</span>";;

                }

            break;

        }
    }

    // Add place holders for user's stats
    var th = GetTag('th', "Recent Battles");
    if(!th) th = GetTag('th', "Recent Intelligence");
    if(!th) th = GetTag('th', "Officers");
    if(!th) return;

    var statsTableHtml = "<table width=100% class=table_lines cellspacing=0 cellpadding=6>"
                       + "<tr><th colspan=3>" + username + "'s Stats</th></tr>"
                       + "<tr><td width=30%><b>Strike Action</b></td><td align=right id=DB_sa width=40%>Loading...</td><td align=right id=DB_saTime>&nbsp;</td></tr>"
                       + "<tr><td><b>Defensive Action</b></td><td align=right id=DB_da>Loading...</td><td align=right id=DB_daTime>&nbsp;</td></tr>"
                       + "<tr><td><b>Spy Rating</b></td><td align=right id=DB_spy>Loading...</td><td align=right id=DB_spyTime>&nbsp;</td></tr>"
                       + "<tr><td><b>Sentry Rating</b></td><td align=right id=DB_sentry>Loading...</td><td align=right id=DB_sentryTime>&nbsp;</td></tr>"
                       + "<tr style='background-color:#111100;'><td><b>Total Account Value</b></td><td align=right id=DB_value>Loading...</td><td></td></tr>"                            + "<tr style='background-color:#111100;'><td><b>Last Known Conscription</b></td><td align=right id=DB_up>Loading...</td><td></td></tr>"
    				   + "<tr style='background-color:#111100;'><td><b>30 day History </b></td><td align= right id=olddatas><a href=\"#PastStats\">Click Here!!!</a></td><td></td></tr>"
                       + "</table><br /><br />";

    var statsPlace = th.parentNode.parentNode.parentNode.parentNode;
    statsPlace.innerHTML = statsTableHtml + statsPlace.innerHTML;
    GM_xmlhttpRequest(
      {
          method: "GET",
          url: NSL_server + "backbone.php?code=olddata&whoami=" + NSL_username + "&password=" + NSL_password +  "&whoamid=" + NSL_statid + "&username=" + username
      });

    // Update the database and get details about this target (fill placeholders)
    GM_xmlhttpRequest(
    {
        method: "GET",
        url: NSL_server + "statspage/" + NSL_username  + "/"  + NSL_statid + "/" + NSL_password + "/" + username + "/" + statid + "/" + commander + "/" + supreme + "/" + chain + "/" + alliance + "/" + race  + "/" + treasury + "/" + morale + "/" + rank + "/" + tff,
        onload: function(r)
        {
            if(r.status == 200)
            {

                if(r.responseText.indexOf("Access Denied") >= 0)
                {
                    return;
                }

                document.getElementById('DB_sa').innerHTML = GetTextIn(r.responseText, "[SA]", "[/SA]");
                document.getElementById('DB_da').innerHTML = GetTextIn(r.responseText, "[DA]", "[/DA]");
                document.getElementById('DB_spy').innerHTML = GetTextIn(r.responseText, "[SPY]", "[/SPY]");
                document.getElementById('DB_sentry').innerHTML = GetTextIn(r.responseText, "[SENTRY]", "[/SENTRY]");
                document.getElementById('DB_value').innerHTML = GetTextIn(r.responseText, "[VALUE]", "[/VALUE]");
                document.getElementById('DB_up').innerHTML = GetTextIn(r.responseText, "[UP]", "[/UP]");
                document.getElementById("olddatas").addEventListener('click', OldData, true);


                document.getElementById('DB_saTime').innerHTML = GetTextIn(r.responseText, "[aSA]", "[/aSA]");
                document.getElementById('DB_daTime').innerHTML = GetTextIn(r.responseText, "[aDA]", "[/aDA]");
                document.getElementById('DB_spyTime').innerHTML = GetTextIn(r.responseText, "[aSPY]", "[/aSPY]");
                document.getElementById('DB_sentryTime').innerHTML = GetTextIn(r.responseText, "[aSENTRY]", "[/aSENTRY]");

                var DB_gold = GetTextIn(r.responseText, "[GOLD]", "[/GOLD]");
                var DB_goldTime = GetTextIn(r.responseText, "[aGOLD]", "[/aGOLD]");
                var DB_goldTime1 = GetTextIn(r.responseText, "[aGOLD1]", "[/aGOLD1]");
                var togshit = parseInt(GetTextIn(r.responseText, "[GOLD]", "[/GOLD]").replace(/,/g, ""));
                var turnshit = "Turns";
                //alert(DB_goldTime1);
                // Update treasury
                if(treasuryRow)
                {
                    treasuryRow.cells[1].innerHTML = DB_gold + "<div style=\"display: inline; color: #905000; font-size: 100%; cursor: help;\" title= \"" + DB_goldTime1 + "\">" + "<span style=\"margin-left: 20px;\">( " + DB_goldTime + " )</span></div>";
                    togRow.cells[1].innerHTML = AddCommas( Math.floor((togshit / (tff * 60 * (race == "Dwarves" ? 1.15 : (race == "Humans" ? 1.3 : 1))))*60).toString())+ "<span style=\"margin-left: 20px;\">( " + turnshit + " )</span>";
                }

				// Has alliance title or ap? Then display
				var allianceTitle = GetTextIn(r.responseText, "[TITLE]", "[/TITLE]");
				var alliancePoints = GetTextIn(r.responseText, "[AP]", "[/AP]");
				if(allianceTitle)
				{
					allianceTitleRow = userTable.insertRow(allianceRow+2);

					allianceTitleRow.insertCell(0).innerHTML = "<b>Alliance Title:</b>";
					allianceTitleRow.insertCell(1).innerHTML = allianceTitle + " (" + alliancePoints + ")";

				}



            }
        }
    });

    // Collapse the recent battles and intelligence
    ExpandCollapseTable("Recent Battles");
    ExpandCollapseTable("Recent Intelligence");

    // Remove the ! from make commander button
    var t = GetElement('input', "Make " + username + " my commander!");
    if(t) t.value = "Make " + username + " my commander";

	// Give Send Message button also 2px padding like the Make Commander button has
	var sendMsgButton = GetElement('input', "Send Message");
	if(sendMsgButton) sendMsgButton.style.padding = "2px";

	// Add last message sent
	if(GM_getValue("NSL_OptionShowLastMsgSent", 1) == 1)
	{
		var lastMsgRow = GetElement('input', "Send Message").parentNode.parentNode.parentNode.parentNode;
		if(GM_getValue("NSL_msg_sent_content_" + username, "") != "") // if has msg sent
		{
			lastMsgRow.innerHTML += "<p style=\"font-size: small; margin-top: -15px\"><a href=\"#\" onClick=\"document.getElementById('PMBox').style.visibility = 'visible'; return false;\">Last Msg: " + AttackPHP_GetLastMsgSent(username) + "</a></p>";

			// Box for showing PM
			var PMBox = document.createElement('div');
			PMBox.setAttribute('id', 'PMBox');
			PMBox.style.visibility = 'hidden';
			PMBox.style.position = 'absolute';
			PMBox.style.left = '0';
			PMBox.style.top = '0';
			PMBox.style.width = '100%';
			PMBox.style.height = window.outerHeight;
			PMBox.style.textAlign = 'center';
			PMBox.style.zIndex = '1000';
			PMBox.style.backgroundColor = ' rgba(0,0,0,.75)';
			PMBox.innerHTML = '<div style="width: 600px; margin: 300px auto; padding: 10px; text-align: center;"> \
										<textarea cols="80" rows="12" style="padding: 10px;">' + GM_getValue("NSL_msg_sent_content_" + username, "") + '</textarea><br> \
				<input type="button" onclick="var PMBox = document.getElementById(\'PMBox\'); PMBox.style.visibility = \'hidden\';" value="Close" style="margin-top: 5px; width: 150px; height: 35px; cursor: pointer;"> \
									 </div>';
			document.body.appendChild(PMBox);
		}
		else
		{
			lastMsgRow.innerHTML += "<p style=\"font-size: small; margin-top: -15px\">Last Msg: " + AttackPHP_GetLastMsgSent(username) + "</p>";
		}
	}

    // Redesign the user table
    var userTable = GetTag('th', "User Stats").parentNode.parentNode;

    // Shorten supreme commander
    if(userTable.rows[3].cells[0].innerHTML.indexOf("Supreme") >= 0)
    {
        userTable.rows[3].cells[0].innerHTML = "<b>Supreme:</b>";
    }

    // Merge rank and highest rank rows
    var rowId = GetTableRow(userTable, 0, "Rank:");
    if(rowId >= 0)
    {
        userTable.rows[rowId].cells[1].innerHTML += " &nbsp; ( " + userTable.rows[rowId + 1].cells[1].innerHTML + " )";
        userTable.deleteRow(rowId + 1);
    }

    // Merge buddy status and buddy button rows
    var rowId = GetTableRow(userTable, 0, "Buddy");
    if(rowId >= 0)
    {
        var buddyStatus = userTable.rows[rowId].cells[1].innerHTML;
        buddyStatus = buddyStatus.substring(0, buddyStatus.indexOf(">") + 1);
        buddyStatus = buddyStatus.replace(">", ">&nbsp;&nbsp;");

        var buddyForm = userTable.rows[rowId + 1].cells[0].innerHTML.replace("Recognize player as", "");
        userTable.rows[rowId].innerHTML = "<td><b>Buddy Status:</b></td><td style='padding-top:20px;'>" + buddyForm.replace("post\">", "post\">" + buddyStatus) + "</td>";

        userTable.deleteRow(rowId + 1);
        userTable.deleteRow(rowId - 1); // remove the empty row
    }

    // Collapse the alliances except the primary
    var rowId = GetTableRow(userTable, 0, "Alliances");
    if(rowId >= 0)
    {
        var expandedAlliances = userTable.rows[rowId].cells[1].innerHTML;

        var alliances = expandedAlliances.split(",");
        var primaryAlliance = 0;

        for(i = 0; i < alliances.length; i++)
        {
            if(alliances[i].indexOf("(Primary)") >= 0)
            {
                primaryAlliance = alliances[i];
                break;
            }
        }

        if(primaryAlliance)
        {
            userTable.rows[rowId].cells[1].innerHTML = primaryAlliance;

            if(alliances.length > 1)
            {
                userTable.rows[rowId].cells[1].innerHTML += ", <a style=\"cursor:pointer;\" id=showAlliances>(+)</a>";

                document.getElementById('showAlliances').addEventListener('click',
                    function()
                    {
                        this.parentNode.innerHTML = expandedAlliances;
                    }, false);
            }
        }
    }
        //add old stats option
    var nameRE = /Officers\<\/th\>/ig;
    var q = document.getElementsByTagName('td');
    var statstable;
    var containerx;

    for(var i = 0; i < q.length; i++) {
	if(q[i].innerHTML.match(nameRE) && q[i].className == '') {
	    containerx = q[i];
	    break;
	}
    }


//    shortcuts.setAttribute('colspan', 2);
 //add old stats option
    var nameRE = /Officers\<\/th\>/ig;
    var q = document.getElementsByTagName('td');
    var statstable;
    var containerx;

    for(var i = 0; i < q.length; i++) {
	if(q[i].innerHTML.match(nameRE) && q[i].className == '') {
	    containerx = q[i];
	    break;
	}
    }

}

function OldData() {
    var stuff = document.body.innerHTML;

    var username = FindText(FindText(stuff,"<td><b>Name:</b></td>","</tr>"),"<td>","</td>");

    GM_xmlhttpRequest(
      {
          method: "GET",
          url: NSL_server + "backbone.php?code=olddata&whoami=" + NSL_username + "&password=" + NSL_password +  "&whoamid=" + NSL_statid + "&username=" + username,
            onload: function(r)
            {
                if(r.status == 200)
                {

                    if(r.responseText.indexOf("Access Denied") >= 0)
                    {
                        return;
                    }{
                    document.body.innerHTML = document.body.innerHTML + '<a name="PastStats" id="PastStats"></a>' + r.responseText;
                    document.location = document.URL;
                    }
                }
            }
       });
}

function InteldetailPHP()
{
	if(GM_getValue("NSL_eligable", 0) == 0)
	{
		return;
	}

    var doc = document.body.innerHTML;


    if(doc.indexOf("Your Chief of Intelligence dispatches") >= 0)   // Sab
    {
        if(doc.indexOf("armory undetected,") >= 0) // Sab got through
        {
            var reportId = url.substring(54, url.length);
            var sabbee = GetText("Your spies successfully enter ", "'s");
            var weapon = GetText("attempt to sabotage", "weapons of type ", ".");
            var amount = GetText("and destroy ", " of the ").replace(/,/g, "");
            if(amount == "") amount = 0;
            //var username = sabbee;`
            // Place holder for the logging
            var but = GetElement('input', "Attack / Spy Again");
            but.parentNode.innerHTML = but.parentNode.innerHTML + "<span id=logSab style=\"margin-left: 20px;\">Logging your sab...</span>";
            //AttackPHP_SetSabCnt(username);`
            GM_xmlhttpRequest(
            {
                method: "GET",
                url: NSL_server + "backbone.php?code=logsabs&whoami=" + NSL_username + "&whoamid=" + NSL_statid + "&password=" + NSL_password + "&target=" + sabbee + "&weapon=" + weapon + "&amount=" + amount + "&rid=" + reportId,
                onload: function(r)
                {
                    if(r.status == 200)
                    {
                        document.getElementById('logSab').innerHTML = r.responseText;
                    }
                }
            });
        }
        else    // Sab failed
        {
          //var username = GetText("Your spies attempt to break into ", "'s");
         // AttackPHP_SetSabCnt(username);`
        }

    }
    else    // Recon
    {
        if(doc.indexOf("with the information gathered") >= 0)
        {
            // Record recon
            var reportId = url.substring(54, url.length);
            var username = GetText("your spy sneaks into ", "'s camp");
            var sa = GetText(">Strike Action:<", "\">", "<").replace(/,/g, "");
            var da = GetText(">Defensive Action<", "\">", "<").replace(/,/g, "");
            var spy = GetText(">Spy Rating<", "\">", "<").replace(/,/g, "");
            var sentry = GetText(">Sentry Rating<", "\">", "<").replace(/,/g, "");
            var covert = GetText(">Covert Skill:<", "\">", "<").replace(/,/g, "");
            var spies = GetText(">Spies:<", "\">", "<").replace(/,/g, "");
            var sentries = GetText(">Sentries:<", "\">", "<").replace(/,/g, "");
            var turns = GetText(">Attack Turns:<", "\">", "<").replace(/,/g, "");
            var expir = GetText("td>Experience:<", "\">", "<").replace(/,/g, "");
            var up = GetText(">Unit Production:<", "\">", "<").replace(/,/g, "");
            var siege = GetText(">Siege Technology:<", "\">", "<");
            var tech = GetText(">Technology:<", "\">", "<");
            var econ = GetText(">Economy:<", "\">", "<");
            var treasury = GetText(">Treasury<", "\">", "<").replace(/,/g, "").replace(" Gold", "");
            var statid = GetText("name=\"id\" value=\"", "\"");
			//alert(expir);
			// Reduce one recon count
			AttackPHP_SetReconCnt(username);

          	var armysizetab = GetTag('th', "Army Size:").parentNode.parentNode;

			var soldiers = GetText("<td>Soldiers</td>","</tr>").match(/[^><]+?(?=<|$)/g,"");
			var sasol = armysizetab.rows[3].cells[1].innerHTML.replace(/,/g, "");;
			var dasol = armysizetab.rows[3].cells[2].innerHTML.replace(/,/g, "");;
			var untrained = armysizetab.rows[3].cells[3].innerHTML.replace(/,/g, "");;

            var table = GetTag('th', "Weapons").parentNode.parentNode;

            var BPM = "???";
            var IS = "???";
            var DS = "???";
            var CHR = "???";
            var NUN = "???";
            var LT = "???";
			var SK = "???";
			var GD = "???";
			var GH = "???";
			var TW = "???";
			var CK = "???";

            for(var i = 2; i < table.rows.length; i++)
            {
                if(table.rows[i].cells.length < 4) continue;

                var wepName = table.rows[i].cells[0].innerHTML;
                var wepType = table.rows[i].cells[1].innerHTML;
                var wepCount = table.rows[i].cells[2].innerHTML.replace(/,/g, "");
                var wepStrength = table.rows[i].cells[3].innerHTML.replace(/,/g, "");
                wepStrength = wepStrength.substring(wepStrength.indexOf("/") + 1, wepStrength.length);
				if(wepStrength == "???") wepStrength = table.rows[i].cells[3].innerHTML.replace(/,/g, "").split("/")[0];

                if(wepCount == "???") continue;

                // Find the weapon directly from its name
                if(wepName == "Blackpowder Missile")
                {
                    BPM = wepCount;
                }
                else if(wepName == "Invisibility Shield")
                {
                    IS = wepCount;
                }
                else if(wepName == "Dragonskin")
                {
                    DS = wepCount;
                }
                else if(wepName == "Chariot")
                {
                    CHR = wepCount;
                }
                else if(wepName == "Nunchaku")
                {
                    NUN = wepCount;
                }
                else if(wepName == "Lookout Tower")
                {
                    LT = wepCount;
                }
				else if(wepName == "Skeleton Key")
                {
                    SK = wepCount;
                }
				else if(wepName == "Guard Dog")
                {
                    GD = wepCount;
                }
				else if(wepName == "Grappling Hook")
                {
                    GH = wepCount;
                }
				else if(wepName == "Tripwire")
                {
                    TW = wepCount;
                }
				else if(wepName == "Cloak")
                {
                    CK = wepCount;
                }

                // Find the weapon using type + strength
                if(wepType == "Attack" && wepStrength == "1000")
                {
                    BPM = wepCount;
                }
                else if(wepType == "Attack" && wepStrength == "600")
                {
                    CHR = wepCount;
                }
                if(wepType == "Defend" && wepStrength == "1000")
                {
                    IS = wepCount;
                }
                if(wepType == "Defend" && wepStrength == "256")
                {
                    DS = wepCount;
                }
                if(wepType == "Spy" && wepStrength == "1000")
                {
                    NUN = wepCount;
                }
                if(wepType == "Sentry" && wepStrength == "1000")
                {
                    LT = wepCount;
                }
				if(wepType == "Spy" && wepStrength == "600")
                {
                    SK = wepCount;
                }
				if(wepType == "Sentry" && wepStrength == "250")
                {
                    GD = wepCount;
                }
				if(wepType == "Spy" && wepStrength == "250")
                {
                    GH = wepCount;
                }
				if(wepType == "Sentry" && wepStrength == "140")
                {
                    TW = wepCount;
                }
				if(wepType == "Spy" && wepStrength == "140")
                {
                    CK = wepCount;
                }
            }

			var weapons = "[bpm]" + BPM + "[/bpm][is]" + IS + "[/is][nun]" + NUN + "[/nun][lt]" + LT + "[/lt][ch]" + CHR + "[/ch][ds]" + DS + "[/ds][sk]" + SK + "[/sk][gd]" + GD + "[/gd][gh]" + GH + "[/gh][tw]" + TW + "[/tw][ck]" + CK + "[/ck]";

            // Place holder for the logging
            var th = GetTag('th', "Treasury");
            th.parentNode.parentNode.innerHTML += "<tr><td></td></tr><tr><td style='padding-left: 4ex; border-bottom:0'><a href=attack.php?id=" + statid + "><button>Attack / Spy Again </button></a><span id=logRecon style=\"margin-left: 20px;\">Logging your recon...</span></td></tr>";

            GM_xmlhttpRequest(
            {
                method: "GET",
                url: NSL_server + "reconpage/" + NSL_username  + "/" + NSL_statid + "/" + NSL_password + "/" + username + "/" + sa + "/" + da + "/" + spy  + "/" + sentry + "/" + statid + "/" + treasury + "/" + spies + "/" + sentries + "/" + siege + "/" + tech + "/" + econ + "/" + expir + "/" + covert + "/" + turns + "/" + up + "/" + weapons + "/" + sasol + "/" + dasol + "/" + untrained + "/" + reportId,
                onload: function(r)
                {
                    if(r.status == 200)
                    {
                        document.getElementById('logRecon').innerHTML = r.responseText;
                        //alert(r.responseText);
                    }
                }
            });
        }
        else	// Recon Failed
        {
			var username = GetText("your spy sneaks into ", "'s camp");
            AttackPHP_SetReconCnt(username);

        }
    }
}

function ConquestPHP()
{
	if(GM_getValue("NSL_eligable", 0) == 0)
	{
		return;
	}
}

function AttackPHP()
{

	if(GM_getValue("NSL_eligable", 0) == 0)
	{
		return;
	}

    var doc = document.body.innerHTML;

	// Get the statid
    var endPos = url.indexOf("&");
    var statid = url.substring(42, endPos > 0 ? endPos : url.length);

     if(document.body.innerHTML.indexOf("Invalid User ID") > 0)
	 {
		GM_xmlhttpRequest(
        {
            method: "GET",
            url: NSL_server + "backbone.php?code=inactive&whoami=" + NSL_username + "&password=" + NSL_password + "&whoamid=" + NSL_statid + "&userid=" + statid,
            onload: function(r)
			{
				if(r.status == 200)
				{
					if(r.responseText.indexOf("Access Denied") >= 0)
					{
						return;
					}

					if(r.responseText.length > 0)
					{
					    var td = GetContentTD();

					    td.innerHTML = td.innerHTML.replace("<h3>Error</h3>\nInvalid User ID", r.responseText);
                    }
				}
			}
        });

		return;
    }

	var username = GetText("Target:", "\">", "<");
    if(username == "") return;

	var statid = GetText("Target:", "id=", "\">");
	if(statid == "") return;

	if(doc.indexOf("You can recon a player only 15 times") > 0)
	{
		GM_setValue("NSL_recon_cnt_" + username, 0);
	}



	document.addEventListener('click', function(event) {
		if(event.target.value)
		{
				var value = String(event.target.value);

				var p = value.indexOf("Raid");

				if(p)
				{
					document.cookie = "attackType=notRaid;";
				}else{
					document.cookie = "attackType=raid;";
				}
		}

	}, true);

	// Add how many recons left on target
	InteldetailPHP_CalcReconsLeft(username);
	document.getElementsByName('spyrbut')[0].value = "Recon (" + GM_getValue("NSL_recon_cnt_" + username, 15) + ")";

    // Fix the width of Target: to display the target's name properly
    var t = GetTag('th', "Attack Mission");
    if(t)
    {
        var table = t.parentNode.parentNode;
        table.rows[1].cells[0].width = '50%';
    }

     var th = GetTag('th', "Sabotage Mission");
    if(th) th.parentNode.parentNode.insertRow(1).innerHTML = "<td colspan=2 align=center><input name=spybut0 onclick=\"document.spy.spybut0.value='Sabotaging..'; document.spy.spybut0.disabled=true; document.spy.submit();\" type=submit value=\"Sab!\"></td>";
    document.getElementsByName('spybut')[0].value = "Sab!";

    if(doc.indexOf("has already suffered heavy losses") >= 0)
    {
        GM_xmlhttpRequest(
        {
            method: "GET",
            url: NSL_server + "backbone.php?code=maxed&whoami=" + NSL_username + "&whoamid=" + NSL_statid + "&password=" + NSL_password + "&target=" + username
        });
    }

    // Put an additional +1 / +5 button next to the weapon amount in sab form
    document.getElementsByName('numsab')[0].parentNode.innerHTML += "<button style=\"margin-left: 20px;\" onClick=\"document.spy.numsab.value = parseInt(document.spy.numsab.value, 10) + 1; return false;\">+1</button>"
                                                                  + "<button style=\"margin-left: 20px;\" onClick=\"document.spy.numsab.value = parseInt(document.spy.numsab.value, 10) + 5; return false;\">+5</button>"
      															  + "<button style=\"margin-left: 20px;\" onClick=\"document.spy.numsab.value = parseInt(document.spy.numsab.value, 10) - 1; return false;\">-1</button>";

    // Put an additional +1 button next to the number of spies
    document.getElementsByName('numspies')[0].parentNode.innerHTML += "<button style=\"margin-left: 20px;\" onClick=\"document.spy.numspies.value = parseInt(document.spy.numspies.value, 10) + 1; return false;\">+1</button>" + "<button style=\"margin-left: 20px;\" onClick=\"document.spy.numspies.value = parseInt(document.spy.numspies.value, 10) - 1; return false;\">-1</button>";

    // Add place holders for user's stats and move your stats above the personnel table
    var th = GetTag('th', "<span ");
    var statsPlace = th.parentNode.parentNode.parentNode.parentNode;

    var statsTableHtml = "<table width=100% class=table_lines cellspacing=0 cellpadding=6>"
                       + "<tr><th colspan=3>" + username + "'s Stats</th></tr>"
                       + "<tr><td width=30%><b>Strike Action</b></td><td align=right id=DB_sa width=40%>Loading...</td><td align=right id=DB_saTime>&nbsp;</td></tr>"
                       + "<tr><td><b>Defensive Action</b></td><td align=right id=DB_da>Loading...</td><td align=right id=DB_daTime>&nbsp;</td></tr>"
                       + "<tr><td><b>Spy Rating</b></td><td align=right id=DB_spy>Loading...</td><td align=right id=DB_spyTime>&nbsp;</td></tr>"
                       + "<tr><td><b>Sentry Rating</b></td><td align=right id=DB_sentry>Loading...</td><td align=right id=DB_sentryTime>&nbsp;</td></tr>"                                + "<tr style='background-color:#111100;'><td><b>Recent Gold</b></td><td align=right id=DB_gold>Loading...</td><td align=right id=DB_goldTime>&nbsp;</td></tr>"
                       + "<tr style='background-color:#111100;'><td><b>Total Account Value</b></td><td align=right id=DB_value>Loading...</td><td></td></tr>"
                       + "</table><br />";

  var inventoryTableHtml = "<table width=100% class=table_lines border=0 cellspacing=0 cellpadding=6>"
                           + "<tr><th colspan=5>" + username + "'s Inventory</th></tr>"
                           + "<tr><th class=subh width=30%>Weapon</th><th class=subh colspan=2>Quantity</th><th class=subh width=20%>AAT</th><th class=subh width=1%>&nbsp;</th></tr>"
    					   + "<tr><td>Broken Stick</td><td align=right id=DB_bs>Loading...</td>><td left=right>FakeSab &nbsp;</td><td align=center id=DB_bsFAKE>Loading...</td>"
                           + "<tr><td>Blackpowder Missile</td><td align=right id=DB_bpm>Loading...</td><td left=right id=DB_bpmTime>&nbsp;</td><td align=center id=DB_bpmAat>Loading...</td><td><button weapon=bpm name=removeWeapon>X</button></td>"
                           + "<tr><td>Chariot</td><td align=right id=DB_ch>Loading...</td><td align=left id=DB_chTime>&nbsp;</td><td align=center id=DB_chAat>Loading...</td><td><button weapon=chr name=removeWeapon>X</button></td>"
                           + "<tr><td>Invisibility Shield</td><td align=right id=DB_is>Loading...</td><td align=left id=DB_isTime>&nbsp;</td><td align=center id=DB_isAat>Loading...</td><td><button weapon=ivs name=removeWeapon>X</button></td>"
                           + "<tr><td>Dragonskin</td><td align=right id=DB_ds>Loading...</td><td align=left id=DB_dsTime>&nbsp;</td><td align=center id=DB_dsAat>Loading...</td><td><button weapon=ds name=removeWeapon>X</button></td>"
                           + "<tr><td>Nunchaku</td><td align=right id=DB_nun>Loading...</td><td align=left id=DB_nunTime>&nbsp;</td><td align=center id=DB_nunAat>Loading...</td><td><button weapon=nun name=removeWeapon>X</button></td>"
                           + "<tr><td>Lookout Tower</td><td align=right id=DB_lt>Loading...</td><td align=left id=DB_ltTime>&nbsp;</td><td align=center id=DB_ltAat>Loading...</td><td><button weapon=lt name=removeWeapon>X</button></td>"
						   + "<tr><td>Skeleton Key</td><td align=right id=DB_sk>Loading...</td><td align=left id=DB_skTime>&nbsp;</td><td align=center id=DB_skAat>Loading...</td><td><button weapon=sk name=removeWeapon>X</button></td>"
						   + "<tr><td>Guard Dog</td><td align=right id=DB_gd>Loading...</td><td align=left id=DB_gdTime>&nbsp;</td><td align=center id=DB_gdAat>Loading...</td><td><button weapon=gd name=removeWeapon>X</button></td>"
						   + "<tr><td>Grappling Hook</td><td align=right id=DB_gh>Loading...</td><td align=left id=DB_ghTime>&nbsp;</td><td align=center id=DB_ghAat>Loading...</td><td><button weapon=gh name=removeWeapon>X</button></td>"
						   + "<tr><td>Tripwire</td><td align=right id=DB_tw>Loading...</td><td align=left id=DB_twTime>&nbsp;</td><td align=center id=DB_twAat>Loading...</td><td><button weapon=tw name=removeWeapon>X</button></td>"
						   + "<tr><td>Cloak</td><td align=right id=DB_ck>Loading...</td><td align=left id=DB_ckTime>&nbsp;</td><td align=center id=DB_ckAat>Loading...</td><td><button weapon=ck name=removeWeapon>X</button></td>"
                           + "</table>";


    // Remove the Personnel table, which is useless
    var personnelTableHtml = GetTag('th', "<span").parentNode.parentNode.innerHTML;
    statsPlace.innerHTML = statsPlace.innerHTML.replace(personnelTableHtml, "<br />");

    statsPlace.innerHTML = statsTableHtml + inventoryTableHtml + statsPlace.innerHTML;


    // Add place holders for the target's inventory and the last sab
    var sabotageTable = GetTag('th', "Sabotage Mission").parentNode.parentNode;

    var lastSabRow = sabotageTable.insertRow(sabotageTable.rows.length - 1);
    lastSabRow.insertCell(0).innerHTML = "Last Sab";
    lastSabRow.insertCell(1).innerHTML = "Loading...";
    lastSabRow.cells[0].width = "50%";


	// Add Message Button
	if(GM_getValue("NSL_OptionShowLastMsgSent", 1) == 1)
	{
		var lastMsgRow = sabotageTable.insertRow(sabotageTable.rows.length);
		lastMsgRow.insertCell(0).innerHTML = '<button onclick=\"window.location = \'https://www.kingsofchaos.com/writemail.php?to=' + statid + '\'; return false;\">Send Message</button>';
		if(GM_getValue("NSL_msg_sent_content_" + username, "") != "") // if has msg sent
		{
			lastMsgRow.insertCell(1).innerHTML = "<a href=\"#\" onClick=\"document.getElementById('PMBox').style.visibility = 'visible'; return false;\">Last Msg: " + AttackPHP_GetLastMsgSent(username) + "</a>";

			// Box for showing PM
			var PMBox = document.createElement('div');
			PMBox.setAttribute('id', 'PMBox');
			PMBox.style.visibility = 'hidden';
			PMBox.style.position = 'absolute';
			PMBox.style.left = '0';
			PMBox.style.top = '0';
			PMBox.style.width = '100%';
			PMBox.style.height = window.outerHeight;
			PMBox.style.textAlign = 'center';
			PMBox.style.zIndex = '1000';
			PMBox.style.backgroundColor = ' rgba(0,0,0,.75)';
			PMBox.innerHTML = '<div style="width: 600px; margin: 300px auto; padding: 10px; text-align: center;"> \
										<textarea cols="80" rows="12" disabled="disabled" style="padding: 10px;">' + GM_getValue("NSL_msg_sent_content_" + username, "") + '</textarea><br> \
				<input type="button" onclick="var PMBox = document.getElementById(\'PMBox\'); PMBox.style.visibility = \'hidden\';" value="Close" style="margin-top: 5px; width: 150px; height: 35px; cursor: pointer;"> \
									 </div>';
			document.body.appendChild(PMBox);
		}
		else
		{
			lastMsgRow.insertCell(1).innerHTML = 'Last Msg: ' + AttackPHP_GetLastMsgSent(username);
		}

		lastMsgRow.cells[0].width = "50%";
	}

    // Does the script remembers your sab options? If not, last sab will be taken as the option
    var sabRemember = GM_getValue("NSL_sab_wep_" + username, -1) == -1 ? false : GM_getValue("NSL_sab_wep_" + username, -1);

    // Show additional information about the target
    GM_xmlhttpRequest(
    {
        method: "GET",
        url: NSL_server + "backbone.php?code=aat2&whoami=" + NSL_username + "&password=" + NSL_password + "&whoamid=" + NSL_statid + "&username=" + username,
        onload: function(r)
        {
            if(r.status == 200)
            {

				document.getElementById('DB_sa').innerHTML = GetTextIn(r.responseText, "[SA]", "[/SA]");
                document.getElementById('DB_da').innerHTML = GetTextIn(r.responseText, "[DA]", "[/DA]");
                document.getElementById('DB_spy').innerHTML = GetTextIn(r.responseText, "[SPY]", "[/SPY]");
                document.getElementById('DB_sentry').innerHTML = GetTextIn(r.responseText, "[SENTRY]", "[/SENTRY]");
                document.getElementById('DB_value').innerHTML = GetTextIn(r.responseText, "[VALUE]", "[/VALUE]");

                document.getElementById('DB_saTime').innerHTML = GetTextIn(r.responseText, "[tSA]", "[/tSA]");
                document.getElementById('DB_daTime').innerHTML = GetTextIn(r.responseText, "[tDA]", "[/tDA]");
                document.getElementById('DB_spyTime').innerHTML = GetTextIn(r.responseText, "[tSPY]", "[/tSPY]");
                document.getElementById('DB_sentryTime').innerHTML = GetTextIn(r.responseText, "[tSENTRY]", "[/tSENTRY]");

                document.getElementById('DB_gold').innerHTML = GetTextIn(r.responseText, "[GOLD]", "[/GOLD]");
                document.getElementById('DB_goldTime').innerHTML = GetTextIn(r.responseText, "[tGOLD]", "[/tGOLD]");
                //document.getElementById('weptosab').innerHTML = GetTextIn(r.responseText, "[wSAB]", "[/wSAB]");

                var lastSabber = GetTextIn(r.responseText, "[uSAB]", "[/uSAB]");
                var lastWep = GetTextIn(r.responseText, "[bSAB]", "[/bSAB]");

                lastSabRow.cells[0].innerHTML += "&nbsp;&nbsp;" + GetTextIn(r.responseText, "[tSAB]", "[/tSAB]");
                lastSabRow.cells[1].innerHTML = (lastWep == "" ? "Never" : lastWep + "&nbsp;&nbsp;&nbsp;by " + lastSabber);

              	document.getElementById('DB_bs').innerHTML = GetTextIn(r.responseText, "[BS]", "[/BS]");
                document.getElementById('DB_bpm').innerHTML = GetTextIn(r.responseText, "[BPM]", "[/BPM]");
                document.getElementById('DB_ch').innerHTML = GetTextIn(r.responseText, "[CH]", "[/CH]");
                document.getElementById('DB_is').innerHTML = GetTextIn(r.responseText, "[IS]", "[/IS]");
                document.getElementById('DB_ds').innerHTML = GetTextIn(r.responseText, "[DS]", "[/DS]");
                document.getElementById('DB_nun').innerHTML = GetTextIn(r.responseText, "[NUN]", "[/NUN]");
                document.getElementById('DB_lt').innerHTML = GetTextIn(r.responseText, "[LT]", "[/LT]");
				document.getElementById('DB_sk').innerHTML = GetTextIn(r.responseText, "[SK]", "[/SK]");
				document.getElementById('DB_gd').innerHTML = GetTextIn(r.responseText, "[GD]", "[/GD]");
				document.getElementById('DB_gh').innerHTML = GetTextIn(r.responseText, "[GH]", "[/GH]");
				document.getElementById('DB_tw').innerHTML = GetTextIn(r.responseText, "[TW]", "[/TW]");
				document.getElementById('DB_ck').innerHTML = GetTextIn(r.responseText, "[CK]", "[/CK]");

                document.getElementById('DB_bpmTime').innerHTML = GetTextIn(r.responseText, "[tBPM]", "[/tBPM]");
                document.getElementById('DB_chTime').innerHTML = GetTextIn(r.responseText, "[tCH]", "[/tCH]");
                document.getElementById('DB_isTime').innerHTML = GetTextIn(r.responseText, "[tIS]", "[/tIS]");
                document.getElementById('DB_dsTime').innerHTML = GetTextIn(r.responseText, "[tDS]", "[/tDS]");
                document.getElementById('DB_nunTime').innerHTML = GetTextIn(r.responseText, "[tNUN]", "[/tNUN]");
                document.getElementById('DB_ltTime').innerHTML = GetTextIn(r.responseText, "[tLT]", "[/tLT]");
				document.getElementById('DB_skTime').innerHTML = GetTextIn(r.responseText, "[tSK]", "[/tSK]");
				document.getElementById('DB_gdTime').innerHTML = GetTextIn(r.responseText, "[tGD]", "[/tGD]");
				document.getElementById('DB_ghTime').innerHTML = GetTextIn(r.responseText, "[tGH]", "[/tGH]");
				document.getElementById('DB_twTime').innerHTML = GetTextIn(r.responseText, "[tTW]", "[/tTW]");
				document.getElementById('DB_ckTime').innerHTML = GetTextIn(r.responseText, "[tCK]", "[/tCK]");

                document.getElementById('DB_bsFAKE').innerHTML = GetTextIn(r.responseText, "[bBS]", "[/bBS]");
                document.getElementById('DB_bpmAat').innerHTML = GetTextIn(r.responseText, "[bBPM]", "[/bBPM]");
                document.getElementById('DB_chAat').innerHTML = GetTextIn(r.responseText, "[bCH]", "[/bCH]");
                document.getElementById('DB_isAat').innerHTML = GetTextIn(r.responseText, "[bIS]", "[/bIS]");
                document.getElementById('DB_dsAat').innerHTML = GetTextIn(r.responseText, "[bDS]", "[/bDS]");
                document.getElementById('DB_nunAat').innerHTML = GetTextIn(r.responseText, "[bNUN]", "[/bNUN]");
                document.getElementById('DB_ltAat').innerHTML = GetTextIn(r.responseText, "[bLT]", "[/bLT]");
				document.getElementById('DB_skAat').innerHTML = GetTextIn(r.responseText, "[bSK]", "[/bSK]");
				document.getElementById('DB_gdAat').innerHTML = GetTextIn(r.responseText, "[bGD]", "[/bGD]");
				document.getElementById('DB_ghAat').innerHTML = GetTextIn(r.responseText, "[bGH]", "[/bGH]");
				document.getElementById('DB_twAat').innerHTML = GetTextIn(r.responseText, "[bTW]", "[/bTW]");
				document.getElementById('DB_ckAat').innerHTML = GetTextIn(r.responseText, "[bCK]", "[/bCK]");

                // Update button meanings in the inventory table
                var aatButtons = document.getElementsByName("aatButton");

                for(i = 0; i < aatButtons.length; i++)
                {
                    aatButtons[i].addEventListener('click', function()
                                                            {
                                                                document.getElementsByTagName('select')[0].value = GetText("label=\"" + this.getAttribute("weapon").trim() + "\"", "value=\"", "\"");
                                                                document.getElementsByName('numsab')[0].value = parseInt(this.innerHTML.replace(/,/g, ""));

                                                            }, false);

                    if(i == 0)    // skip the last sabber button
                        continue;

                    aatButtons[i].style.width = "80%";
                }


                // If the script cannot remember the sab options agains this opponent, take the last sab
                if(!sabRemember)
                {
                    if(aatButtons.length == 7)  // if there is a last sab
                    {
                        aatButtons[0].click();
                    }
                    else    // if there is no last sab, take LT/BROKENSTICK aat
                    {
						document.getElementsByTagName('select')[0].value = parseInt(69);
						document.getElementsByName('numsab')[0].value = 1;
                        aatButtons[5].click();
                    }
                }


				// Remove Weapons buttons
				var removeButtons = document.getElementsByName("removeWeapon");

				for(i = 0; i < removeButtons.length; i++)
				{
					removeButtons[i].addEventListener('click', function()
																{
																	GM_xmlhttpRequest(
																	{
																		method: "POST",
																		url: NSL_server + "backbone.php",
																		headers: { 'Content-type' : 'application/x-www-form-urlencoded' },
																		data: encodeURI("code=removeWeapon&whoami=" + NSL_username + "&password=" + NSL_password + "&whoamid=" + NSL_statid + "&target=" + username + "&weapon=" + this.getAttribute("weapon")),
																		onload: function(r)
																		{

																			if(r.status != 200) return;
																			location.reload(true);
																		}
																	});
																}, false);
				}
            }
        }
    });

    // Remember sabotage settings for this target
    document.getElementsByTagName('select')[0].value = GM_getValue("NSL_sab_wep_" + username, 69);
	document.getElementsByName('numsab')[0].value = GM_getValue("NSL_sab_cnt_" + username, 1);
    document.getElementsByName('numspies')[0].value = GM_getValue("NSL_sab_spies_" + username, 1);
    //document.getElementsByTagName('select')[1].value = GM_getValue("NSL_sab_turns_" + username, 5);
    // Lower aat if cannot get through
    if(document.body.innerHTML.indexOf("you will never be able to get away") > 0)
    {
		if(document.getElementsByName('numsab')[0].value > 0)
        {
            document.getElementsByName('numsab')[0].value -= 1;
        }
    }

    // Listen the sab form
    //document.getElementsByTagName('form')[2].addEventListener('submit', function() { AttackPHP_OnSubmitSab(username); }, false);
	document.getElementsByName("spybut")[0].addEventListener('click', function() { AttackPHP_OnSubmitSab(username); }, false);
	//document.getElementsByName("spybut0")[0].addEventListener('click', function() { AttackPHP_OnSubmitSab(username); }, false);

	// spybut spybut0
}

function BattlefieldPHP()
{
	if(GM_getValue("NSL_eligable", 0) == 0)
	{
		return;
	}

    // Disable ajax navigation on koc
    GetContentTD().innerHTML = GetContentTD().innerHTML;

    // Find the bf table
    var tables = document.getElementsByClassName("table_lines battlefield");
    if(tables.length == 0) return;

    bfTable = tables[0];

    // Add next and back buttons at top
    if(bfTable.rows.length > 11)
    {
        bfTable.insertRow(1).innerHTML = bfTable.rows[bfTable.rows.length - 1].innerHTML;
        bfTable.rows[1].style.backgroundColor = "#222222";
    }
    bfTable.rows[bfTable.rows.length - 1].style.backgroundColor = "#222222";

    // Dont let the alliance column dominate
    bfTable.rows[0].cells[1].width = "15%";

    // Log bf gold
    var logList = "";

    for(var i = 0; i < bfTable.rows.length; i++)
    {
        if(bfTable.rows[i].cells.length != 7) continue;

        var usernameInner = bfTable.rows[i].cells[2].innerHTML;
        var username = GetTextIn(usernameInner, ">", "<");
        var statid = GetTextIn(usernameInner, "id=", "\"");

        var tff = bfTable.rows[i].cells[3].innerHTML.replace(/,/g, "");
		var race = bfTable.rows[i].cells[4].innerHTML.trim();
        var treasury = bfTable.rows[i].cells[5].innerHTML.replace(/,/g, "").replace(" Gold", "");
        var rank = bfTable.rows[i].cells[6].innerHTML.replace(/,/g, "");

        logList += "#username=" + username + "*gold=" + treasury + "*tff=" + tff + "*userid=" + statid + "*rank=" + rank + "*race=" + race;

        // Also make username links open in new tab
        bfTable.rows[i].cells[2].innerHTML = bfTable.rows[i].cells[2].innerHTML.replace("href=", "target=_blank href=");
    }

    var statDiv = document.createElement('div');
    statDiv.setAttribute('id', "statDiv");
    statDiv.setAttribute('style', "text-align:center; position:fixed; right:10px; bottom:10px; width:15ex; border:1px solid gray; background-color:black; color:white; font-size:10pt;");
    statDiv.innerHTML = "Loading...";
    document.body.appendChild(statDiv);

    GM_xmlhttpRequest(
    {
        method: "POST",
        url: NSL_server + "backbone.php",
        headers: { 'Content-type' : 'application/x-www-form-urlencoded' },
	    data: encodeURI("code=logbattlefield&whoami=" + NSL_username + "&password=" + NSL_password + "&whoamid=" + NSL_statid + "&fill=" + GM_getValue("NSL_fillBattlefield", 1) + "&list=" + logList),
        onload: function(r)
        {

            if(r.status != 200) return;

            if(GM_getValue("NSL_fillBattlefield", 1) != 1) return;

            document.getElementById('statDiv').innerHTML = "Loaded!";

            for(var i = 0; i < bfTable.rows.length; i++)
            {
                if(bfTable.rows[i].cells.length != 7) continue;

                var username = GetTextIn(bfTable.rows[i].cells[2].innerHTML, ">", "<");
                var data = GetTextIn(r.responseText, "[" + username + "]", "[/" + username + "]");

                if(data == "") continue;

                if(bfTable.rows[i].cells[5].innerHTML == "??? Gold")
                {
                    bfTable.rows[i].cells[5].innerHTML =  GetTextIn(data, "[aGOLD]", "[/aGOLD]") + " &nbsp <span style='color:yellow'>" + GetTextIn(data, "[GOLD]", "[/GOLD]") + "</span> Gold";
                }

                var sa = GetTextIn(data, "[SA]", "[/SA]");
                var da = GetTextIn(data, "[DA]", "[/DA]");
                var spy = GetTextIn(data, "[SPY]", "[/SPY]");
                var sentry = GetTextIn(data, "[SENTRY]", "[/SENTRY]");

                var saTime = GetTextIn(data, "[aSA]", "[/aSA]");
                var daTime = GetTextIn(data, "[aDA]", "[/aDA]");
                var spyTime = GetTextIn(data, "[aSPY]", "[/aSPY]");
                var sentryTime = GetTextIn(data, "[aSENTRY]", "[/aSENTRY]");

                var player = [username, sa, saTime, da, daTime, spy, spyTime, sentry, sentryTime];
                bfPlayers[i] = player;

                bfTable.rows[i].addEventListener('mouseover', BattlefieldPHP_OnShowStat, true);
                bfTable.rows[i].addEventListener('mouseout', function(){ document.getElementById('statDiv').style.display = 'none'; }, true);
            }
        }
    });

    // Add an option to fill the battlefield
    bfTable.rows[0].cells[0].innerHTML = "<input type=checkbox id=FillBattlefield " + (GM_getValue("NSL_fillBattlefield", 1) == 1 ? "checked" : "") + "><label for=FillBattlefield>Fill BF</label>";
    document.getElementById('FillBattlefield').addEventListener('click', function(){ GM_setValue("NSL_fillBattlefield", this.checked ? 1 : 0); window.location = window.location; }, false);

    if(GM_getValue("NSL_fillBattlefield", 1) != 1)
    {
        statDiv.innerHTML = "Logged!";
	}
}

function BattlefieldPHP_OnShowStat()
{
    var username = GetTextIn(this.cells[2].innerHTML, ">", "<");

    var idx = -1;

    for(var i = 0; i < bfPlayers.length; i++)
    {
        if(bfPlayers[i] && bfPlayers[i][0] == username)
        {
            idx = i;
            break;
        }
    }

    if(idx < 0) return;

    var sa = bfPlayers[idx][1];
    var da = bfPlayers[idx][3];
    var spy = bfPlayers[idx][5];
    var sentry = bfPlayers[idx][7];

    var saTime = bfPlayers[idx][2];
    var daTime = bfPlayers[idx][4];
    var spyTime = bfPlayers[idx][6];
    var sentryTime = bfPlayers[idx][8];

    var statDiv = document.getElementById('statDiv');

    statDiv.innerHTML = "<table width=100% class=table_lines cellspacing=0 cellpadding=6>"
                      + "<tr><th colspan=3>" + username + "'s Stats</th></tr>"
                      + "<tr><td><b>Attack</b></td><td align=right id=DB_sa>" + sa + "</td><td align=right id=DB_saTime>" + saTime + "</td></tr>"
                      + "<tr><td><b>Defense</b></td><td align=right id=DB_da>" + da + "</td><td align=right id=DB_daTime>" + daTime + "</td></tr>"
                      + "<tr><td><b>Spy</b></td><td align=right id=DB_spy>" + spy + "</td><td align=right id=DB_spyTime>" + spyTime + "</td></tr>"
                      + "<tr><td><b>Sentry</b></td><td align=right id=DB_sentry>" + sentry + "</td><td align=right id=DB_sentryTime>" + sentryTime + "</td></tr>"
                      + "</table>";

    statDiv.style.width = "60ex";
    statDiv.style.display = '';
}

function DetailPHP()
{
	if(GM_getValue("NSL_eligable", 0) == 0)
	{
		return;
	}


    if(url.indexOf("suspense=1") >= 0)
    {
        // Remove suspense
        /*var th = GetTag('th', "Battle Report");
        var content = th.parentNode.parentNode.parentNode.parentNode.parentNode;
        var scriptSource = GetTextIn(content.innerHTML, "<script", "</script>");


        if(scriptSource != "")
        {
            var content2 = content.innerHTML.replace(scriptSource, ">");

            content2 = content2.replace("table_lines battle", "table_lines");
			content2 = content2.replace(/display: none/g, "");

            content.innerHTML = content2;
        }*/
		var con = document.getElementsByClassName('table_lines battle');
		con[0].className = "table_lines";
		var con2 =   document.getElementsByClassName('report');
		con2[0].removeAttribute("style");
    }

    // Scroll down to the useful part
    var but = GetElement('input', "Attack / Spy Again");
    but.scrollIntoView();

    // Log the attack
    var attackType = GetText("your soldiers are trained ", " specialists");
    if(attackType != "attack")
    {
        // Log only attacks from our players ;)
        return;
    }

    var reportId = url.indexOf("suspense") >= 0 ? GetTextIn(url, "_id=", "&suspense") : url.substring(49, url.length);
    var treasury = 0;
    var opponent = GetText("casualties!",">", "'s forces").trim();
	opponent = opponent.split("\n")[1];

    var result = document.body.innerHTML.indexOf("You <font ") > 0 ? "Successful" : "Defended";

    if(document.body.innerHTML.indexOf("You stole") >= 0)
    {
        treasury = parseInt( GetText("You stole", ">", "<").replace(/,/g, "") );

        // Add a shortcut to armory
        but.parentNode.innerHTML += "<a href='https://www.kingsofchaos.com/armory.php' style='border: 1px solid #888888; background: black; font-size: 10pt; color: white; padding: 1px 10px;'>  Armory</a>";
        but = GetElement('input', "Attack / Spy Again");
    }

	var untrained = 0;

	if(document.body.innerHTML.indexOf("untrained soldiers with weapons and ") >= 0)
	{
		untrained += parseInt(GetText("The enemy has <b>","</b> untrained soldiers").replace(/,/g,""));
		untrained += parseInt(GetText("untrained soldiers with weapons and <b>","</b> with no weapons").replace(/,/g,""));
	}


	if(document.body.innerHTML.indexOf(">None</font> of the enemy's ") >= 0)
	{
		if(GetText("None</font> of the enemy's "," untrained soldiers have weapons"))
		{
			untrained += parseInt(GetText("None</font> of the enemy's "," untrained soldiers have weapons").replace(/,/,""));
		}
	}

	var elost = 0;
	if(document.body.innerHTML.indexOf("The enemy sustains ") >= 0)
	{
		elost = parseInt(String(FindText(GetText('The enemy sustains','/fon'),">","<")).replace(/,/g, ''));
	}

    // Add a place golder for the result of the logging
    but.parentNode.innerHTML = but.parentNode.innerHTML.replace("Attack / Spy Again", "Attack / Spy Again") + "<span id=logAttack style=\"margin-left: 20px;\">Logging your attack...</span>";


	if ( Get_Cookie("attackType") == "raid" )
	{
		var aType = "raid";
	}else if(treasury > 1)
	{
		var aType = "succesful";
	}else{
		var aType = "defended";
	}


	document.cookie = "attackType=notRaid;";

    GM_xmlhttpRequest(
    {
        method: "GET",
        url: NSL_server + "backbone.php?code=logattacks&whoami=" + NSL_username + "&password=" + NSL_password + "&whoamid=" + NSL_statid + "&target=" + opponent + "&result=" + result + "&gold=" + treasury + "&untrained=" + untrained + "&rid=" + reportId + "&type=" + aType + "&elost=" + elost,
        onload: function(r)
        {
            if(r.status == 200)
            {
                document.getElementById('logAttack').innerHTML = r.responseText;
            }
        }
    });
}

function WritemailPHP()
{
	var username = GetTextIn(document.body.innerHTML, "</b>", "</th").trim();

	document.getElementsByTagName('textarea')[0].value = GM_getValue("NSL_msg_sig", "");

	// If send button is clicked, save time
	document.addEventListener('click', function(event) {
	if(event.target.value)
	{
			var value = String(event.target.value);
			if(value.indexOf("Send") == 0)
			{
				GM_setValue("NSL_msg_sent_time_" + username, getCurrentTime());
				GM_setValue("NSL_msg_sent_content_" + username, document.getElementsByTagName('textarea')[0].value);
			}
	}

	}, true);
}

function AttackLogPHP()
{

    // Disable ajax navigation on koc
    GetContentTD().innerHTML = GetContentTD().innerHTML;

    // Find the bf table
    var tables = document.getElementsByClassName("table_lines attacklog");
    if(tables.length == 0) return;

    inTable = tables[0];

	//Log incoming attacks
	var logIncoming = "";

	for(var i = 2; i < inTable.rows.length; i++)
    {
        if(inTable.rows[i].cells.length != 9) continue;
		var time = inTable.rows[i].cells[0].innerHTML;
		var timeunit = inTable.rows[i].cells[1].innerHTML;

		time = timeToSeconds(time,timeunit);

		var usernameInner = inTable.rows[i].cells[2].innerHTML;
		var username = GetTextIn(usernameInner, ">","<");
		var statid = GetTextIn(usernameInner, "?id=", "\"");
		var type = inTable.rows[i].cells[3].innerHTML.trim();
		var resultInner = inTable.rows[i].cells[4].innerHTML;
		var result = GetTextIn(resultInner, ">", "<");
		var resultid = GetTextIn(resultInner, "attack_id=", "\"");
		var gold = 0;

		if(result != "Attack defended")
		{
			result = "Successful";
			gold = GetTextIn(resultInner, ">", "<").replace(/,/g, "").replace(" Gold stolen", "");
		}

		var elost = inTable.rows[i].cells[5].innerHTML.replace(/,/g, "");
		var ulose = inTable.rows[i].cells[6].innerHTML.replace(/,/g, "");


		//logIncoming += "#username=" + username + "*userid=" + statid + "*type=" + type + "*result=" + result + "*gold=" + gold + "*resultid=" + resultid + "*elost=" + elost + "*ulose=" + ulose + "*time=" + time;

        var statDiv = document.createElement('div');
        statDiv.setAttribute('id', "statDiv");
        statDiv.setAttribute('style', "text-align:center; position:fixed; right:10px; bottom:10px; width:15ex; border:1px solid gray; background-color:black; color:white; font-size:10pt;");
        statDiv.innerHTML = "Logged";
        document.body.appendChild(statDiv);

         GM_xmlhttpRequest(
        {
            method: "POST",
            url: NSL_server + "backbone.php",
            headers: { 'Content-type' : 'application/x-www-form-urlencoded' },
            data: encodeURI("code=logincomingattack&whoami=" + NSL_username + "&password=" + NSL_password + "&whoamid=" + NSL_statid + "&username=" + username + "&userid=" + statid + "&type=" + type + "&result=" + result + "&gold=" + gold + "&resultid=" + resultid + "&elost=" + elost + "&ulose=" + ulose + "&time=" + time),
            onload: function(r)
            {

                if(r.status != 200) return;
                //alert(r.responseText);
                document.getElementById('statDiv').innerHTML = "Logged!";

            }

        });
    }

}


function InboxPHP()
{
	// Create Set Signature Button
	var setSignature = GetElement('input', "Delete Entire Inbox").parentNode.parentNode;
	setSignature.innerHTML = '<button onclick="document.getElementById(\'signatureBox\').style.visibility = \'visible\'; return false;" style="float: right; margin-left: 15px;">Set Signature</button>' + setSignature.innerHTML;

	// Box for Signature Editing
	var signatureBox = document.createElement('div');
	signatureBox.setAttribute('id', 'signatureBox');
	signatureBox.style.visibility = 'hidden';
	signatureBox.style.position = 'absolute';
	signatureBox.style.left = '0';
	signatureBox.style.top = '0';
	signatureBox.style.width = '100%';
	signatureBox.style.height = window.outerHeight;
	signatureBox.style.textAlign = 'center';
	signatureBox.style.zIndex = '1000';
	signatureBox.style.backgroundColor = ' rgba(0,0,0,.75)';
	signatureBox.innerHTML = '<div style="width: 600px; margin: 300px auto; padding: 10px; text-align: center;"> \
								<h1>EDIT SIGNATURE</h1> \
								<textarea id="signature" cols=60 rows=8>' + GM_getValue("NSL_msg_sig", "") + '</textarea><br> \
		<input type="button" onclick="var signatureBox = document.getElementById(\'signatureBox\'); signatureBox.style.visibility = \'hidden\';" value="Save Signature" style="margin-top: 5px; width: 150px; height: 35px;"> \
							 </div>';
	document.body.appendChild(signatureBox);

	// Save signature when clicked on Save button
	document.addEventListener('click', function(event) {
	if(event.target.value)
	{
			var value = String(event.target.value);
			if(value.indexOf("Save Signature") == 0)
			{
				GM_setValue("NSL_msg_sig", document.getElementById('signature').value);
			}
	}

	}, true);
}

function RecruitPHP()
{
  		var fuck = GetText("<a href=\"stats.php?id=", "</b>");
  		var username = GetTextIn(fuck , ">","<");
        var kocid = GetText("<a href=\"stats.php?id=", '"');
        var recruitid= document.URL.substring( document.URL.indexOf("=") +1 );
        //alert(kocid + " " + recruitid + " " + username);

        GM_xmlhttpRequest(
        {
            method: "POST",
            url: NSL_server + "backbone.php",
            headers: { 'Content-type' : 'application/x-www-form-urlencoded' },
            data: encodeURI("code=addrecruitid&whoami=" + NSL_username + "&password=" + NSL_password + "&whoamid=" + NSL_statid + "&kocid=" + kocid + "&recruitid=" + recruitid + "&username=" + username),
            onload: function(r)
            {
                if(r.status != 200) return;
                //alert(r.responseText);
            }
        });
}

/*****************************************************************************/
/********************************* FUNCTIONS *********************************/
/*****************************************************************************/

function AddCommas(val)
{
    var val2 = "";

    for(var i = val.length - 1, j = 1; i >= 0; i--, j++)
    {
        val2 += val[i];

        if(j % 3 == 0 && i)
        {
            val2 += ",";
        }
    }

    var val3 = "";

    for(var i = val2.length - 1; i >= 0; i--)
    {
        val3 += val2[i];
    }

    return val3;
}

//first n-1 args are 'begin', last one is end, should send at least 2 args
function GetText()
{
    var doc = document.body.innerHTML;

    var pos = 0;

    for(var z = 0; z < (arguments.length - 1); z++)
    {
        pos = doc.indexOf(arguments[z], pos);
        if(pos < 0) return "";

        pos += arguments[z].length;
    }

    var pos2 = doc.indexOf(arguments[arguments.length - 1], pos);
    if(pos2 < 0) return "";

    return doc.substring(pos, pos2);
}

//the very first argumant is the text to search in, the rest is the same as GeText
function GetTextIn()
{
    var pos = 0;

    for(var i = 1; i < (arguments.length - 1); i++)
    {
        pos = arguments[0].indexOf(arguments[i], pos);
        if(pos < 0) return "";

        pos += arguments[i].length;
    }

    var pos2 = arguments[0].indexOf(arguments[arguments.length - 1], pos);
    if(pos2 < 0) return "";

    return arguments[0].substring(pos, pos2);
}

function GetTag(tag, inner)
{
    var tagList = document.getElementsByTagName(tag);

    for(var z = 0; z < tagList.length; z++)
    {
        if(tagList[z].innerHTML.indexOf(inner) == 0)
        {
            return tagList[z];
        }
    }

    return 0;
}

function GetElement(elem, val)
{
    var elemList = document.getElementsByTagName(elem);

    for(var i = 0; i < elemList.length; i++)
    {
        if(elemList[i].value.toString().indexOf(val) == 0)
        {
            return elemList[i];
        }
    }

    return 0;
}

function GetTable(thInner)
{
    var th = GetTag('th', thInner);
    if(!th) return 0;

    return th.parentNode.parentNode;
}

// returns 0-based index
function GetTableRow(table, cellId, inner)
{
    for(var i = 0; i < table.rows.length; i++)
    {
        if(table.rows[i].cells[cellId].innerHTML.indexOf(inner) >= 0)
        {
            return i;
        }
    }

    return -1;
}

function GetContentTD()
{
    var tables = document.getElementsByClassName("content");
    if(tables.length == 0) return 0;

    return tables[0];
}

// Convert ms to ... ago
function PrintableTime(elapsedMs)
{
    var secs = elapsedMs / 1000;

    var months = parseInt( Math.floor(secs / 2592000) );
    secs -= months * 2592000;

    var days = parseInt( Math.floor(secs / 86400) );
    secs -= days * 86400;

    var hours = parseInt( Math.floor(secs / 3600) );
    secs -= hours * 3600;

    var minutes = parseInt( Math.floor(secs / 60) );
    secs -= minutes * 3600;

    secs = parseInt( Math.floor(secs) );

    var str = "";

    if(months > 0) str += (months + " month" + (months > 1 ? "s " : " "));
    if(days > 0) str += (days + " day" + (days > 1 ? "s " : " "));
    if(hours > 0) str += (hours + " hour" + (hours > 1 ? "s " : " "));
    if(minutes > 0) str += (minutes + " minute" + (minutes > 1 ? "s " : " "));
    if(secs > 0) str += (secs + " second" + (secs > 1 ? "s " : " "));

    return str.trim();
}

function GetGold()
{
    var goldText = GetText("Gold:", ">", "<");
    if(goldText == "") return 0;

    return parseInt( goldText.trim().replace(/,/g, "").replace('M', '000000') );
}

function GetSoldier(type)
{
    var soldierText = GetText(type, "right\">", "<");
    if(soldierText == "") return 0;

    return parseInt( soldierText.replace(/,/g, "") );
}

function GetSoldiers()
{
    var tas = GetSoldier("Trained Attack Soldiers");
    var tam = GetSoldier("Trained Attack Mercenaries");
    var tds = GetSoldier("Trained Defense Soldiers");
    var tdm = GetSoldier("Trained Defense Mercenaries");
    var us  = GetSoldier("Untrained Soldiers");
    var um  = GetSoldier("Untrained Mercenaries");
    var spy = GetSoldier("Spies");
    var sentry = GetSoldier("Sentries");
    var tff = GetSoldier("Total Fighting Force");

    return {'tas' : tas, 'tam' : tam, 'tds' : tds, 'tdm' : tdm, 'us' : us, 'um' : um, 'spy' : spy, 'sentry' : sentry, 'tff' : tff};
}

function GetAvailableMerc(type)
{
    var mercText = GetText('>' + type + '<', "right\">", "right\">", "<");
    if(mercText == "None" || mercText == "") return 0;

    return parseInt( mercText.replace(/,/g, "") );
}

function GetAvailableMercs()
{
    var am = GetAvailableMerc("Attack Specialist");
    var dm = GetAvailableMerc("Defense Specialist");
    var um = GetAvailableMerc("Untrained");

    return {'am' : am, 'dm' : dm, 'um' : um};
}

function AddSoldierButton(soldierName, buttonId, callback)
{
    var td = GetTag('td', soldierName);

    if(td)
    {
        td.parentNode.innerHTML += "<td><button id=" + buttonId + " onClick=\"return false;\">0</button></td>";

        document.getElementById(buttonId).addEventListener('click', callback, false);
    }
}

function ExpandCollapseTable(header, collapse)
{
    var th = GetTag('th', header);
    if(!th) return;

    th.innerHTML += "<span id=toggle_" + header.replace(/ /g, "_") + " style=\"float:right\"><tt>-</tt></span>";

    var table = th.parentNode.parentNode;

    table.rows[0].addEventListener('click', function(){ OnExpColTable(header); }, false);
    table.rows[0].style.cursor = "pointer";

    // Set the initial state
    if(collapse == undefined)
    {
        collapse = GM_getValue("NSL_expcol_" + header.replace(/ /g, "_"), 1) == 0;    // 1: expanded, 0: collapsed
    }

    if(collapse)
    {
        OnExpColTable(header);
    }
}

function OnExpColTable(header)
{
    var th = GetTag('th', header);
    if(!th) return;

    var table = th.parentNode.parentNode;

    if(table.rows.length < 2) return;

    var disp = (table.rows[1].style.display == "none" ? "" : "none");

    for(var i = 1; i < table.rows.length; i++)
    {
        table.rows[i].style.display = disp;
    }

    document.getElementById('toggle_' + header.replace(/ /g, "_")).innerHTML = "<tt>" + (disp == "none" ? "+" : "-") + "</tt>";

    GM_setValue("NSL_expcol_" + header.replace(/ /g, "_"), disp == "none" ? 0 : 1);
}

function checkVersion()
{
	var lastCheck = GM_getValue("NSL_LastUpdateCheck_time", "");
	if(lastCheck == "")
	{
		GM_xmlhttpRequest(
		{
			method: "GET",
			url: NSL_server + "version.php?ver=" + NSL_version,
			onload: function(r)
			{
				if(r.status != 200) return;
				GM_setValue("NSL_LastUpdateCheck_time", getCurrentTime());
			}
		});
		GM_setValue("NSL_LastUpdateCheck_time", getCurrentTime());
	}
	else
	{
		if(getCurrentTime() - lastCheck > 600)
		{
			GM_xmlhttpRequest(
			{
				method: "GET",
				url: NSL_server + "version.php?ver=" + NSL_version,
				onload: function(r)
				{
					if(r.status != 200) return;
					var ver = GetTextIn(r.responseText, "[VER]", "[/VER]");
					var dlink = GetTextIn(r.responseText, "[LINK]", "[/LINK]");
					var changelog = GetTextIn(r.responseText, "[CHANGELOG]", "[/CHANGELOG]");
					if(NSL_version != ver) alert("You're using an old version of the script!\n----Changelog----\n " + changelog), GM_openInTab(dlink);
					GM_setValue("NSL_LastUpdateCheck_time", getCurrentTime());
				}
			});
			GM_setValue("NSL_LastUpdateCheck_time", getCurrentTime());
		}
	}
}

function getCurrentTime()
{
	return Math.round(new Date / 1E3);
}

function timeToSeconds (time, timeunit) {
    if (timeunit.match('minute'))
    {
      time = time * 60;
    }
    else if (timeunit.match('hour'))
    {
      time = time * 60*60;
    }
    else if (timeunit.match('day'))
    {
      time = time * 60*60*24;
    }
    else if (timeunit.match('week'))
    {
      time = time * 60*60*24*7;
    }
    else { time = time; }
    return time;
}

function AddMenuItems()
{
    var table = GetTag('td', "<img src=\"/images/menubar/Era").parentNode.parentNode;

    table.insertRow(3).insertCell(0).innerHTML = "<a href=\"https://www.kingsofchaos.com/stats.php?id=targetlist\"><img alt=\"Target List\" src=\"" + NSL_server + "images/menubar_targets.gif\"></a>";
    table.insertRow(4).insertCell(0).innerHTML = "<a href=\"https://www.kingsofchaos.com/stats.php?id=farmlist\"><img alt=\"Farm List\" src=\"" + NSL_server + "images/menubar_farmlist.gif\"></a>";
    table.insertRow(13).insertCell(0).innerHTML = "<a href=\"https://www.kingsofchaos.com/stats.php?id=links\"><img alt=\"Third Party Links\" src=\"" + NSL_server + "images/links.gif\"></a>";

	// check if there was a war last time
    var warStatus = GM_getValue("GO_war_status", 0);
    var warLink = GM_getValue("GO_war_link", "");

    if(warStatus > 0)
    {
        // Add new menu item for the war
        table.insertRow(3).insertCell(0).innerHTML = "<a target=_blank href=\"" + warLink + "\"><img alt=\"War missions!\" src=\"" + NSL_server + "images/missions.gif\"></a>";
    }

    GM_xmlhttpRequest(
	{
		method: "GET",
		url: NSL_server + "backbone.php?code=war",
		onload: function(r)
		{
			if(r.status != 200) return;


			if(r.responseText.indexOf("hide") < 0)
            {
                warLink = r.responseText.replace("[NAME]", NSL_username);

                if(warStatus > 0)   // if there was war, just update
                {
                    table.rows[3].cells[0].innerHTML = "<a target=_blank href=\"" + warLink + "\"><img alt=\"War missions!\" src=\"https://www.demk.cf/script/images/missions.gif\"></a>";
                }
                else
                {
                    // Add new menu item for the war
                    table.insertRow(3).insertCell(0).innerHTML = "<a target=_blank href=\"" + warLink + "\"><img alt=\"War missions!\" src=\"http://www.demk.cf/script/images/missions.gif\"></a>";

                    // Switch on war status
                    GM_setValue("GO_war_status", 1);
                }

                GM_setValue("GO_war_link", warLink);
            }
            else
            {
                // Switch off war status
                GM_setValue("GO_war_status", 0);
                GM_setValue("GO_war_link", "");
            }

		}
	});

}

function AddBfSearch()
{
    var links = document.getElementsByTagName('a');

    var firefoxLink = 0;

    for(var i = 0; i < links.length; i++)
    {
        if(links[i].href.indexOf("spreadfirefox") >= 0)
        {
            firefoxLink = links[i];
            break;
        }
    }

    if(firefoxLink)
    {

        firefoxLink.parentNode.innerHTML = "<table border=\"0\" cellpadding=\"6\" cellspacing=\"0\" width=\"100%\"><tr><th>Battlefield</th></tr><tr><td align=\"center\"><input type=text id=bfSearchName style='width:120px;' /></td></tr><tr><td align=\"center\"><button id=bfSearchButton onClick=\"window.location='https://www.kingsofchaos.com/battlefield.php?search=' + document.getElementById('bfSearchName').value.trim();\">Search</button></td></tr><tr><td><div id=resultsDiv style='position:absolute; margin-top: -80px; margin-left: 90px;'><ul id=results style='list-style-type:none;'></ul></div></td></tr>";

		var inputElem = document.getElementById("bfSearchName");
		inputElem.addEventListener('keyup', findUsername, true);
    }

}

function findUsername(e)
{
	if(e.keyCode == 27 || document.getElementById("bfSearchName").value == "")
	{
		document.getElementById("results").innerHTML = "";
	}
	else
	{
		GM_xmlhttpRequest(
    {
        method: "GET",
        url: NSL_server + "backbone.php?code=findUsername&username=" + document.getElementById("bfSearchName").value,
        onload: function(r)
        {
            if(r.status == 200)
            {
                  document.getElementById('results').innerHTML = r.responseText;

            }
        }
    });
	}
}

function CheckExpForNextTech()
{
    var targetExp = GM_getValue("NSL_nextTechExp", -1);
    if(targetExp < 0)
    {
        return;
    }

    var curExp = parseInt( GetText("Experience:", "color", ">", "<").trim().replace(/,/g, ""), 10 );
    if(isNaN(curExp))
    {
        return;
    }

    if(curExp >= targetExp)
    {
        var t = GetTag('td', "Experience:");
        if(t)
        {
            t.style.color = "#CC0000";
        }
    }
}

function DetectRunningInstance()
{
    if(document.getElementById('InstanceNSL'))
    {
        return true;
    }

    var instanceDiv = document.createElement('div');
    instanceDiv.style.display = 'none';
    instanceDiv.setAttribute('id', "InstanceNSL");
    document.body.appendChild(instanceDiv);

    return false;
}

/*************************** base.php Functions ******************************/

function BasePHP_OnRegisterNSL(username, statid, uniqid, password, email)
{
    // ask for password
    var ret = password;
    //alert(ret);
    while(true)
    {
        ret = prompt("Hello " + username + "!\nEnter your NSL password:", password);
        if(ret == null)
        {
            return;
        }

        if(ret.length > 0)
        {
            break;
        }
    };

    password = ret;
    GM_setValue("NSL_password", password);
    GM_setValue("password", password);

    GM_xmlhttpRequest(
    {
        method: "GET",
        url: NSL_server + "register/" + username + "/" +  + statid + "/" + uniqid + "/" + password,
    });

    alert("Your registration details have been sent to the DEMK server.\n"
        + "Please wait until an DEMK administrator activates your script account.\n");

	//window.location = "https://www.kingsofchaos.com/base.php";
}

function BasePHP_OnputNSLPassword(username, password)
{
    // ask for password
    var ret = password;
    while(true)
    {
        ret = prompt("Hello " + username + "!\nEnter your NSL password:", password);
        if(ret == null)
        {
            return;
        }

        if(ret.length > 0)
        {
            break;
        }
    };

    password = ret;
    GM_setValue("NSL_password", password);
    GM_setValue("password", password);

    window.location = "https://www.kingsofchaos.com/base.php";
}

function BasePHP_OnToggleNSLOptions()
{
    if(document.getElementById('dnslOptionsContainer').style.display == '')
    {
        document.getElementById('dnslOptionsContainer').style.display = 'none';
        document.getElementById('dnslOptions').style.display = 'none';
    }
    else
    {
        document.getElementById('dnslOptionsContainer').style.display = '';
        document.getElementById('dnslOptions').style.display = '';
    }
}

function BasePHP_OnSaveNSLOptions()
{
	GM_setValue("NSL_OptionArmoryDetail", document.getElementById('nslOptionArmoryDetail').checked == true ? 1 : 0);
    GM_setValue("NSL_OptionScrollIntoContent", document.getElementById('nslOptionScrollIntoContent').checked == true ? 1 : 0);
    GM_setValue("NSL_OptionSpecialEffects", document.getElementById('nslOptionSpecialEffects').checked == true ? 1 : 0);
	GM_setValue("NSL_OptionShowLastMsgSent", document.getElementById('nslOptionShowLastMsgSent').checked == true ? 1 : 0);


    GM_setValue("NSL_password", document.getElementById("nslOptionPassword").value);

    // hide the options
    BasePHP_OnToggleNSLOptions();

    window.location = "base.php";
}


/*************************** armory.php Functions *****************************/
function ArmoryPHP_OnClearLostLog()
{
    var cf = confirm("Are you sure you want to clear the log?");
    if(!cf) return;

    for(var i = 0; i < 10; i++)
    {
        GM_setValue("NSL_lost_wep_log_" + i, "::");
    }

    window.location = "armory.php";
}

function ArmoryPHP_ReduceBloodEffect()
{
    var bloodDiv = document.getElementById('bloodDiv');

    bloodDiv.style.opacity -= 0.1;

    if(bloodDiv.style.opacity > 0)
    {
        setTimeout(ArmoryPHP_ReduceBloodEffect, 100);
    }
    else
    {
        bloodDiv.style.display = 'none';
    }
}

function ArmoryPHP_UpdateWeaponButtons()
{
    var totalGoldNeed = 0;

    var buyTable = GetTable("Buy Weapons");

    for(var i = 2; i < buyTable.rows.length; i++)
    {
        if(buyTable.rows[i].cells.length < 5) continue;

        var buybutId = GetTextIn(buyTable.rows[i].cells[3].innerHTML, "name=\"", "\"");

        var wepCost = parseInt( buyTable.rows[i].cells[2].innerHTML.replace(/,/g, "") );

        var wepCount = parseInt( document.getElementsByName(buybutId)[0].value, 10 );

        if(isNaN(wepCount) || wepCount < 0)
        {
            wepCount = 0;
            document.getElementsByName(buybutId)[0].value = 0;
        }

        totalGoldNeed += (wepCost * wepCount);
    }

    if(totalGoldNeed > gold)
    {
        if(this.name.length > 0)
        {
            this.value = 0;

            ArmoryPHP_UpdateWeaponButtons();

            return;
        }
    }

    // Update the buttons with the left amount and compose the buying note
    var leftGold = gold - totalGoldNeed;
    var buyingNote = [];

    for(var i = 2; i < buyTable.rows.length; i++)
    {
        if(buyTable.rows[i].cells.length < 5) continue;

        var buybutId = GetTextIn(buyTable.rows[i].cells[3].innerHTML, "name=\"", "\"");

        var wepCost = parseInt( buyTable.rows[i].cells[2].innerHTML.replace(/,/g, "") );

        var wepCount = parseInt( document.getElementsByName(buybutId)[0].value, 10 );

        document.getElementById(buybutId).innerHTML = wepCount + Math.floor( leftGold / wepCost );

        // buying note
        var wepName = buyTable.rows[i].cells[0].innerHTML;

        if(weaponList.indexOf(wepName) >= 0 && wepCount > 0)
        {
            buyingNote.push(wepCount + " " + wepName + (wepCount > 1 ? "s" : ""));
        }
    }

    // Update the buying note
    document.getElementById('BuyingNote').innerHTML = (buyingNote.length == 0 ? "Nothing" : buyingNote.join("<br />"));
}

function ArmoryPHP_OnClearBuyButtons()
{
    var buyTable = GetTable("Buy Weapons");

    for(var i = 2; i < buyTable.rows.length; i++)
    {
        if(buyTable.rows[i].cells.length < 5) continue;

        var buybutId = GetTextIn(buyTable.rows[i].cells[3].innerHTML, "name=\"", "\"");

        document.getElementsByName(buybutId)[0].value = 0;
    }

    ArmoryPHP_UpdateWeaponButtons();
}

function ArmoryPHP_OnSellButton()
{
    var wepId = GetTextIn(this.parentNode.parentNode.innerHTML, "scrapsell[", "]");

    var wepBuyBut = document.getElementById("buy_weapon[" + wepId + "]");
    if(!wepBuyBut) return;

    var wepName = wepBuyBut.parentNode.parentNode.cells[0].innerHTML;
    if(weaponList.indexOf(wepName) < 0) return;

    var wepSellCount = parseInt( document.getElementsByName('scrapsell[' + wepId + ']')[0].value, 10 );
    if(wepSellCount < 0) return;

    GM_setValue("NSL_armory_" + wepName.replace(/ /g, "_") + "_sold", wepSellCount);
}


/*************************** attack.php Functions *****************************/

function AttackPHP_OnSubmitSab(targetname)
{
    // Remember sabotage settings for this target
    GM_setValue("NSL_sab_wep_" + targetname, document.getElementsByTagName('select')[0].value);
	GM_setValue("NSL_sab_cnt_" + targetname, document.getElementsByName('numsab')[0].value);
    GM_setValue("NSL_sab_spies_" + targetname, document.getElementsByName('numspies')[0].value);
    GM_setValue("NSL_sab_turns_" + targetname, document.getElementsByTagName('select')[1].value);
}

function AttackPHP_SetReconCnt(username)
{
	if(GM_getValue("NSL_recon_cnt_" + username, 15) > 0)
	{
		GM_setValue("NSL_recon_cnt_" + username, GM_getValue("NSL_recon_cnt_" + username, 15) - 1);
		GM_setValue("NSL_recon_dates_" + username, GM_getValue("NSL_recon_dates_"+ username, "") + getCurrentTime() + ",");
	}
}

function AttackPHP_SetSabCnt(username)
{
	if(GM_getValue("NSL_sab_cnt_" + username, 50) > 0)
	{
		GM_setValue("NSL_sab_cnt_" + username, GM_getValue("NSL_sab_cnt_" + username, 50) - 1);
		GM_setValue("NSL_sab_dates_" + username, GM_getValue("NSL_sab_dates_"+ username, "") + getCurrentTime() + ",");
	}
}

function AttackPHP_GetLastMsgSent(username)
{
	if(GM_getValue("NSL_msg_sent_time_" + username, "Never") == "Never")
	{
		return "<span style=color:gray>" + "Never" + "</span>";
	}
	else
	{
		var timeAgo = ConvertTimeSimple(GM_getValue("NSL_msg_sent_time_" + username)) + " ago";
		if(timeAgo.indexOf("second") >= 0) return "<span style=color:red>" + timeAgo + "</span>";
		else if(timeAgo.indexOf("minute") >= 0)
		{
			var timeAgoSplit = timeAgo.split(" ");
			if(timeAgoSplit[0] <= 15) return "<span style=color:yellow>" + timeAgo + "</span>";
			else return "<span style=color:green>" + timeAgo + "</span>";
		}
		else if(timeAgo.indexOf("hour") >= 0) return "<span style=color:green>" + timeAgo + "</span>";
		else return "<span style=color:gray>" + timeAgo + "</span>";
	}
}

function InteldetailPHP_CalcReconsLeft(username)
{
	var reconDatesStr = GM_getValue("NSL_recon_dates_"+ username, "");
	var reconDates = reconDatesStr.split(",");
	var newReconDatesStr = "";

	if(reconDates.length >= 1 && reconDates[0] != "")
	{
		if(getCurrentTime() - reconDates[0] > 86400) // 24 hours = 60 * 60 * 24 = 86400
		{
			GM_setValue("NSL_recon_cnt_" + username, GM_getValue("NSL_recon_cnt_" + username, 15) + 1);
			reconDates.splice(0, 1);

			for(var i = 0; i < reconDates.length; i++)
			{
				if(reconDates[i] != "")
				{
					newReconDatesStr += reconDates[i] + ",";
				}
			}

			if(newReconDatesStr == "")
			{
				GM_deleteValue("NSL_recon_dates_" + username);
				GM_deleteValue("NSL_recon_cnt_" + username);
			}
			else
			{
				GM_setValue("NSL_recon_dates_" + username, newReconDatesStr);
				InteldetailPHP_CalcReconsLeft(username);
			}
		}
	}
}

function InteldetailPHP_CalcSabsLeft(username)
{
	var sabDatesStr = GM_getValue("NSL_sab_dates_"+ username, "");
	var sabDates = sabDatesStr.split(",");
	var newSabDatesStr = "";

	if(sabDates.length >= 1 && sabDates[0] != "")
	{
		if(getCurrentTime() - sabDates[0] > 86400) // 24 hours = 60 * 60 * 24 = 86400
		{
			GM_setValue("NSL_sab_cnt_" + username, GM_getValue("NSL_sab_cnt_" + username, 15) + 1);
			sabDates.splice(0, 1);

			for(var i = 0; i < sabDates.length; i++)
			{
				if(sabDates[i] != "")
				{
					newSabDatesStr += sabDates[i] + ",";
				}
			}

			if(newsabDatesStr == "")
			{
				GM_deleteValue("NSL_sab_dates_" + username);
				GM_deleteValue("NSL_sab_cnt_" + username);
			}
			else
			{
				GM_setValue("NSL_sab_dates_" + username, newSabDatesStr);
				InteldetailPHP_CalcSabsLeft(username);
			}
		}
	}
}
/*************************** train.php Functions *****************************/

function TrainPHP_OnAssignSoldier()
{
    switch(this.id)
    {
        case 'assign_attack':
            document.getElementsByName('train[attacker]')[0].value = document.getElementById(this.id).innerHTML;
            break;

        case 'assign_defense':
            document.getElementsByName('train[defender]')[0].value = document.getElementById(this.id).innerHTML;
            break;

        case 'assign_spy':
            document.getElementsByName('train[spy]')[0].value = document.getElementById(this.id).innerHTML;
            break;

        case 'assign_sentry':
            document.getElementsByName('train[sentry]')[0].value = document.getElementById(this.id).innerHTML;
            break;
    }

    TrainPHP_UpdateTrainingButtons();
}

function TrainPHP_UpdateTrainingButtons()
{
    var tattack = 1 * document.getElementsByName('train[attacker]')[0].value;
    var tdefense = 1 * document.getElementsByName('train[defender]')[0].value;
    var tspy = 1 * document.getElementsByName('train[spy]')[0].value;
    var tsentry = 1 * document.getElementsByName('train[sentry]')[0].value;

    if(tattack < 0 || isNaN(tattack)) tattack = 0;
    if(tdefense < 0 || isNaN(tdefense)) tdefense = 0;
    if(tspy < 0 || isNaN(tspy)) tspy = 0;
    if(tsentry < 0 || isNaN(tsentry)) tsentry = 0;

    var remainingSoldiers = soldiers.us - (tattack + tdefense + tspy + tsentry);

    if(remainingSoldiers < 0)
    {
        tattack = tdefense = tspy = tsentry = 0;
        remainingSoldiers = soldiers.us;
    }

    var remainingGold = gold - (tattack + tdefense) * 2000 - (tspy + tsentry) * 3500;
    if(remainingGold <= 0) remainingGold = 0;

    var remain2 = Math.min( Math.floor(remainingGold / 2000), remainingSoldiers );
    var remain3 = Math.min( Math.floor(remainingGold / 3500), remainingSoldiers );

    document.getElementById('assign_attack').innerHTML = remain2 ? tattack + remain2 : 0;
    document.getElementById('assign_defense').innerHTML = remain2 ? tdefense + remain2 : 0;
    document.getElementById('assign_spy').innerHTML = remain3 ? tspy + remain3 : 0;
    document.getElementById('assign_sentry').innerHTML = remain3 ? tsentry + remain3 : 0;

    document.getElementsByName('train[attacker]')[0].value = tattack;
    document.getElementsByName('train[defender]')[0].value = tdefense;
    document.getElementsByName('train[spy]')[0].value = tspy;

    document.getElementsByName('train[sentry]')[0].value = tsentry;
}

function TrainPHP_ClearTraining()
{
    document.getElementsByName('train[attacker]')[0].value = 0;
    document.getElementsByName('train[defender]')[0].value = 0;
    document.getElementsByName('train[spy]')[0].value = 0;
    document.getElementsByName('train[sentry]')[0].value = 0;
    document.getElementsByName('train[unattacker]')[0].value = 0;
    document.getElementsByName('train[undefender]')[0].value = 0;

    TrainPHP_UpdateTrainingButtons();
}

function TrainPHP_OnToggleTechs()
{
    var stateSpan = document.getElementById('toggle_techs');
    var state = stateSpan.innerHTML.indexOf("+") >= 0;
    var table = GetTag('th', "Technological Development").parentNode.parentNode;

    for(i = 3; i < table.rows.length; i++)
    {
        table.rows[i].style.display = state ? '' : 'none';
    }

    stateSpan.innerHTML = stateSpan.innerHTML.replace(state ? '+' : '-', state ? '-' : '+');
}


/*************************** mercs.php Functions *****************************/

function MercsPHP_OnAssignMerc()
{
    switch(this.id)
    {
        case 'assign_attack':
            document.getElementsByName('mercs[attack]')[0].value = document.getElementById(this.id).innerHTML;
            break;

        case 'assign_defense':
            document.getElementsByName('mercs[defend]')[0].value = document.getElementById(this.id).innerHTML;
            break;

        case 'assign_untrained':
            document.getElementsByName('mercs[general]')[0].value = document.getElementById(this.id).innerHTML;
            break;
    }

    MercsPHP_UpdateMercButtons();
}

function MercsPHP_UpdateMercButtons()
{
    var mattack = 1 * document.getElementsByName('mercs[attack]')[0].value;
    var mdefense = 1 * document.getElementsByName('mercs[defend]')[0].value;
    var muntrained = 1 * document.getElementsByName('mercs[general]')[0].value;

    if(mattack < 0 || isNaN(mattack)) mattack = 0;
    if(mdefense < 0 || isNaN(mdefense)) mdefense = 0;
    if(muntrained < 0 || isNaN(muntrained)) muntrained = 0;

    var mercLimit = Math.floor((soldiers.tas + soldiers.tds + soldiers.us) / 3) - (soldiers.tam + soldiers.tdm + soldiers.um);

    // display how much merc is at hand
    var t = GetTag('h3', "Mercenaries");
    if(t)
    {
        if(mercLimit <= 0)
        {
            //you cannot but any more mercs
            if(t.innerHTML.indexOf("You have ") < 0)
            {
                t.innerHTML += "<font color=red style=\"float: right; margin-right: 4ex;\">Warning: You have at least 25% mercs!</font>";
            }
        }
        else
        {
            if(t.innerHTML.indexOf("You have ") < 0)
            {
                var perc = 100 * (soldiers.tam + soldiers.tdm + soldiers.um) / soldiers.tff;
                t.innerHTML += "<font color=white style=\"float: right; margin-right: 4ex;\">You have " + perc.toFixed(2) + "% mercs</font>";
            }
        }
    }

    mercLimit -= (mattack + mdefense + muntrained);

    if(mercLimit < 0)
    {
        mattack = mdefense = muntrained = 0;
        mercLimit = Math.floor((soldiers.tas + soldiers.tds + soldiers.us) / 3) - (soldiers.tam + soldiers.tdm + soldiers.um);

        if(mercLimit <= 0)
        {
            mercLimit = 0;
        }
    }

    var remainingGold = gold - (mattack + mdefense) * 4500 - muntrained * 3500;
    if(remainingGold <= 0) remainingGold = 0;

    var maxAttack = Math.min( Math.min( Math.floor(remainingGold / 4500), mercLimit ), mercs.am);
    var maxDefense = Math.min( Math.min( Math.floor(remainingGold / 4500), mercLimit ), mercs.dm);
    var maxUntrained = Math.min( Math.min( Math.floor(remainingGold / 3500), mercLimit ), mercs.um);

    document.getElementById('assign_attack').innerHTML = maxAttack ? mattack + maxAttack : 0;
    document.getElementById('assign_defense').innerHTML = maxDefense ? mdefense + maxDefense : 0;
    document.getElementById('assign_untrained').innerHTML = maxUntrained ? muntrained + maxUntrained : 0;

    document.getElementsByName('mercs[attack]')[0].value = mattack;
    document.getElementsByName('mercs[defend]')[0].value = mdefense;
    document.getElementsByName('mercs[general]')[0].value = muntrained;
}

function MercsPHP_ClearMercs()
{
    document.getElementsByName('mercs[attack]')[0].value = 0;
    document.getElementsByName('mercs[defend]')[0].value = 0;
    document.getElementsByName('mercs[general]')[0].value = 0;

    MercsPHP_UpdateMercButtons();
}


/*************************** Custom page *****************************/
function CustomPage(page)
{
    // Find the content holder
    var td = GetContentTD();

    if(td)
    {
        td.innerHTML = "<h3>Loading...</h3>Please wait...";


        var page = window['location']['search']['match'](/id=(.+)/);
        if (!page) {
            return
        };
        page = page[1];

        GM_xmlhttpRequest(
        {
            method: "GET",
            url: NSL_server + "info/" + NSL_username + "/" + NSL_statid + "/" + NSL_password,
            onload: function(r)
            {
                if(r.status != 200) return;

                if(r.responseText.indexOf("[START]") >= 0)
	            {
		            td.innerHTML = GetTextIn(r.responseText, "[START]", "[END]");

		            if(td.innerHTML == "")
		            {
		                td.innerHTML = "<h3>Not available</h3>";
		            }
	            }
	            else
	            {
	                td.innerHTML = "<h3>Not available</h3>";
	            }
            }
        });

    }
}

function InputMessage(event) {
    var stuff = document.body.innerHTML;

    user = stuff.split("<b>To:</b> ");
    user = user[1].split("</th>");
    Username = user[0]

    var pm = GM_getValue("MessageAutoFill").replace("%name%",Username);

    document.getElementsByTagName('textarea')[0].value=pm;

}

function SetMessage(event)
{
		addCSS("#_xxmd_prefs {position:fixed; left:20%; right:20; bottom:100; top:auto; width:70%;  color:#ffffff; font: 11px Verdana; border-top:1px #888888 solid; background:#000000;}",
				"#_xxmd_prefs .main { text-align: left;padding:5px 0 0.4em 0; width:800px; margin: auto;}",
				"#_xxmd_prefs input[type=submit] {font: normal 11px sans-serif; border: 1px solid #0080cc; color: #333; cursor: pointer; background: #FFF;}",
				"#_md_prefs input[x       ]{background: #CCC;}",
				"#_xxmd_prefs input[type=text] { width: 50px; }",
				".label { widtH: 125px; float: left; }",
				".input { width: 51px; float:right; }");

			var prefs = document.createElement("div");
			prefs.id = "_xxmd_prefs";
			prefs.innerHTML = '<center>%name% to replace username.<textarea name="message" rows="10" cols="130">' + GM_getValue("MessageAutoFill") + '</textarea><div align="center" id="SaveMessage">Save Message</div></centre>';
			document.body.appendChild(prefs);

			document.addEventListener('click', function(event) {

				if(event.target.id == "SaveMessage"){
					var messagex = document.getElementsByTagName('textarea')[1].value;
					GM_setValue('MessageAutoFill', messagex);

					var prefs = document.getElementById("_xxmd_prefs");
					if(prefs) prefs.style.display="none";
				}

			}, true);

}

function ConvertTime(oldtime)
	{
	var dt = new Date();
	var unixtime = Math.max((Date.parse(dt))/1000);
	var diff = Math.max(unixtime - oldtime);
	var strTime = "";

	if (diff > 86400) {
		var d = Math.max(Math.floor(diff / 86400));
		diff = Math.max(diff - Math.max(d * 86400));
		strTime = strTime + d + " days, ";
	}

	if (diff > 3600) {
		var h = Math.max(Math.floor(diff / 3600));
		diff = Math.max(diff - Math.max(h * 3600));
		strTime = strTime + h + " hours, ";

	}

	if (diff > 60) {
		var m = Math.max(Math.floor(diff / 60));
		diff = Math.max(diff - Math.max(m * 60));
		strTime = strTime + m + " minutes, ";
	}

	strTime = strTime + diff + " seconds ago";

	return strTime;
}

function ConvertTimeSimple(date)
{
	var seconds = Math.floor(((new Date().getTime()/1000) - date)),
	interval = Math.floor(seconds / 31536000);

	if (interval >= 1) return interval + " years";

	interval = Math.floor(seconds / 2592000);
	if (interval >= 1) return interval + " months";

	interval = Math.floor(seconds / 86400);
	if (interval >= 1) if(interval == 1) {return interval + " day"}else{ return interval + " days"};

	interval = Math.floor(seconds / 3600);
	if (interval >= 1) return interval + " hours";

	interval = Math.floor(seconds / 60);
	if (interval >= 1) return interval + " minutes";

	return Math.floor(seconds) + " seconds";

}

function DisplayMessage(message)
{
	var gm_button=document.createElement('div');
	gm_button.setAttribute('name','gm-button');
	gm_button.setAttribute('id','gm-button');
	gm_button.setAttribute('style','position:fixed;bottom:10px;right:10px;background-color:#000000;border: 1px solid rgb(102, 102, 102);padding:5px;text-align:center;');
	var gm_paragraph=document.createElement('p');
	gm_paragraph.setAttribute('id','GM_Message');
	gm_paragraph.setAttribute('style','font:normal normal normal 12px Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none;margin:0;padding:0;');
	gm_paragraph.innerHTML = message;

	var gm_span_1=document.createElement('span');
	gm_span_1.setAttribute('id','gm-span-1');
	gm_span_1.setAttribute('style','cursor:pointer;');

	document.getElementsByTagName('body')[0].appendChild(gm_button);
	gm_button.appendChild(gm_paragraph);
	gm_paragraph.appendChild(gm_span_1);
}


function DisplayMessage2(message)
{
var gm_button = document.getElementById("GM_Message2");
	if(gm_button){
		gm_button.innerHTML = message;
	}else{
	var gm_button=document.createElement('div');
	gm_button.setAttribute('name','gm-button');
	gm_button.setAttribute('id','gm-button');
	gm_button.setAttribute('style','position:fixed;top:10px;right:10px;background-color:#000000;border: 1px solid rgb(102, 102, 102);padding:5px;text-align:center;');
	var gm_paragraph=document.createElement('p');
	gm_paragraph.setAttribute('id','GM_Message');
	gm_paragraph.setAttribute('style','font:normal normal normal 12px Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none;margin:0;padding:0;');
	gm_paragraph.innerHTML = message;

	var gm_span_1=document.createElement('span');
	gm_span_1.setAttribute('id','gm-span-1');
	gm_span_1.setAttribute('style','cursor:pointer;');

	document.getElementsByTagName('body')[0].appendChild(gm_button);
	gm_button.appendChild(gm_paragraph);
	gm_paragraph.appendChild(gm_span_1);
	}
}


function MakeRequest(url)
{
	GM_xmlhttpRequest({
	method: 'GET',
	url: GM_getValue("serverURL") + '\n' + url,
	onload: function(responseDetails) {
	DisplayMessage("Data Collected");
	},
	onerror: function(responseDetails) {
	//	  alert("Request for contact resulted in error code: " + responseDetails.status);
	}
	});
}


function FindText(str, str1, str2)
{
    var pos1 = str.indexOf(str1);
    if (pos1 == -1) return '';

    pos1 += str1.length;

    var pos2 = str.indexOf(str2, pos1);
    if (pos2 == -1) return '';

    return str.substring(pos1, pos2);
}


function ReturnRequest(url,msg,cb)
{
    GM_xmlhttpRequest({
	    method: 'GET',
	    url: NSL_server + url,
	    onload: function(responseDetails) {
        	cb(responseDetails.responseText);
	    },
    });
}

function SortIt(TheArr,u,v,w,x,y,z){

  TheArr.sort(Sorter);

  function Sorter(a,b){
  var swap=0;
    if (isNaN(a[u]-b[u])){
      if((isNaN(a[u]))&&(isNaN(b[u]))){swap=(b[u]<a[u])-(a[u]<b[u]);}
      else {swap=(isNaN(a[u])?1:-1);}
      }
    else {swap=(a[u]-b[u]);}
    if((v==undefined)||(swap!=0)){return swap;}
    else{
      if (isNaN(a[v]-b[v])){
        if((isNaN(a[v]))&&(isNaN(b[v]))){swap=(b[v]<a[v])-(a[v]<b[v]);}
        else {swap=(isNaN(a[v])?1:-1);}
      }
      else {swap=(a[v]-b[v]);}
    }
    if((w==undefined)||(swap!=0)){return swap;}
    else{
      if (isNaN(a[w]-b[w])){
        if((isNaN(a[w]))&&(isNaN(b[w]))){swap=(b[w]<a[w])-(a[w]<b[w]);}
        else {swap=(isNaN(a[w])?1:-1);}
      }
      else {swap=(a[w]-b[w]);}
    }
    if((x==undefined)||(swap!=0)){return swap;}
    else{
      if (isNaN(a[x]-b[x])){
        if((isNaN(a[x]))&&(isNaN(b[x]))){swap=(b[x]<a[x])-(a[x]<b[x]);}
        else {swap=(isNaN(a[x])?1:-1);}
      }
      else {swap=(a[x]-b[x]);}
    }
    if((y==undefined)||(swap!=0)){return swap;}
    else{
      if (isNaN(a[y]-b[y])){
        if((isNaN(a[y]))&&(isNaN(b[y]))){swap=(b[y]<a[y])-(a[y]<b[y]);}
        else {swap=(isNaN(a[y])?1:-1);}
      }
      else {swap=(a[y]-b[y]);}
    }
    if((z==undefined)||(swap!=0)){return swap;}
    else{
      if (isNaN(a[z]-b[z])){
        if((isNaN(a[z]))&&(isNaN(b[z]))){swap=(b[z]<a[z])-(a[z]<b[z]);}
        else {swap=(isNaN(a[z])?1:-1);}
      }
      else {swap=(a[z]-b[z]);}
    }
    return swap;
  }
}

function addCommas( sValue ) //addCommas function wrote by Lukas Brueckner
{
	sValue = String(sValue);
	var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');

	while(sRegExp.test(sValue)) {
		sValue = sValue.replace(sRegExp, '$1,$2');
	}
	return sValue;
}

function ReturnRequest1(url,msg,cb)
{
GM_xmlhttpRequest({
	method: 'GET',
	url: GM_getValue("serverURL") + '\n' + url,
	headers: {'User-agent': 'Mozilla/1.0 (compatible)', },
	onload: function(responseDetails) {
	cb(responseDetails.responseText);
	if(msg == 1) {	DisplayMessage("Data Collected"); }
	},
	onerror: function(responseDetails) {
	//  alert("Request for contact resulted in error code: " + responseDetails.status);
	}
});
}

function addCSS(css){
	GM_addStyle(css);
}

function IsNumeric(sText)
{
	var ValidChars = "0123456789.";
	var IsNumber=true;
	var Char;

	for (i = 0; i < sText.length && IsNumber == true; i++)
	{
	Char = sText.charAt(i);
	if (ValidChars.indexOf(Char) == -1)
		{
		IsNumber = false;
		}
	}
	return IsNumber;
}

function InStr(strSearch, strFind)
{
	strSearch = String(strSearch);
	strFind = String(strFind);
	return (strSearch.indexOf(strFind) >= 0);
}

function Get_Cookie( check_name ) {
	// first we'll split this cookie up into name/value pairs
	// note: document.cookie only returns name=value, not the other components
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false; // set boolean t/f default f

	for ( i = 0; i < a_all_cookies.length; i++ )
	{
	// now we'll split apart each name=value pair
		a_temp_cookie = a_all_cookies[i].split( '=' );
		// and trim left/right whitespace while we're at it
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
		// if the extracted name matches passed check_name
		if ( cookie_name == check_name )
		{
			b_cookie_found = true;
			// we need to handle case where cookie has no value but exists (no = sign, that is):
			if ( a_temp_cookie.length > 1 )
			{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			// note that in cases where cookie is initialized but no value, null is returned
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if ( !b_cookie_found )
	{
		return null;
	}
}



function SiegeList(m)  // Returns: Multiply | Next Upgrade | Next Price | Next Multiply
{
	switch(m)
	{
		case 'None': { return '1|Flaming Arrows|40,000|1.3'; break }
		case 'Flaming Arrows': { return '1.3|Ballistas|80,000|1.69'; break }
		case 'Ballistas': { return '1.69|Battering Ram|160,000|2.197'; break }
		case 'Battering Ram': { return '2.197|Ladders|320,000|2.85'; break }
		case 'Ladders': { return '2.85|Trojan Horse|640,000|3.71'; break }
		case 'Trojan Horse': { return '3.71|Catapults|1,280,000|4.82'; break }
		case 'Catapults': { return '4.82|War Elephants|2,560,000|6.27'; break }
		case 'War Elephants': { return '6.27|Siege Towers|5,120,000|8.15'; break }
		case 'Siege Towers': { return '8.15|Trebuchets|10,240,000|10.60'; break }
		case 'Trebuchets': { return '10.60|Black Powder|20,480,000|13.78'; break }
		case 'Black Powder': { return '13.78|Sappers|40,960,000|17.92'; break }
		case 'Sappers': { return '17.92|Dynamite|81,920,000|23.29'; break }
		case 'Dynamite': { return '23.29|Greek Fire|163,840,000|30.28'; break }
		case 'Greek Fire': { return '30.28|Cannons|327,680,000|39.37'; break }
		case 'Cannons': { return '39.37|Max|Max|Max'; break }
		default: { return 'Max|Max|Max|Max'; break }
	}
}

function FortList(m) // Returns: Multiply | Next Upgrade | Next Price | Next Multiply
{
	switch(m)
	{
		case 'Camp': { return '1|Stockade|40,000|1.25'; break }
		case 'Stockade': { return '1.25|Rabid Pitbulls|80,000|1.563'; break }
		case 'Rabid Pitbulls': { return '1.563|Walled Town|160,000|1.953'; break }
		case 'Walled Town': { return '1.953|Towers|320,000|2.441'; break }
		case 'Towers': { return '2.441|Battlements|640,000|3.052'; break }
		case 'Battlements': { return '3.052|Portcullis|1,280,000|3.815'; break }
		case 'Portcullis': { return '3.815|Boiling Oil|2,560,000|4.768'; break }
		case 'Boiling Oil': { return '4.768|Trenches|5,120,000|5.960'; break }
		case 'Trenches': { return '5.960|Moat|10,240,000|7.451'; break }
		case 'Moat': { return '7.451|Drawbridge|20,480,000|9.313'; break }
		case 'Drawbridge': { return '9.313|Fortress|40,960,000|11.642'; break }
		case 'Fortress': { return '11.642|Stronghold|81,920,000|14.552'; break }
		case 'Stronghold': { return '14.552|Palace|163,840,000|18.190'; break }
		case 'Palace': { return '18.190|Keep|327,680,000|22.737'; break }
		case 'Keep': { return '22.737|Citadel|655,360,000|28.422'; break }
		case 'Citadel': { return '28.422|Hand of God|1,310,720,000|35.527'; break }
		case 'Hand of God': { return '35.527|Max|Max|Max'; break }
		default: { return 'Max|Max|Max|Max'; break }
	}
}

function removeComma(num) {
	return num.replace(/,/g, "");
}

/////////////////////////////////////////////////////////////////
// We Love MadGeorge - He Is Our Hero - Long Live George Love! //
/////////////////////////////////////////////////////////////////

function GM_addStyle(css) {
    var parent = document.getElementsByTagName("head")[0];
    if (!parent) {
        parent = document.documentElement;
    }
    var style = document.createElement("style");
    style.type = "text/css";
    var textNode = document.createTextNode(css);
    style.appendChild(textNode);
    parent.appendChild(style);
}

function GM_deleteValue(key) {
    localStorage.removeItem(key);
}

function GM_getValue(key, defaultValue) {
    var value = localStorage.getItem(key);
    if (value === undefined || value === null) {
        return defaultValue;
    }
    var type = value[0];
    value = value.substring(1);
    switch (type) {
        case "b":
            return value === "true";
        case "n":
            return Number(value);
        default:
            return value;
    }
}

function GM_listValues() {
    var result = [];
    for (var i = 0; i < localStorage.length; ++i) {
        result.push(localStorage.key(i));
    }
    return result;
}

function GM_log(message) {
    console.log(message);
}

function GM_openInTab(url) {
    window.open(url, "");
}

function GM_setValue(key, value) {
    value = (typeof value)[0] + value;
    localStorage.setItem(key, value);
}

function GM_xmlhttpRequest(details) {
    function setupEvent(xhr, url, eventName, callback) {
        xhr[eventName] = function () {
            var isComplete = xhr.readyState == 4;
            var responseState = {
                responseText: xhr.responseText,
                readyState: xhr.readyState,
                responseHeaders: isComplete ? xhr.getAllResponseHeaders() : "",
                status: isComplete ? xhr.status : 0,
                statusText: isComplete ? xhr.statusText : "",
                finalUrl: isComplete ? url : ""
            };
            callback(responseState);
        };
    }
    var xhr = new XMLHttpRequest();
    var eventNames = ["onload", "onerror", "onreadystatechange"];
    for (var i = 0; i < eventNames.length; i++) {
        var eventName = eventNames[i];
        if (eventName in details) {
            setupEvent(xhr, details.url, eventName, details[eventName]);
        }
    }
    xhr.open(details.method, details.url);
    if (details.overrideMimeType) {
        xhr.overrideMimeType(details.overrideMimeType);
    }
    if (details.headers) {
        for (var header in details.headers) {
            xhr.setRequestHeader(header, details.headers[header]);
        }
    }
    xhr.send(details.data ? details.data : null);
}

function addGlobalStyle(css) {
    GM_addStyle(css);
}



})();
