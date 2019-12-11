// ==UserScript==
// @name         VTOP Home Page Improved
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds class messages and attendence to home page.
// @author       Chaitanya
// @match        https://vtop.vit.ac.in/vtop/
// @match        https://vtop.vit.ac.in/vtop/initialProcess
// @grant        none
// ==/UserScript==


const css = "width: 49.5%; float: left; min-height: 100px; padding:3px; background: white; margin-bottom:5px;";
const classMessagesDIV = document.createElement('div');
const attendenceDIV = document.createElement('div')
classMessagesDIV.id = "classMessagesDIV";
classMessagesDIV.style = css + "margin-right: 8px;";
attendenceDIV.id = "attendenceDIV";
attendenceDIV.style = css;


(function () {
    'use strict';
    $(document).ajaxStop(function (e) {
        if (document.querySelector('#page-wrapper > div > div.box.box-info > div.box-header > h4') &&
            document.querySelector('#page-wrapper > div > div.box.box-info > div.box-header > h4').innerText == 'Spotlight')
            addClassMsgDIV();
    });
    if (document.querySelector('#page-wrapper > div > div.box.box-info > div.box-header > h4') &&
        document.querySelector('#page-wrapper > div > div.box.box-info > div.box-header > h4').innerText == 'Spotlight')
        addClassMsgDIV();
})();


function addClassMsgDIV() {

    if (document.getElementById('classMessagesDIV') != null)
        loadHTMLToDIV('academics/common/StudentClassMessage', '#classMessagesDIV');
    else {
        document.getElementById('page-wrapper').appendChild(classMessagesDIV);
        document.getElementById('page-wrapper').appendChild(attendenceDIV);
        document.getElementById('classMessagesDIV').innerHTML =
            `<h3 align='center' style='background: #337AB7; margin:0px; padding:3px; color:white;
            font-family: initial !important;
        '>
            Class Messages</h2>`;
        document.getElementById('attendenceDIV').innerHTML =
            `<h3 align='center' style='background: #337AB7; margin:0px; padding:3px; color:white; 
            font-family: initial !important;
        '>
            Attendence Details</h3>`;
        loadHTMLToDIV('academics/common/StudentClassMessage', '#classMessagesDIV');
    }
}

function loadHTMLToDIV(url, div) {
    var id = document.getElementById('authorizedIDX').value;
    var data = "verifyMenu=true&winImage=undefined&authorizedID=" + id + "&nocache=@(new Date().getTime())";
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.onload = function () {
        var messages = [];
        var ihtml = `<table style='border-collapse: collapse; color: #337AB7'>`;
        var css = 'border: 1px solid #ddd;';
        if (this.readyState == 4 && this.status == 200) {
            var temp = document.createElement('div');
            $(temp).html(xhttp.responseText);
            Array.from(temp.getElementsByTagName('a')).forEach(function (d) {
                messages.push({
                    "course": d.querySelectorAll('span')[0].innerText,
                    "msg": d.querySelectorAll('span')[1].innerText
                });

            });
            Array.from(temp.getElementsByTagName('table')).forEach(function (d, i) {
                messages[i].faculty = d.querySelectorAll('tr')[0].lastElementChild.innerText;
                messages[i].expiry = d.querySelectorAll('tr')[2].lastElementChild.innerText;
                messages[i].posted = d.querySelectorAll('tr')[3].lastElementChild.innerText;
            });
        }

        messages.forEach(function (d, i) {
            ihtml += `<tr style='${css}'>
            <td style='padding: 5px;'><b style="font-family: initial !important;">${d.course}</b><br>
            <span style="font-family: initial !important;">${d.msg}</span></td>
            <td style='padding: 5px;'>
            <span style="font-family: initial !important;">Prof. ${d.faculty} posted on ${d.posted}</span></td>
          </tr>`
        })
        ihtml += '</table>';
        if (messages.length == 0)
            ihtml = "<h3 align='center' style='font-family: initial !important; color:red;'> There are no Class Messages </h3>";
        document.querySelector(div).innerHTML += ihtml;
    }
    xhttp.send(data);
}