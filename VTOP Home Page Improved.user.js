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


const css = "width: 49.5%; float: left; padding:3px; background: white; margin-bottom:5px;";
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
            addDIV();
    });
    if (document.querySelector('#page-wrapper > div > div.box.box-info > div.box-header > h4') &&
        document.querySelector('#page-wrapper > div > div.box.box-info > div.box-header > h4').innerText == 'Spotlight')
        addDIV();
})();


function addDIV() {

    if (document.getElementById('classMessagesDIV') != null)
        return;
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
        loadCMToDIV();
        loadAttendenceToDIV();
    }
}

function loadCMToDIV() {
    var id = document.getElementById('authorizedIDX').value;
    var data = "verifyMenu=true&winImage=undefined&authorizedID=" + id + "&nocache=@(new Date().getTime())";
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", 'academics/common/StudentClassMessage', true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.onload = function () {
        var messages = [];
        var ihtml = `<table style='border-collapse: collapse; color: #337AB7; width: 100%; font-size:small;'>`;
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
            <td style='padding: 5px;'><b style="font-family: initial !important; font-size: small;">${d.course}</b><br>
            <span style="font-family: initial !important; font-size: small;">${d.msg}</span></td>
            <td style='padding: 5px;'>
            <span style="font-family: initial !important; font-size: small;">Prof. ${d.faculty} posted on ${d.posted}</span></td>
          </tr>`
        })
        ihtml += '</table>';
        if (messages.length == 0)
            ihtml = "<h3 align='center' style='font-family: initial !important; color:red;'> There are no Class Messages </h3>";
        document.querySelector('#classMessagesDIV').innerHTML += ihtml;
    }
    xhttp.send(data);
}

function loadAttendenceToDIV() {
    const container = `display:flex;
    width:100%;
    height:250px;
    justify-content: space-around;`;
    const bar = `position: relative;
    margin: 25px 10px;
    min-width: 14px;
    background-color: #ddd;
    transition: .5s;`;
    const fill = `position: absolute;
    width: 100%;
    background-color: #64DD17;
    bottom: 0px;
    `;
    const up = `position: absolute;
    top: -18px;
    margin:0;
    padding:0;
    left: -13px;
    width: 41px;
    text-align: center;
    transition: .5s;`;
    const down = `position: absolute;
    bottom: -18px;
    margin:0;
    padding:0;
    left: -167px;
    width: 350px;
    text-align: center;
    opacity: 0;
    transition: .5s;
    z-index: 100;`;
    var id = document.getElementById('authorizedIDX').value;
    var data = "semesterSubId=VL2019205&authorizedID=" + id + "&x=" + new Date().toUTCString();
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", 'processViewStudentAttendance', true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.onload = function () {
        var messages = [];
        if (this.readyState == 4 && this.status == 200) {
            var temp = document.createElement('div');
            $(temp).html(xhttp.responseText);
            Array.from(temp.querySelector('tbody').querySelectorAll('tr')).forEach(function (d, i) {
                if (i == temp.querySelector('tbody').querySelectorAll('tr').length - 1)
                    return;
                messages.push({
                    "course": d.querySelectorAll('td')[2].firstElementChild.innerText,
                    "AC": d.querySelectorAll('td')[9].firstElementChild.innerText,
                    "TC": d.querySelectorAll('td')[10].firstElementChild.innerText,
                    "PC": d.querySelectorAll('td')[11].firstElementChild.innerText,
                });

            });
        }
        var ihtml = `<div style="${container}" >`;
        messages.forEach(function (d) {
            ihtml += `<div style="${bar}" title="${d.AC} of ${d.TC}">
            <up style="${up}">${d.PC}</up>
            <div style="${fill}height: ${d.PC}%;"></div>
            <down style="${down}">${d.course}</down>
          </div>`;
        })
        ihtml += '</div>';
        if (messages.length == 0)
            ihtml = "<h3 align='center' style='font-family: initial !important; color:red;'> - </h3>";
        document.querySelector('#attendenceDIV').innerHTML += ihtml;
        var flag = false;
        var attendenceDIV = document.getElementById("attendenceDIV");
        // document.getElementById("attendenceDIV").addEventListener("mouseenter", function () {
        //     flag = true;
        //     console.log(flag);
        // });
        // document.getElementById("attendenceDIV").addEventListener("mouseleave", function () {
        //     flag = false;
        //     console.log(flag);
        // });
        for (let i = 0; i < messages.length; i++) {
            attendenceDIV.lastElementChild.children[i].onmouseenter = function () {
                attendenceDIV.lastElementChild.children[i].style.boxShadow = '4px 4px 2px grey';
                // attendenceDIV.lastElementChild.children[i].firstElementChild.style.opacity = "1";
                attendenceDIV.lastElementChild.children[i].lastElementChild.style.opacity = "1";
            }
            attendenceDIV.lastElementChild.children[i].onmouseleave = function () {
                // attendenceDIV.lastElementChild.children[i].firstElementChild.style.opacity = "0";
                attendenceDIV.lastElementChild.children[i].lastElementChild.style.opacity = "0";
                attendenceDIV.lastElementChild.children[i].style.boxShadow = 'none';
            }
        }
    }
    xhttp.send(data);
}