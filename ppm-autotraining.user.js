// ==UserScript==
// @name       ppm-autotraining
// @namespace  https://dyingescape.0fees.net/
// @author	   Oleksa Vyshnivsky a.k.a. ODE
// @version    0.24
// @description  Автотренування
// @match      https://*.powerplaymanager.com/*/players-practice.html
// @match      https://*.powerplaymanager.com/*/player.html*
// @match      https://*.powerplaymanager.com/*/player-profile.html*
// @match      https://*.powerplaymanager.com/*/finances.html
// @match      https://*.powerplaymanager.com/*/player-contracts.html
// @match      https://*.powerplaymanager.com/*/contracts.html
// @match      https://*.powerplaymanager.com/*/overview-of-players.html*
// @match      https://*.powerplaymanager.com/*/team-news.html*
// @match      https://hockey.powerplaymanager.com/uk/lines.html*
// @match      https://*.powerplaymanager.com/uk/lineup.html*
// @match      https://*.powerplaymanager.com/uk/line-up.html*
// @match      https://*.powerplaymanager.com/*/arena.html*
// @match      https://soccer.powerplaymanager.com/*/stadium.html*
// @match      https://*.powerplaymanager.com/*/calendar.html*
// @match      https:/hockey.powerplaymanager.com/en/game-summary.html*
// @match      https://*.powerplaymanager.com/en/match-report.html*
// @match      https://*.powerplaymanager.com/*/team.html*
// @copyright  2014+, Oleksa Vyshnivsky a.k.a. ODE
// @grant       none
// ==/UserScript==

// @require    https://www.powerplaymanager.com/ppm/_javascript/jquery.js

// ПРИМІТКИ
// доступність локального сховища не перевіряється
// недослідженість гравця й величини атрибутів при автовиставленні амплуа до уваги не беруться — використовуються тільки показані на сторінці якості

var version = '0.24'

// ТЕКСТІВКИ
var userLang = navigator.language || navigator.userLanguage
if (userLang == 'uk') {} else {}

var txtDay = 'День'
var txtStrength = 'Сила'
var txtStr = 'Сила'
var txtExtendedLineupView = 'Показувати сили гравців за амплуа'
var txtMinHeight = 'МінЗріст'
var txtWQ = 'ЗЯ'
var txtReadLastDayFinances = 'Перенаправлення сталося для того, щоб прочитати фінанси в останній день сезону.'
var txtPlayerQ = 'Гравців'
var txtSalarySum = 'Сумарна з/п'
var txtSalaryAvg = 'Середня з/п'
var txtSalaryPen = 'Штраф'
var txtSalaryTotal = 'З/п зі штрафом'
var txtAge = 'Вік'
var txtPracticeHistory = 'Історія тренувань'
var txtAvg4WQ = 'Середній приріст для зваженої якості'
var txtRoleEditorHelp = 'Коди амплуа повинні бути унікальними. Для видалення амплуа достатньо залишити поле коду пустим. Числа відношення повинні бути цілими з діапазону [0, 100].'
var txtCode = 'Код'
var txtRole = 'Амплуа'
var txtAdd = 'Додати'
var txtDelete = 'Видалити'
var txtSave = 'Зберегти'
var txtCancel = 'Скасувати'
var txtIsThisFinalDecision = 'Це остаточне рішення?'
var txtMakeRolesEditor = 'Налаштування амплуа'
var txtSetAutoRoles = 'Виставити амплуа'
var txtSetTraining = 'Виставити тренування'
var txtSetPPMAutoTraining = 'Виставити PPM Auto'
var txtAutoChoice = 'Автовибір'
var txtExtSave = 'Зберігати копію даних на сервері'
var txtCL = 'ТК'
var txtCLHistory = 'Історія ТК'
var txtSeasonAverage = 'Середнє сезонне'
var txtSeasonAverageP = '% c. с.'
var txtLastSeason = 'Минулий сезон'
var txtLastSeasonP = '% від м. с.'
var txtDate = 'Дата'
var txtOpponent = 'Суперник'
var txtScore = 'Рахунок'
var txtOA = 'ЗРК'
var txtOAProgress = 'Приріст'
var txtPosition = 'Позиція'
var txtAttendance = 'Глядачів'
var txtTicketPrice = 'Ціна квитка'
var txtVersion = 'V24'

// ЗМІННІ
// Атрибути — повний список для всіх видів спорту
var attributes = {
    hockey: 	['goa', 'def', 'off', 'sho', 'pas', 'tec', 'agr'],
    soccer: 	['goa', 'def', 'mid', 'off', 'sho', 'pas', 'tec', 'spe', 'hea'],
    handball: 	['goa', 'fip', 'sho', 'blk', 'pas', 'tec', 'spe', 'agr'],
    basketball:	['sho', 'blk', 'pas', 'tec', 'spe', 'agr', 'jum'],
}
// Посилання на звіт про матч
var reportBaseLink = {
    hockey: 'https://hockey.powerplaymanager.com/%lang%/game-summary.html?data=%game_id%',
    soccer: 'https://soccer.powerplaymanager.com/%lang%/match-report.html?data=%game_id%',
    handball: 'https://handball.powerplaymanager.com/%lang%/match-report.html?data=%game_id%',
    basketball: 'https://basketball.powerplaymanager.com/%lang%/match-report.html?data=%game_id%',
}
var teamBaseLink = 'https://%sport%.powerplaymanager.com/en/team.html?data=%team_id%'
// Імена атрибутів — будуть прочитані на сторінці
var attribute_names = {}
// Останні дати перед запуском видів спорту
var preDate = {
    hockey: new Date('2009-04-19T02:00:00'),
    soccer: new Date('2010-06-06T02:00:00'),
    handball: new Date('2013-05-26T02:00:00'),
    basketball: new Date('2014-06-29T02:00:00'),
}
// Максимальна кількість гравців без штрафу
var playerLimit = {
    hockey: 40,
    soccer: 30,
    handball: 25,
    basketball: 20,
}
// Номер колонки з першим атрибутом (колонка з іменем — №1). Значення повинне бути виставлене до додавання колонки (зміни html-вмісту таблиці гравців) цим сценарієм
var baseCol = 0
// Дані користувача
var userdata = {}
var udGameReports = {} // Звіти про матчі
var udTeamData = {} // ЗРК
/**
 * Схема
 * {
 * 	players: {
 * 		%player_id%: {
 * 			role: 	%role_key%,
 * 			name:	%ім’я%,
 * 			%X%:	%значення атрибуту X%,
 * 			%X%Q:	%якість атрибуту X%,
 *          wqs: {
 *              %role_key%: %зважена якість для амплуа role_key%,
 *          },
 *          exp:    %досвід%,
 *          che:    %зіграність%,
 *          ene:    %сезонна енергія%,
 *          hei:    %зріст%, (для баскетболу)
 *          prs:    %улюблений фланг%, (для хокею, футболу, гандболу)
 *          training: {
 *              %date%: {
 *                  att:      %Атрибут, який тренується%,
 *                  progress: %Приріст атрибуту, який тренується%,
 *              },
 *          },
 *          cl: {
 *              %season%: %Тривалість кар’єри у сезоні season%
 *          },
 *          expH: { %День спорту%: %Досвід% }
 *          age: %Поточний вік%,
 *          curcl: %Поточна тривалість кар’єри%,
 * 		},
 * 	},
 * 	roles: {
 * 		%role_key%: {
 * 			name:	%ім’я амплуа%
 * 			%X%:	%число з оптимального співвідношення для атрибуту X (між 0 і 100)%,
 * 		},
 * 	},
 *  finances: {
 *      %season%: {
 *          p: [%масив значень доходів за категоріями у даному сезоні%],
 *          v: [%масив значень видатків за категоріями у даному сезоні%],
 *          day: %день сезону, коли були прочитані дані%
 *      }
 *  }
 *  extsave: %Чи потрібне збереження копії на сервері (одна копія на добу.
 *  Збереження кожного разу при покиданні сторінки. Завантаження з сервера — автоматично, коли даних нема у локальному сховищі)%
 * }
*/

// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ФУНКЦІЇ
// Збереження даних у локальне сховище
function saveUserdata() {
    localStorage.setItem('ppm-autotraining-userdata', JSON.stringify(userdata))
}
// Розпакування користувацьких даних з JSON-рядка
function getUserdataObject(JSONstring) {
    try {
        userdata = JSON.parse(JSONstring)
        if (typeof userdata !== 'object') userdata = JSON.parse(userdata)
        if (!userdata.players) userdata.players = {}
        if (!userdata.roles) userdata.roles = {}
        if (!userdata.finances) userdata.finances = {}
        if (typeof userdata.extsave === 'undefined') userdata.extsave = 1
        else userdata.extsave = parseInt(userdata.extsave)
        // Чистка від нульового приросту
        if (!userdata.ZPisCleared) clearUserDataFromZeroProgress()
    } catch (e) {
        userdata = {players: {}, roles: {}, finances: {}, extsave: 1}
    }
}
// Завантаження даних з локального сховища
function loadUserdata() {
    if (localStorage.getItem('ppm-autotraining-userdata') !== null) {
        getUserdataObject(localStorage.getItem('ppm-autotraining-userdata'))
    } else {
        $.ajax({
            async: false,
            type: 'POST',
            url: 'https://ppmntdb.co.ua/ntdb/userdata/download.php',
            data: {manager_id: manager_id, sport: sport},
        }).done(
            getUserdataObject
        ).fail(function(jqXHR, textStatus) {
            console.log('Backup was not downloaded: ' + textStatus)
            userdata = {players: {}, roles: {}, finances: {}, extsave: 1}
        })
    }
}
// ЗВІТИ ПРО МАТЧІ
// Збереження даних у локальне сховище
function saveGameReports() {
    localStorage.setItem('ppm-userdata-gamereports', JSON.stringify(udGameReports))
}
// Завантаження даних з локального сховища
function loadGameReports() {
    if (localStorage.getItem('ppm-userdata-gamereports') !== null) {
        try {
            udGameReports = $.parseJSON(localStorage.getItem('ppm-userdata-gamereports'))
        } catch (e) {
            udGameReports = {}
        }
    } else udGameReports = {}
}
// ЗРК
// Збереження даних у локальне сховище
function saveTeamData() {
    localStorage.setItem('ppm-userdata-teamdata', JSON.stringify(udTeamData))
}
// Завантаження даних з локального сховища
function loadTeamData() {
    if (localStorage.getItem('ppm-userdata-teamdata') !== null) {
        try { udTeamData = $.parseJSON(localStorage.getItem('ppm-userdata-teamdata')) }
        catch (e) { udTeamData = {} }
    } else udTeamData = {}
}
// КОРЖИКИ
function setCookie(cname, cvalue, exdays) {
    var d = new Date()
    d.setTime(d.getTime() + (exdays*24*60*60*1000))
    var expires = "expires="+d.toUTCString()
    document.cookie = cname + "=" + cvalue + "; " + expires
}
function getCookie(cname) {
    var name = cname + "="
    var ca = document.cookie.split(';')
    for(var i=0; i<ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0)==' ') c = c.substring(1)
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length)
    }
    return ""
}
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ФУНКЦІЇ
// Ігнорування дочірніх елементів
$.fn.ignore = function(sel){
    return this.clone().find(sel).remove().end()
}
// Мін і макс
Array.prototype.max = function() {
    return Math.max.apply(null, this)
}
Array.prototype.min = function() {
    return Math.min.apply(null, this)
}
// Визначення виду спорту
var lang = location.href.split('.com/')[1].substring(0, 2)
var sport = ''
var curSeason = 0 // Поточний сезон
var curDay = 0 // Поточний день сезону
var seasonLength = 0 // Тривалість сезону у днях
var sportDay = 0 // Номер дня з часу заснування виду спрорту
var manager_id = 0
var my_team_id = 0
var pagetype = ''
function checkSport() {
    // Вид спорту
    sport = window.location.href.match(/https:\/\/(.*)\.powerplay/)[1]
    // Дата
    var teaminfolinks = $('.top_info_team .link_r')
    if (teaminfolinks.length != 3) return false
    var tmp = $(teaminfolinks[2]).text().match(/(\d[\d\.]*)/g)
    curSeason = parseInt(tmp[0])
    curDay = parseInt(tmp[1])
    seasonLength = parseInt(tmp[2])
    sportDay = (curSeason - 1) * seasonLength + curDay
    // Атрибути до цього виду спорту
    attributes = attributes[sport]
    // Ідентифікатори менеджера і команди
    my_team_id = $(teaminfolinks[0]).getId()
    manager_id = $('a[href*="manager-profile"]').getId()
    // Тип сторінки
    pagetype = window.location.href.match(/com\/..\/(.*).html/)[1]
    // Початкова дата для цього виду спорту
    preDate = preDate[sport]
    // Максимальна кількість гравців без штрафу
    playerLimit = playerLimit[sport]
    // Посилання на звіт про матч
    reportBaseLink = reportBaseLink[sport]
    // Посилання на профіль команди
    teamBaseLink = teamBaseLink.replace(/%sport%/, sport)
}

// ——————————————————— STYLING — taken from https://davidwalsh.name/add-rules-stylesheets ——————————————————————————————————————
var sheet = (function() {
    // Create the <style> tag
    var style = document.createElement("style")
    // WebKit hack :(
    style.appendChild(document.createTextNode(""))
    // Add the <style> element to the page
    document.head.appendChild(style)
    return style.sheet
})()
function addCSSRule(sheet, selector, rules, index) {
    if("insertRule" in sheet) sheet.insertRule(selector + "{" + rules + "}", index)
    else if("addRule" in sheet) sheet.addRule(selector, rules, index)
}
addCSSRule(sheet, ".msgbox", "color: black; background-color: #FFFF99; padding: 5px 5px 5px 5px;")
addCSSRule(sheet, ".msgbox-negative", "color: #D8000C; background-color: #FFBABA; padding: 5px 5px 5px 5px; border: 2px solid red;")
addCSSRule(sheet, ".msgbox-negative >.msgbox-title", "color: red;")
addCSSRule(sheet, ".msgbox-positive", "color: #4F8A10; background-color: #DFF2BF; padding: 5px 5px 5px 5px; border: 2px solid green;")
addCSSRule(sheet, ".msgbox-positive >.msgbox-title", "color: green;")
addCSSRule(sheet, ".msgbox-neutral", "color: #9F6000; background-color: #FEEFB3; padding: 5px 5px 5px 5px;")
addCSSRule(sheet, ".msgbox-neutral >.msgbox-title", "color: orange;")
addCSSRule(sheet, ".msgbox a", "color: #0000ee;")
addCSSRule(sheet, ".msgbox-title", "font-weight: bold; font-size: 1.0em; padding: 0 0 5px 0;")
addCSSRule(sheet, ".msgbox-message", "font-weight: normal; font-size: 1.0em;")
addCSSRule(sheet, ".msgbox-close", "float: right; display: none;")
addCSSRule(sheet, "#us-controlbox", "position: fixed; display: block; top: 0px; left: -150px; background-color: whitesmoke; z-index: 2; width: 170px;")
addCSSRule(sheet, "#us-controlbox label", "color: black;")
addCSSRule(sheet, "[data-ode-button]", "background-color: silver; padding: 2px; opacity: 0.5")
addCSSRule(sheet, "[data-ode-button]:hover", "opacity: 1")
addCSSRule(sheet, ".us-btn-wrapper", "padding: 5px;")
addCSSRule(sheet, ".data-ode-link", "color: blue; cursor: pointer;")
addCSSRule(sheet, "#rolesEditor", "font-family: 'Trebuchet MS', 'Lucida Sans Unicode', sans-serif; padding: 10px 10px 50px 10px; margin: 0 auto; z-index: 100; background-color: white; text-align: center; ")
addCSSRule(sheet, "table.game-reports", "table-layout: fixed; width: 100%; text-align: center; background: #FAF0E6; border: 5px double #191970; border-collapse: collapse;")
addCSSRule(sheet, "th.game-reports", "text-align: center; background: #4682B4; color: #191970; padding: 5px; border: 2px double #696969;")
addCSSRule(sheet, "td.game-reports", "padding: 2px; border: 1px double #696969;")
addCSSRule(sheet, "td.contracts", "color: #191970; padding: 5px; border: 2px double #696969;")
addCSSRule(sheet, "text-left", "text-align: left;")
addCSSRule(sheet, "text-center", "text-align: center;")
// ——————————————————— End of styling ———————————————————————————————————————————————————————————————————————————————————————————————

// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————— РЕДАКТОР АМПЛУА
// Редактор амплуа — показ
function makeRolesEditor() {
    $('#controlBoard').hide()

    var html = '<div id="rolesEditor" style="display: none;"><p>' + txtRoleEditorHelp + '</p>'
    + '<table id="tblRoles" class="table"><thead><tr><td class="th1">' + txtCode + '</td><td class="th1">' + txtRole + '</td>'
    $.each(attributes, function(j, att) { html += '<td class="th1">' + attribute_names[att] + '</td>' })
    if (sport === 'basketball') html += '<td class="th1">' + txtMinHeight + '</td>'
    html += '<td class="th1"></td></tr></thead><tbody>'
    $.each(Object.keys(userdata.roles), function(i, role_key) {
        var role = userdata.roles[role_key]
        html += '<tr>'
        html += '<td class="td1"><input type="text" name="key" value="' + role_key + '" style="text-align: center;"></td>'
        html += '<td class="td1"><input type="text" name="name" value="' + role.name + '"></td>'
        $.each(attributes, function(j, att) {
            html += '<td><input type="number" name="' + att + '" value="' + role[att] + '" min="0" max="100" step="1" style="text-align: center;"></td>'
        })
        if (sport === 'basketball') html += '<td><input type="number" name="minheight" value="' + role.minheight + '" min="150" max="220" step="1" style="text-align: center;"></td>'
        html += '<td><a data-ode-deleterole class="data-ode-link">' + txtDelete + '</a></td>'
        html += '</tr>'
    })
    html += '</tbody></table>'
    + '<div style="padding: 5px;"><a data-ode-addrole class="data-ode-link">' + txtAdd + '</a></div>'
    + '<div style="text-align: center; margin: 0 auto;">'
    + '<input data-ode-saveroles type="button" value="' + txtSave + '">'
    + '<div style="display: inline-block; width: 100px;"></div>'
    + '<input data-ode-closeroleseditor type="button" value="' + txtCancel + '">'
    + '</div>'
    + '</div>'

    $('body').prepend(html)
    $('#rolesEditor').fadeIn('slow')

    $('[data-ode-addrole]').bind('click', addRole)
    $('[data-ode-deleterole]').bind('click', deleteRole)
    $('[data-ode-saveroles]').bind('click', saveRoles)
    $('[data-ode-closeroleseditor]').bind('click', closeRolesEditor)

    scrollToElement($('#rolesEditor'))
}
// Додавання амплуа у редакторі
function addRole() {
    var html = '<tr><td class="td1"><input type="text" name="key" value="" style="text-align: center;"></td><td class="td1"><input type="text" name="name" value=""></td>'
    $.each(attributes, function(j, att) {
        html += '<td><input type="number" name="' + att + '" value="" min="0" max="100" step="1" style="text-align: center;"></td>'
    })
    html += '<td><a data-ode-deleterole style="color: blue; cursor: pointer;">' + txtDelete + '</a></td></tr>'
    $('#tblRoles tbody').append(html)
    // Прив’язка дії видалення амплуа. $('[data-ode-deleterole]:last') не працює
    $('#tblRoles tbody tr:last').find('[data-ode-deleterole]').bind('click', deleteRole)
    // Курсор на перше поле вводу доданого рядка
    $('#tblRoles tbody tr:last input:first').focus()
}
// Видалення амплуа у редакторі
function deleteRole(e) {
    if (confirm(txtIsThisFinalDecision)) $(e.target).closest('tr').remove()
}
// Збереження налаштувань амплуа, закриття редактора
function saveRoles() {
    userdata.roles = {}
    $('#tblRoles tbody tr').each(function(i, tr) {
        // Амплуа без ключа не приймається
        var key = $(tr).find('[name=key]').val()
        if (!key) return
        // Ім’я амплуа
        var rolename = $(tr).find('[name="name"]').val()
        userdata.roles[key] = {
            name: rolename ? rolename : key
        }
        // Ваги атрибутів амплуа
        $.each(attributes, function(a, att) {
            var val = parseInt($(tr).find('[name="' + att + '"]').val())
            userdata.roles[key][att] = (isNaN(val) || val < 0 || val > 100) ? 0 : val
        })
        // Зріст
        if (sport === 'basketball') {
            var val = parseInt($(tr).find('[name="minheight"]').val())
            userdata.roles[key].minheight = (isNaN(val) || val < 150 || val > 220) ? 0 : val
        }
    })
    // Збереження налаштувань у локальному сховищі
    saveUserdata()
    // Закриття редактора
    closeRolesEditor()
    // Оновлення списку амплуа у селекторах
    updatePlayerRoleSelectors()
}
// Закриття редактора амплуа
function closeRolesEditor() {
    $('#rolesEditor').fadeOut('fast')
    $('#rolesEditor').promise().done(function() {
        $('#rolesEditor').remove()
        $('#controlBoard').fadeIn('fast')
    })
}
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————— АВТОТРЕНУВАННЯ
// Читання гравців
function readPlayerPracticeData() {
    // Номер колонки з першим атрибутом (колонка з іменем гравця — номер 1)
    var baseCol =  $('#table-1 thead tr:first td').length - attributes.length - 1
    // Перебір гравців
    $('#table-1 tbody tr').each(function(i, tr) {
        // Гравець
        var player_id = $(tr).find('a:nth-child(2)').getId()
        var player = userdata.players[player_id]
        if (typeof player !== 'object') {
            userdata.players[player_id] = {name: $(tr).find('td:first a:nth-child(2)').text(), training: {}, cl: {}}
            player = userdata.players[player_id]
        } else {
            if (typeof player.training !== 'object') player.training = {}
            if (typeof player.cl !== 'object') player.cl = {}
        }
        // Атрибути й якості гравця
        $.each(attributes, function(j, att) {
            var attValue = parseInt($(tr).find('td:nth-child(' + (baseCol + j) + ')').ignore('span').text())
            if (!attValue) attValue = parseInt($(tr).find('td:nth-child(' + (baseCol + j) + ') span:first').text())
            player[att] = attValue
            player[att + 'Q'] = parseInt($(tr).find('td:nth-child(' + (baseCol + j) + ') span:last').text())
        })
        // Приріст тренування гравця — зберігається тільки при першому вході на сторінку між 07:00 і 02:30
        var seconds = $('#your_time_seconds').text()
        // if (seconds < 2 * 3600 + 30 * 60 && seconds > 7 * 3600)
        if ((seconds < 9000 || seconds > 25200) && typeof player.training[sportDay] !== 'object') {
            // Обхід особливостей гандболу
            var att = parseInt($('select[name="' + player_id + '"]').val()) - 1
            if (sport === 'handball') {
                if (att === 4) att = 2
                else if (att === 2) att = 3
                else if (att === 3) att = 4
            }
            // Атрибут і його прогрес
            // — збергіється тільки тоді, коли прогрес більше нуля
            var progress = parseFloat($(tr).find('td:nth-last-child(2)').text())
            if (progress) {
                player.training[sportDay] = {
                    att: att,
                    progress: parseFloat($(tr).find('td:nth-last-child(2)').text())
                }
            }
        }
        // Тривалість кар’єри
        var age = parseInt($(tr).find('td:visible:eq(2)').text())
        var cl = parseInt($(tr).find('td:visible:eq(4)').text().split('/')[0])
        player.cl[age] = cl
        player.curCL = cl
        player.age = age
        player.my = true
        // Зріст
        if (sport === 'basketball') {
            player.height = parseInt($(tr).find('td:visible:eq(5)').text())
            if (age <= 20 && !player.init_height) {
                player.init_height = parseInt($(tr).find('td:visible:eq(5)').text())
                player.init_height_day = sportDay
            }
            // Прогноз зросту
            $(tr).find('td:visible:eq(5)').attr('title', makeHeightPrediction(player))
        }
    })
    // Тренувальні умови
    userdata.teamtraining = {
        tra: parseInt($('.two:eq(0) strong:eq(0)').text().trim()),
        reg: parseInt($('.two:eq(1) strong:eq(0)').text().trim()),
        coa_def: parseInt($('.two:eq(0) strong:eq(1)').text().trim()),
        coa_off: parseInt($('.two:eq(0) strong:eq(2)').text().trim()),
        phy_def: parseInt($('.two:eq(1) strong:eq(1)').text().trim()),
        phy_off: parseInt($('.two:eq(1) strong:eq(2)').text().trim()),
    }
    // Збереження гравців у локальному сховищі
    saveUserdata()
    // Читання заголовків атрибутів
    $.each(attributes, function(i, att) {
        attribute_names[att] = $('#table-1 thead tr:first td:nth-child(' + (baseCol + i) + ')').text()
    })
}
// Додавання колонки "Амплуа" до таблиці гравців
function addPlayerRoleSelectors() {
    // Заголовок колонки "Амплуа"
    $('#table-1 thead tr').each(function(i, tr) {
        $(tr).append('<td class="th1">' + txtRole + '</td>')
    })
    // Перебір гравців
    $('#table-1 tbody tr').each(function(i, tr) {
        // Гравець
        var player_id = $(tr).find('a:nth-child(2)').getId()
        var player = userdata.players[player_id]
        // Поле вибору амплуа — містить список амплуа разом з відповідними зваженими якостями
        var html = '<td><select data-ode-roleselector="' + player_id + '"><option value="">—</option>'
        $.each(Object.keys(userdata.roles), function(j, key) {
            var selected = player.role == key ? 'selected' : ''
            var wq = player.hasOwnProperty('wqs') ? player.wqs[key] : ''
            if (wq) wq = ' (' + Math.round(wq) + ')'
            html += '<option value="' + key + '" ' + selected + '>' + userdata.roles[key].name + wq + '</option>'
        })
        html += '<option value="auto">' + txtAutoChoice + '</option></select></td>'
        $(tr).append(html)
        // Прогноз зросту
    })
    // Зміна амплуа гравця (PPM використовує стару версію jQuery, тому без "on")
    $('[data-ode-roleselector]').bind('change', setPlayerRole)
}
// Оновлення списку амплуа у селекторах
function updatePlayerRoleSelectors() {
    // Перебір гравців
    $('#table-1 tbody tr').each(function(i, tr) {
        // Ідентифікатор гравця
        var player_id = $(tr).find('a:nth-child(2)').getId()
        var player = userdata.players[player_id]
        // Опції для вибору амплуа
        var html = '<option value="">—</option>'
        $.each(Object.keys(userdata.roles), function(j, key) {
            var selected = player.role == key ? 'selected' : ''
            html += '<option value="' + key + '" ' + selected + '>' + userdata.roles[key].name + '</option>'
        })
        $('[data-ode-roleselector="' + player_id + '"]').html(html)
    })
}
// Зміна амплуа гравця користувачем
function setPlayerRole(e) {
    var player_id = parseInt($(e.target).attr('data-ode-roleselector'))
    var role = $(e.target).val()
    if (role === 'auto') setAutoRole(e)
    else userdata.players[player_id].role = role
    // Збереження у локальному сховищі
    saveUserdata()
}
// Виставлення амплуа гравця автоматично на основі зважених якостей
function setAutoRole4SinglePlayer(player_id) {
    // Функцію нема сенсу виконувати, якщо не задані амплуа
    if (!Object.keys(userdata.roles).length) return false
    // Гравець
    var player = userdata.players[player_id]
    // Масив даних для сортування амплуа за підхожістю
    var playerroledata = []
    // Зважені якості для кожного амплуа
    player.wqs = {}
    // Перебір амплуа
    Object.keys(userdata.roles).forEach(function(rolekey) {
        // Амплуа
        var role = userdata.roles[rolekey]
        // Пошук зваженої якості для даного амплуа
        var ratiosum = 0	// Сума чисел з оптимального співвідношення
        var fractionsum = 0	// Сума дробів [Число з оптимального співвідношення] / [Якість відповідного атрибуту]
        attributes.forEach(function(att) {
            if (role[att] && player[att + 'Q']) {
                ratiosum += parseInt(role[att])
                fractionsum += parseInt(role[att]) / parseInt(player[att + 'Q'])
            }
        })
        var weightedquality = fractionsum ? ratiosum / fractionsum : 0
        player.wqs[rolekey] = weightedquality
        // Атрибутний розподіл
        var newratiosum = 0
        var fractionsum = 0
        attributes.forEach(function(att) {
            if (role[att] && player[att + 'Q']) {
                // 3000 — "цільовий" ЗР
                var dA = 3000 * parseInt(role[att]) / ratiosum - parseInt(player[att])
                dA = dA > 0 ? dA : 0
                newratiosum += dA
                fractionsum += dA / parseInt(player[att + 'Q'])
            }
        })
        var weightedatts = fractionsum ? newratiosum / fractionsum : 0
        // Об’єднання в масив для сортування
        playerroledata.push({
            role: rolekey,
            weightedquality: weightedquality,
            weightedatts: weightedatts
        })
    })
    // Найкраще амплуа
    playerroledata.sort(function (a, b) { return b.weightedquality - a.weightedquality })
    var bestRoleByWQ = playerroledata[0]
    playerroledata.sort(function (a, b) { return b.weightedatts - a.weightedatts })
    var bestRoleByWA = playerroledata[0]
    if (bestRoleByWQ === bestRoleByWA) player.role = bestRoleByWQ.role
    else {
        player.role = bestRoleByWQ.weightedquality > bestRoleByWA.weightedatts ? bestRoleByWQ.role : bestRoleByWA.role
    }
    // Поле вибору амплуа — містить список амплуа разом з відповідними зваженими якостями
    var html = '<option value="">—</option>'
    $.each(Object.keys(userdata.roles), function(j, key) {
        var selected = player.role == key ? 'selected' : ''
        var wq = player.hasOwnProperty('wqs') ? player.wqs[key] : ''
        if (wq) wq = ' (' + Math.round(wq) + ')'
        html += '<option value="' + key + '" ' + selected + '>' + userdata.roles[key].name + wq + '</option>'
    })
    html += '<option value="auto">' + txtAutoChoice + '</option>'
    $('[data-ode-roleselector="' + player_id + '"]').html(html)
}
// Виставлення амплуа гравця автоматично на основі зважених якостей — обгортка
function setAutoRole(e) {
    var player_id = parseInt($(e.target).attr('data-ode-roleselector'))
    setAutoRole4SinglePlayer(player_id)
}
// Виставлення амплуа гравців автоматично на основі зважених якостей
function setAutoRoles() {
    // Ховаємо кнопку на початку виконання
    $('#btn-setautoroles').hide()
    // Перебір гравців
    $.each(Object.keys(userdata.players), function(i, player_id) {
        // Виставлення виконується тільки для тих гравців, що не мають уже виставленого амплуа
        if (!userdata.players[player_id].role) setAutoRole4SinglePlayer(player_id)
    })
    // Збереження у локальне сховище
    saveUserdata()
    // Повертаємо показ кнопки
    $('#btn-setautoroles').fadeIn()
    // Візуальні ефекти
    scrollToElement($('[data-ode-roleselector]:first'))
    greenBlink($('[data-ode-roleselector]').closest('td'))
}
// Виставлення усім гравцям тренування згідно заданих амплуа
function setTraining() {
    // Ховаємо кнопку на початку виконання
    $('#btn-settraining').hide()
    // Перебір гравців
    $.each(Object.keys(userdata.players), function(i, player_id) {
        // Поточний гравець
        var player = userdata.players[player_id]
        // Якщо на сторінці нема поля вибору його тренування, то це має означати, що він покинув команду
        if (!$('select[name="' + player_id + '"]').length) {
            // У такому випадку видаляємо його
            delete userdata.players[player_id]
            // Збереження оновлених даних
            saveUserdata()
        }
        // Якщо не задане амплуа — пропускаємо цього гравця
        if (!player.role) return
        // Налаштування амплуа поточного гравця
        var role = userdata.roles[player.role]
        // Відношення {Атрибут} / {Відповідне число зі співвідношення}
        var min = 1000
        var minJ = -1
        $.each(attributes, function(j, att) {
            if (role[att]) {
                // Спеціально для футболу: Пропуск атрибуту зі значенням 655, оскільки це максимум
                if (sport == 'soccer' && player[att] == 655) return
                // Частка від ділення Атрибут / Вага
                var quotient = player[att] / role[att]
                if (min > quotient) {
                    min = quotient
                    minJ = j
                }
            }
        })
        // У гандболі не той порядок атрибутів при виборі тренування
        if (sport === 'handball') {
            if (minJ === 4) minJ = 3
            else if (minJ === 2) minJ = 4
            else if (minJ === 3) minJ = 2
        }
        // Виставляємо атрибут, який даний гравець має тренувати наступним
        $('select[name="' + player_id + '"]').val(minJ + 1)	// (j + 1) — номер вибраного атрибуту (у цьому сценарії відлік від 0; у PPM відлік від 1)
    })
    // Повертаємо показ кнопки
    $('#btn-settraining').fadeIn()
    // Візуальні ефекти
    scrollToElement($('#training_save').closest('p'))
    greenBlink($('#training_save').closest('p'))
    greenBlink($('select').not('[data-ode-roleselector]').closest('td'))
}
// Виставлення усім гравцям тренування "Auto" — тільки за наявності PRO-пакету
function setPPMAutoTraining() {
    // Перебір гравців
    $.each(Object.keys(userdata.players), function(i, player_id) {
        if ($('select[name="' + player_id + '"]').find('option[value="' + (attributes.length + 1) + '"]').length) {	// (attributes.length + 1) = auto
            $('select[name="' + player_id + '"]').val(attributes.length + 1)
        }
    })
    // Візуальні ефекти
    scrollToElement($('#training_save').closest('p'))
    greenBlink($('#training_save').closest('p'))
    greenBlink($('select').not('[data-ode-roleselector]').closest('td'))
    // Збереження зміненої схеми тренування — має виконуватися вручну
}
// TODO: Видалити після оновлення даних у всіх користувачів
function renameTrainingDataKeys() {
    Object.keys(userdata.players).forEach(function(player_id) {
        var player = userdata.players[player_id]
        Object.keys(player.training).reverse().forEach(function(sday_rough) {
            var sday = parseInt(sday_rough)
            if (sday != sday_rough) {
                sday = Math.floor((new Date(sday_rough) - preDate) / (3600000 * 24))
                player.training[sday] = player.training[sday_rough]
                delete player.training[sday_rough]
            }
        })
    })
}
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————— ФІНАНСИ
function readFinances() {
    // Тісно на сторінці. Ховаємо ліву панель, розтягуємо головну область
    $('.column_left').hide()
    $('.column_center_half').css('width', parseInt($('.column_center_half').css('width')) + parseInt($('.column_left').css('width')))
    // Таблиці доходів/видатків
    var tables = [$('#table-p'), $('#table-v')]
    var tableSuffixes = ['p', 'v']
    // Онулюємо дані за поточний сезон
    userdata.finances[curSeason] = {p: [], v: [], day: curDay}
    // Перебираємо таблиці з даними
    $.each(tables, function(t, table) {
        // Додаємо заголовки нових колонок
        var html = '<td class="th2" width="100" data-ode-lastseason>' + txtLastSeason + '</td><td class="th1" width="40"  data-ode-lastseason>' + txtLastSeasonP + '</td>'
        + '<td class="th2" width="100" data-ode-seasonaverage>' + txtSeasonAverage + '</td><td class="th1" width="40" data-ode-seasonaverage>' + txtSeasonAverageP + '</td>'
        $(table).find('thead td:nth-last-child(2)').after(html)
        // Перебираємо рядки таблиці даних
        $(table).find('tbody tr').each(function(i, tr) {
            // Загальна сума за всі сезони
            var allAmount = parseInt($(tr).find('td:last-child').text().replace(/ /g, ''))
            // Сума за поточний сезон
            var curAmount = parseInt($(tr).find('td:nth-last-child(2)').text().replace(/ /g, ''))
            // Середня сума за минулі сезони
            var seasonAverage = Math.round((allAmount - curAmount) / (curSeason - 1))
            // Сума за поточний сезон як відсоток від середньої суми за минулі сезони
            var seasonAverageP = seasonAverage ? Math.round(100 * curAmount / seasonAverage) : 0
            // Додаємо суму за поточний сезон у базу даних
            userdata.finances[curSeason][tableSuffixes[t]].push(curAmount)
            // Сума за минулий сезон — якщо така є у базі даних
            var lastSeason = typeof userdata.finances[curSeason - 1] !== 'undefined' ? parseInt(userdata.finances[curSeason - 1][tableSuffixes[t]][i]) : false
            // Сума за поточний сезон як відсоток від суми за минулий сезон
            var lastSeasonP = lastSeason ? Math.round(100 * curAmount / lastSeason) : 0
            // Вивід даних (відносно) минулого сезону
            var html = '<td class="right_align tr1td2" width="100" data-ode-lastseason>' + format(lastSeason) + '</td><td class="tr1td1" width="40" data-ode-lastseason>' + format(lastSeasonP) + '%</td>'
            $(tr).find('td:nth-last-child(2)').after(html)
            // Вивід даних (відносно) усередненних за минулі сезони
            var html = '<td class="right_align tr1td2" width="100" data-ode-seasonaverage>' + format(seasonAverage) + '</td><td class="tr1td1" width="40" data-ode-seasonaverage>' + format(seasonAverageP) + '%</td>'
            $(tr).find('td:nth-last-child(2)').after(html)
        })
    })
    // Виправлення ширини підсумкової таблиці
    var html = '<td class="right_align tr1td2" width="100" data-ode-lastseason></td><td class="tr1td1" width="40" data-ode-lastseason></td>'
    + '<td class="right_align tr1td2" width="100" data-ode-seasonaverage></td><td class="tr1td1" width="40" data-ode-seasonaverage></td>'
    $('.table:last').find('td:nth-last-child(2)').after(html)
    // Таблиці виходять надто широкі. Ховаємо одну з двох нових пар стовпців (дані за останній сезон)
    $('[data-ode-lastseason]').hide()
    // Зберігаємо базові дані у локальному сховищі
    saveUserdata()
    // Зберігаємо дані на сервері
    doExtSave(false)
}
// Перемикання видимості розрахованих даних
function changeExtDataVisibility() {
    $('[data-ode-lastseason]').toggle()
    $('[data-ode-seasonaverage]').toggle()
}
// Форматування числа перед виводом
function format(num){
    return parseFloat(num).toLocaleString()
}
// Кнопки контролю показу розрахованих значень — за минулий сезон чи усереднені
function makeFinancesControlBoard() {
    var html = '<input type="button" name="changeExtDataVisibility" value="' + txtLastSeason + '" data-ode-seasonaverage>'
    + '<input type="button" name="changeExtDataVisibility" value="' + txtSeasonAverage + '" data-ode-lastseason>'
    $('.white_box_text').append(html)
    $('[name=changeExtDataVisibility]').click(changeExtDataVisibility)
}
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————— ГРАВЦІ — КОНТРАКТИ
function readPlayerContracts() {
    // Кількість гравців у команді
    var playerQ = $('#table-1 tbody tr').length
    // Зарплати гравців
    var salaries = []
    $('#table-1 tbody tr').each(function(i, tr) {
        salaries.push(parseInt($(tr).find('td:nth-child(4)').text()))
    })
    // Сума всіх зарплат
    var salarySum = salaries.reduce(function(a, b) { return a + b })
    // Середня зарплата
    var salaryAvg = playerQ ? Math.round(salarySum / playerQ) : 0
    // Переплата
    var salaryPen = playerQ > playerLimit ? Math.round(0.05 * (playerQ - playerLimit) * salarySum): 0
    // HTML
    var html = '<div><table class="game-reports">' + makeTR(txtPlayerQ, playerQ)
    + makeTR(txtSalarySum, salarySum)
    + makeTR(txtSalaryAvg, salaryAvg)
    + (txtSalaryPen ? makeTR(txtSalaryPen, salaryPen) + makeTR(txtSalaryTotal, salarySum + salaryPen) : '')
    + '</table></div>'
    // Вивід таблиці
    $('.column_left').prepend(html)
}
function makeTR(txt, num) {
    return '<tr><td class="text-left contracts">' + txt + '</td><td class="text-center contracts">' + format(num) + '</td></tr>'
}
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// Прокрутка
function scrollToElement(el) {
    $(window.opera?'html':'html, body').animate({scrollTop:$(el).offset().top}, 'fast')
}
// Візуальні ефекти — мигання тла
function greenBlink(el) {
    $(el).clearQueue().animate({'background-color': '#61B329'}, 1000, function() { $(this).css('background-color', '') })
}
// Ідентифікатор команди, гравця, менеджера тощо
jQuery.fn.getId = function() {
    return parseInt($(this).attr('href').replace(/\D+/, ''))
}
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// Додавання пульту управління на сторінку
function makeControlBoard() {
    // Пульт управління
    var html = '<div id="controlBoard" style="position: fixed; right: 2px; top: 2px; background-color: black; z-index: 100; width: 170px;"></div>'
    $('body').append(html)
    // Підпис версії
    var html = '<div style="background-color: black; color: silver; font-weight: bold;">' + txtVersion + '</div>'
    $('#controlBoard').append(html)
    // Кнопка для налаштування амплуа
    var html = '<div ><input type="button" id="btn-makeroleseditor" value="' + txtMakeRolesEditor + '" style="width: 100%; opacity: 0.5;"></div>'
    $('#controlBoard').append(html)
    $('#btn-makeroleseditor').click(makeRolesEditor)
    // Кнопка для автовибору амплуа на основі зважених якостей
    var html = '<div ><input type="button" id="btn-setautoroles" value="' + txtSetAutoRoles + '" style="width: 100%; opacity: 0.5;"></div>'
    $('#controlBoard').append(html)
    $('#btn-setautoroles').click(setAutoRoles)
    // Кнопка для виставлення тренування
    var html = '<div ><input type="button" id="btn-settraining" value="' + txtSetTraining + '" style="width: 100%; opacity: 0.5;"></div>'
    $('#controlBoard').append(html)
    $('#btn-settraining').click(setTraining)
    // Кнопка для виставлення тотального "авто"
    if (!$('.blue_box').length) {
        var html = '<div ><input type="button" id="btn-setautotraining" value="' + txtSetPPMAutoTraining + '" style="width: 100%; opacity: 0.5;"></div>'
        $('#controlBoard').append(html)
        $('#btn-setautotraining').click(setPPMAutoTraining)
    }
    // Галка "Зберігати копію на сервері"
    var html = '<div><label style="color: white;"><input type="checkbox" id="cb-extsave" ' + (!!userdata.extsave ? 'checked' : '') + '>' + txtExtSave + '</label></div>'
    $('#controlBoard').append(html)
    $('#cb-extsave').change(setExtSave)
    // Стилі
    $('#controlBoard div').css('padding', '5px')
    $('#controlBoard input').hover(function(e) {$(this).css('opacity', e.type === "mouseenter" ? 1 : 0.5)})
    // Приховування за правим краєм екрану
    $('#controlBoard').animate({'right': '-150px'}, 1000)
    $('#controlBoard').hover(function(e) {
        $(this).clearQueue().animate({'right': (e.type === "mouseenter" ? 0 : '-150px')}, 500)
    })
}
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// Збереження даних перед покиданням сторінки
function setExtSave() {
    userdata.extsave = $('#cb-extsave:checked').length
    saveUserdata()
    if (!!userdata.extsave) doExtSave(false)
}
function doExtSave(oncePerDay) {
    // Якщо oncePerDay = true, то виконується одне зовнішнє збереження на добу
    if (oncePerDay && userdata.lastbackupday == sportDay) return false
    // Якщо зовнішнє збереження заборонене
    if (!userdata.extsave) return false
    // Версія сценарію, який виконує збереження
    userdata.version = version
    // Зовнішнє збереження
    $.ajax({
        async: true,// TODO: Подивитися, чи не занадто ненадійно з true
        type: 'POST',
        url: 'https://ppmntdb.co.ua/ntdb/userdata/upload.php',
        data: {
            manager_id: manager_id,
            team_id: my_team_id,
            sport: sport,
            pagetype: pagetype,
            userdata: JSON.stringify(userdata)
        },
    }).done(function(response) {
        console.log(response)
        userdata.lastbackupday = sportDay
        saveUserdata()
    })
}
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ЗАКЛАДКА "ОГЛЯД ГРАВЦІВ"
function updatePlayersOverview() {
    $('table tbody tr').each(function(i, tr) {
        var player_id = $(tr).find('a[href*=player]').getId()
        var player = userdata.players[player_id]
        var role = player ? player.role : ''
        var roleName = role ? userdata.roles[role].name : ''
        var wq = role ? Math.round(player.wqs[role]) : ''
        var html = '<span hidden>' + wq + '</span><span title="' + roleName + '">' + wq + '</span>'
        var tds = $(tr).find('td:visible')
        $(tds[4]).html(html)
        $(tr).append('<td>' + roleName + '</td>')
    })
    $($('table thead tr td:visible')[4]).text(txtWQ)
    $($('table tfoot tr td:visible')[4]).text(txtWQ)
    $('table thead tr').append('<td>' + txtRole + '</td>')
	$('table tfoot tr').append('<td>' + txtRole + '</td>')
}

// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————— ЗАКЛАДКА "СКЛАД"
// Читання гравців
function readLineup() {
    // Номер колонки з першим атрибутом (відлік від 1)
    var baseCol = sport == 'hockey' ? 5 : 4
    // Перебір гравців
    $('.table tbody tr').each(function(t, tr) {
        var player_id = $(tr).find('a[href*=player]').getId()
        if (typeof userdata.players[player_id] == 'undefined') {
            userdata.players[player_id] = {
                role: '',
                name: $(tr).find('a[href*=player]').text().trim(),
                training: {},
                cl: {}
            }
        }
        // Атрибути й якості гравця
        $.each(attributes, function(i, att) {
            userdata.players[player_id][att] = parseInt($(tr).find('td:nth-child(' + (baseCol + i) + ')').text())
        })
        // Досвід, зіграність, енергія, зріст
        if (sport == 'hockey') {
            userdata.players[player_id].exp = parseInt($(tr).find('td:nth-last-child(3)').text())
            userdata.players[player_id].che = parseInt($(tr).find('td:nth-last-child(1)').text())
            userdata.players[player_id].ene = parseInt($(tr).find('td:nth-last-child(2)').text())
        } else {
            userdata.players[player_id].exp = parseInt($(tr).find('td:nth-last-child(5)').text())
            userdata.players[player_id].che = parseInt($(tr).find('td:nth-last-child(2)').text())
            userdata.players[player_id].ene = parseInt($(tr).find('td:nth-last-child(1)').text())
            if (sport == 'basketball') userdata.players[player_id].hei = parseInt($(tr).find('td:nth-last-child(3)').text())
        }
        if (!userdata.players[player_id].expH) userdata.players[player_id].expH = {}
        userdata.players[player_id].expH[sportDay] = userdata.players[player_id].exp
    })
    // Збереження гравців у локальному сховищі
    saveUserdata()
}
function updateLineup() {
    // Заголовок
    var titleExtension = ''
    Object.keys(userdata.roles).forEach(function(role_key) {
        var role = userdata.roles[role_key]
        titleExtension += '<td data-ode-extendedLineupView>' + role.name + '</td>'
    })
    titleExtension += '<td data-ode-extendedLineupView title="' + txtStrength + '">' + txtStr + '</td>'
    $('.table thead tr').each(function(t, tr) { $(tr).append(titleExtension) })
    $('.table tfoot tr').each(function(t, tr) { $(tr).append(titleExtension) })
    $('.table thead tr').append('<td>' + txtRole + '</td>')
	$('.table tfoot tr').append('<td>' + txtRole + '</td>')
    // Перебір гравців
    $('.table tbody tr').each(function(t, tr) {
        var player_id = $(tr).find('a[href*=player]').getId()
        var player = userdata.players[player_id]
        Object.keys(userdata.roles).forEach(function(role_key) {
            if (player) {
                var role = userdata.roles[role_key]
                // Відношення Атрибут/Вага. Сума ваг
                var ratios = []
                var ratioSum = 0
                var roleAttSum = 0
                var counter = 0
                attributes.forEach(function(attribute) {
                    if (role[attribute]) {
                        ratios.push(player[attribute] / role[attribute])
                        ratioSum += player[attribute] / role[attribute]
                    }
                    roleAttSum += parseInt(role[attribute])
                    counter++
                })
                // Атрибутна сила — за найслабшим атрибутом
                var strength_byWeak = ratios.min() * roleAttSum
                // Атрибутна сила — за зваженим середнім атрибутів
                var strength_byMean = ratioSum * roleAttSum / counter

                // TODO: Виставити адекватнішу силу
                var strength = strength_byWeak

                // Вплив досвіду, зіграності, енергії
                strength *= (1 + 0.001 * parseInt(player.exp))
                strength *= (1 + 0.002 * parseInt(player.che))
                strength *= (parseInt(player.ene) / 100)

                $(tr).append('<td data-ode-extendedLineupView title="' + role.name + '">' + Math.round(strength) + '</td>')
            } else $(tr).append('<td data-ode-extendedLineupView title="' + role.name + '"></td>')
        })
        // Редактор сили, виставленої вручну
        $(tr).append('<td data-ode-extendedLineupView><span data-ode-player-id="' + player_id + '" hidden>' + player.manStrength + '</span><input type="number" min="0" value="' + player.manStrength  + '" style="text-align: center; width: 3em;" data-ode-player-id="' + player_id + '" data-ode-manstrength></td>')
        // Вибране амплуа
        var role = player ? player.role : ''
        var roleName = role ? userdata.roles[role].name : ''
        var wq = role ? Math.round(player.wqs[role]) : ''
        var html = '<span hidden>' + wq + '</span><span title="' + roleName + '">' + wq + '</span>'
        $(tr).append('<td>' + roleName + '</td>')
    })
    // Сортування полів
    if (sport == 'basketball') {
        // Параметри для сортування полів
        var fieldSortParams = ["None", "String", "Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number",  "Number",  "Number",  "Number", "Number",  "Number", "String"]
        Object.keys(userdata.roles).forEach(function(role_key) {
            var role = userdata.roles[role_key]
            fieldSortParams.push('Number')
        })
        fieldSortParams.push('Number')
        // Сортування через параметр PPM
        st = new SortableTable(document.getElementById("table-1"), fieldSortParams)
    }
    // Видимість полів
    $('[data-ode-extendedLineupView]').toggle(!!userdata.extendedLineupView)
    // Панель керування
    var html = '<div><label><input type="checkbox" id="extendedLineupView" ' + (!!userdata.extendedLineupView ? 'checked' : '') + '> ' + txtExtendedLineupView + '</label></div>'
    $('.main_content').prepend(html)
    $('#extendedLineupView').bind('click', extendedLineupView)
    // Збережння виставлених вручну сил
    $(document).bind('change', '[data-ode-manstrength]', function(e) {
        var player_id = parseInt($(e.target).attr('data-ode-player-id'))
        var newManStrength = parseInt($(e.target).val())
        userdata.players[player_id].manStrength = newManStrength
        $('span[data-ode-player-id="' + player_id + '"]').val(newManStrength)
        saveUserdata()
    })
}
function extendedLineupView() {
    // Чи показувати сили за амплуа на сторінці "Склад"
    userdata.extendedLineupView = $('#extendedLineupView').is(':checked')
    saveUserdata()
    $('[data-ode-extendedLineupView]').toggle(!!userdata.extendedLineupView)
}
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————— ЗРК
// Скачування профілю команди
function getTeamProfile4OTR() {
    console.log('Loading ' + 'https://' + sport + '.powerplaymanager.com/en/team.html')
    $.ajax({
        async: false,
        method: 'GET',
        url: 'https://' + sport + '.powerplaymanager.com/en/team.html',
    }).done(parseTeamProfile4OTR)
}
// Читання профілю команди
function parseTeamProfile4OTR(response) {
    var team_id = parseInt($(response).find('.h1_add_info:eq(0)').text().replace(/\D+/, ''))
    if (team_id != my_team_id) return false
    // Сила команди
    var strength = []
    $(response).find('.table_profile:eq(0) tbody tr td:nth-child(2)').each(function(i, td) {
        strength.push(parseInt($(td).text()))
    })
    // ЗРК, позиція
    udTeamData[sportDay] = {
        oa: parseFloat($(response).find('img[src*="icon_final_tc.png"]').closest('div').text()),
        pos: parseInt($(response).find('.h1_add_info:eq(1)').text().split('(')[1].replace(/\D+/, '')),
        strength: strength
    }
    // Збереження у локальному сховищі
    saveTeamData()
    setCookie('de-otr', 1, 0.5)
}
// Показ історії ЗРК
function showStat4OTR() {
    // Підписи сил
    var strength_names = []
    $('.table_profile:eq(0) tbody tr td:nth-child(1)').each(function(i, td) {
        strength_names.push($(td).text().trim())
    })
    // Кінець підсумкової таблиці (починаємо формування знизу)
    var html = '</tbody></table>'
    // Перебір днів
    var prev = 0
    $.each(udTeamData, function(day, data) {
        var progress = prev ? data.oa - prev : ''
        var style = data.oa - prev > 0 ? 'style="color: green;"' : 'style="color: red;"'
        // Округлення
        progress = Math.round(progress * 100) / 100
        // HTML
        html = '<tr><td>' + makeSDdate(day) + '</td><td>' + data.oa
        + '</td><td ' + style + '>' + progress + '</td><td>' + data.strength[strength_names.length - 2] + '</td></tr>' + html
        prev = data.oa
        // Виходимо, якщо заглибилося далеко в історію
        if (sportDay - day < 3 * seasonLength[sport]) return false
    })
    // HTML
    html = '<table style="width: 100%; table-layout: fixed; text-align: center; border-collapse: collapse;"><thead><tr><th>'
    + txtDate + '</th><th>' + txtOA + '</th><th>' + txtOAProgress + '</th><th>' + txtStr + '</th></tr></thead><tbody>' + html
    // Вивід підсумкової таблиці
    $('.profile_left_column').append(html)
    $('.profile_left_column table td').css('height', 'auto').css('padding', '1px')
}
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ЗВІТИ ПРО МАТЧІ
// Скачування календаря
function getCalendar(monthShift) {
    console.log('Loading ' + 'https://' + sport + '.powerplaymanager.com/en/calendar.html?data=' + my_team_id + makeDate4Calendar(monthShift))
    $.ajax({
        async: false,
        method: 'GET',
        url: 'https://' + sport + '.powerplaymanager.com/en/calendar.html?data=' + my_team_id + makeDate4Calendar(monthShift),
    }).done(parseCalendar)
}
// Читання календаря
function parseCalendar(response) {
    // Перевіряємо, чи це наш календар
    if ($(response).find('.ppm_menu_top_menu').length) return false
    // Перебір звітів про гру
    var reports = $(response).find('.calendary a[href*="summary"], .calendary a[href*="report"]')
    $.each(reports, function(i, reportLink) {
        var game_id = $($(response).find('.calendary a[href*="summary"], .calendary a[href*="report"]')[i]).getId()
        if (typeof udGameReports[game_id] === 'undefined') {
            getGameReport(game_id)
        }
    })
}
// Скачування звіту про гру
function getGameReport(game_id) {
    console.log('Loading ' + reportBaseLink.replace('%lang%', 'en').replace('%game_id%', game_id))
    $.ajax({
        async: false,
        method: 'GET',
        url: reportBaseLink.replace('%lang%', 'en').replace('%game_id%', game_id)
    }).done(parseGameReport)
}
// Читання звіту про гру
function parseGameReport(response) {
    // Ідентифікатор матчу
    var game_id = $(response).find('a[href*="broadcast.html"]').getId()
    // Перевіяємо, чи тут грала наша команда
    var t1 = $($(response).find('table:first a[href*="team.html"]')[0]).getId()
    var t2 = $($(response).find('table:first a[href*="team.html"]')[1]).getId()
    if (t1 != my_team_id && t2 != my_team_id) return false
    // Об’єкт Матч
    udGameReports[game_id] = {}
    // Відвідуваність. Для баскетболу — ціна на квиток
    udGameReports[game_id].attendance = parseInt($(response).find('.report_head_content.info').html().split('<br>')[3].trim().replace(/\D/g, ''))
    if (sport === 'basketball') {
        udGameReports[game_id].ticketPrice = parseInt($(response).find('.report_head_content.info').html().split('<br>')[4].trim().replace(/\D/g, ''))
    }
    // Інформація про суперника
    var teamLinks = $(response).find('table:first a[href*="team.html"]')
    $.each(teamLinks, function(isGuest, teamLink) {
        var opponent_team_id = $($(response).find('table:first a[href*="team.html"]')[isGuest]).getId()
        if (opponent_team_id != my_team_id) {
            udGameReports[game_id].host = isGuest
            udGameReports[game_id].opponent_id = opponent_team_id
            udGameReports[game_id].opponent_name = $($(response).find('table:first a[href*="team.html"]')[isGuest]).text().trim()
            return false
        }
    })
    // Дата й рахунок
    udGameReports[game_id].date = new Date($(response).find('.report_head_content.info').html().split('<br>')[1])
    // udGameReports[game_id].date.setHours(udGameReports[game_id].date.getHours() + 18)
    udGameReports[game_id].goals = [parseInt($(response).find('.report_head_content.score:first').text()), parseInt($(response).find('.report_head_content.score:last').text())]
    // Інформація про команду
    if (isTeamInfoNeeded(udGameReports[game_id])) getTeamProfile4Attendance(udGameReports[game_id].opponent_id)
    // Оновлення статистики
    showStat4Attendance()
}
// Скачування профілю команди
function getTeamProfile4Attendance(team_id) {
    console.log('Loading ' + teamBaseLink.replace('%team_id%', team_id))
    $.ajax({
        async: false,
        method: 'GET',
        url: teamBaseLink.replace('%team_id%', team_id)
    }).done(parseTeamProfile4Attendance)
}
// Читання профілю команди
function parseTeamProfile4Attendance(response) {
    var opponent_id = parseInt($(response).find('.h1_add_info:eq(0)').text().replace(/\D+/, ''))
    // ЗРК і позиція команди
    var oa = parseFloat($(response).find('img[src*="icon_final_tc.png"]').closest('div').text())
    var pos = parseInt($(response).find('.h1_add_info:eq(1)').text().split('(')[1].replace(/\D+/, ''))
    // Запис ЗРК і позиції в останню гру, якщо вона була відносно недавно
    var keys = Object.keys(udGameReports).reverse()
    $.each(keys, function(i, game_id) {
        if (isTeamInfoNeeded(udGameReports[game_id]) && udGameReports[game_id].opponent_id == opponent_id) {
            // (Якщо ЗРК і позиція уже записані, вони не оновлюються)
            if (!udGameReports[game_id].oa) udGameReports[game_id].oa = oa
            if (!udGameReports[game_id].pos) udGameReports[game_id].pos = pos
        }
    })
}
// Виконання — Арена/Стадіон
function arenaInitAction() {
    // Тримач розширених даних
    $('.main_content').prepend('<div id="ext-content"></div>')
    // Читання сторінки Календар
    var d = new Date()
    var monthShiftLimit = d.getDate() < 5 ? -2 : -1
    for (monthShift = 0; monthShift > monthShiftLimit; monthShift--) getCalendar(monthShift)
}
// Виконання — Календар
function calendarInitAction() {
    // Читання сторінки
    parseCalendar($('html').html())
}
// Виконання — Звіт про матч
function reportInitAction() {
    // Читання сторінки
    parseGameReport($('html').html())
}
// Виконання — Профіль команди
function teamInitAction() {
    // Читання сторінки
    parseTeamProfile4Attendance($('html').html())
}
// Показ статистики
function showStat4Attendance() {
    if (pagetype != 'arena' && pagetype != 'stadium') return false
    // Ключі — дати матчів
    var keys = Object.keys(udGameReports).sort(function(a, b) {
        if (udGameReports[a].date > udGameReports[b].date) return -1
        else if (udGameReports[a].date < udGameReports[b].date) return +1
        else return 0
    })
    // HTML
    var html = '<table class="game-reports"><thead><tr><th class="game-reports">'
    + txtDate + '</th><th class="game-reports">'
    + txtOpponent + '</th><th class="game-reports">'
    + txtScore + '</th><th class="game-reports">'
    + txtOA + '</th><th class="game-reports">'
    + txtPosition + '</th><th class="game-reports">'
    + txtAttendance + '</th class="game-reports">'
    + (sport === 'basketball' ? '<th class="game-reports">' + txtTicketPrice + '</th>' : '')
    + '</tr></thead><tbody>'
    $.each(keys, function(i, game_id) {
        // Виводиться інформація тільки про домашні матчі
        var gameReport = udGameReports[game_id]
        if (!gameReport.host) return
        // Перебираються тільки останні 31 матч
        if (i >= 30) return false
        // HTML — TR
        var reportLink = reportBaseLink.replace('%lang%', lang).replace('%game_id%', game_id)
        html += '<tr>'
        + '<td class="game-reports">' + new Date(gameReport.date).toLocaleDateString() + '</td>'
        + '<td class="game-reports"><a href="https://' + sport + '.powerplaymanager.com/' + lang + '/team.html?data=' + gameReport.opponent_id + '" target="_blank">'
        + gameReport.opponent_name + '</a></td>'
        + '<td class="game-reports"><a href="' + reportLink + '" target="_blank">' + gameReport.goals[1 - gameReport.host] + ':' + gameReport.goals[gameReport.host] + '</a></td>'
        + '<td class="game-reports">' + (gameReport.oa ? gameReport.oa : '') + '</td>'
        + '<td class="game-reports">' + (gameReport.pos ? gameReport.pos : '') + '</td>'
        + '<td class="game-reports">' + gameReport.attendance + '</td>'
        + (sport === 'basketball' ? '<td class="game-reports">' + gameReport.ticketPrice + '</td>' : '')
        + '</tr>'
    })
    html += '</tbody></table>'
    $('#ext-content').html(html)
}

// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————— ЗАКЛАДКА "ПРОФІЛЬ ГРАВЦЯ"
// Читання даних з профілю гравця
function readPlayerProfileData(player_id) {
    var player = userdata.players[player_id]
    if (typeof player != 'object') {
        userdata.players[player_id] = {name: $('.player_info a[href*="player"]').text(), training: {}, cl: {}, my: false}
        player = userdata.players[player_id]
    }
    var trs = $('#table-1 tbody tr')
    var tmp_tds = $(trs[0]).find('td:visible')
    var scouted = !!$(tmp_tds[tmp_tds.length - 4]).find('span[style="color:green"]').length
    // Атрибути
    attributes.forEach(function(att, i) {
        var tr = trs[i]
        var tds = $(tr).find('td')
        player[att] = parseInt($(tds[1]).text())
        if (scouted) {
            player[att + 'Q'] = parseInt($(tds[2]).text())
        } else {
            if (player[att + 'Q'] === undefined) player[att + 'Q'] = parseInt($(tds[2]).text())
            var html = '<input type="number" value="' + player[att + 'Q'] + '" min="1" max="99" data-ode-player="' + player_id + '" data-ode-quality="' + att + '">'
            $(tds[2]).append(html)
        }
    })
    $('[data-ode-quality]').change(readQuality)
    // Команда гравця
    var team_id = $('.player_info a[href*="team"]').getId()
    player.my = team_id === my_team_id
}
// Показ історії ТК
function showCLHistory(player_id) {
    var player = userdata.players[player_id]
    if (player === undefined || player.my == false) return false
    // HTML
    var tplTR = '<tr><td class="tr0td1">%age%</td><td class="tr0td1">%cl%/6</td></tr>'
    var tbody = ''
    Object.keys(player.cl).reverse().forEach(function(age) {
        if (parseInt(age)) tbody += tplTR.replace(/%age%/, parseInt(age)).replace(/%cl%/, player.cl[age])
    })
    var html = '<table id="cl-history" class="table" cellspacing="0" cellpadding="0">'
    + '<thead><tr></tr><td style="border-bottom: 1px solid white;" colspan="2">' + txtCLHistory + '</td>'
    + '<tr><td>' + txtAge + '</td><td class="th1">' + txtCL + '</td></tr></thead><tbody>'
    + tbody + '</tbody></table>'
    // Вивід
    $('.profile_player_center').append(html)
}
// Показ історії тренування
function showPracticeHistory(player_id) {
    var player = userdata.players[player_id]
    if (player === undefined || player.my == false) return false
    // Тренування
    var s = 0
    var c = 0
    var practiceTRs = []
    Object.keys(player.training).reverse().forEach(function(sday_rough) {
        var practiceTR = '<tr><td>' + makeSDdate(sday_rough) + '</td>'
        attributes.forEach(function(attribute, i) {
            if (player.training[sday_rough].att == i) {
                practiceTR += '<td>' + player.training[sday_rough].progress + '</td>'
            } else {
                practiceTR += '<td></td>'
            }
        })
        practiceTR += '</tr>'
        practiceTRs.push(practiceTR)
        // Розрахунок середнього зваженого приросту
        var q = parseInt(player[attributes[player.training[sday_rough].att] + 'Q'])
        var p = parseFloat(player.training[sday_rough].progress)
        if (q && p) {
            s += p / q
            c++
        }
    })
    // Середній приріст тренування у перерахунку на зважену якість вибраного амплуа
    var avg = c ? s / c : 0
    var avgWeightedGrowth = (avg && player.role && player.wqs) ? Math.round(avg * player.wqs[player.role] * 100) / 100 : false
    // HTML
    var tbody = practiceTRs.join('')
    // Середній приріст тренування у перерахунку на зважену якість вибраного амплуа
    var avg = c ? s / c : 0
    var avgTR = avgWeightedGrowth ? '<tr><td colspan="' + (attributes.length + 1) + '">' + txtAvg4WQ + ': ' + avgWeightedGrowth + '</td></tr>' : ''
    // Підзаголовок — атрибути
    var attrTH = ''
    attributes.forEach(function(attribute, i) {
        attrTH += '<td>' + attribute + '</td>'
    })
    var html = '<table id="training-history" class="table" cellspacing="0" cellpadding="0">'
    + '<thead><tr><td style="border-bottom: 1px solid white;" class="th1" colspan="' + (attributes.length + 1) + '">' + txtPracticeHistory + '</td></tr><tr>'
    + '<td class="th1">' + txtDay + '</td>' + attrTH + '</tr></thead><tbody>' + tbody + avgTR + '</tbody></table>'
    // Вивід
    $('.profile_player_center').append(html)
}
// Читання вручну введеної якості
function readQuality(e) {
    var player_id = parseInt($(e.target).data('ode-player'))
    var att = $(e.target).data('ode-quality')
    userdata.players[player_id][att + 'Q'] = parseInt($(e.target).val())
    setAutoRole4SinglePlayer(player_id)
    showWQ(player_id)
    saveUserdata()
}
// Показ зважених якостей
function showWQ(player_id) {
    var player = userdata.players[player_id]
    if (!player || !player.role) return false
    var html = 'Best: ' + userdata.roles[player.role].name + '<br>'
    Object.keys(userdata.roles).forEach(function(key) {
        var wq = player.hasOwnProperty('wqs') ? player.wqs[key] : ''
        html += userdata.roles[key].name + ' — ' + Math.round(wq * 10) / 10 + '<br>'
    })
    $('#wq').html(html)
}
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————— СТАРТОВА ПОСЛІДОВНІСТЬ ДІЙ
// Виконується після повного завантаження сторінки
$(function() {
    // Перевірка на публічний аккаунт
    if ($('#top_submenu_user >div:first >div:first').text().trim() === 'Public account') return false
    // Визначення виду спорту
    checkSport()
    // Завантаження гравців з локального сховища
    loadUserdata()
    loadGameReports()
    loadTeamData()
    // Головна дія сценарію на сторінці
    switch (pagetype) {
        case 'players-practice':
            // Читання даних гравців
            readPlayerPracticeData()
            // Додавання колонки "Вибір амплуа"
            addPlayerRoleSelectors()
            // Додавання пульту управління на сторінку
            makeControlBoard()
            // TODO: Видалити після оновлення даних у всіх користувачів
            renameTrainingDataKeys()
            break
        case 'player':
        case 'player-profile':
            // У профілі гравця мають бути тримачі зважених якостей, історії ТК та історії тренувань
            $('.column_left').append('<div id="wq"></div>')
            // $('.gray_box.white_box_text').hide() // Ховання реклами — цей самий стиль для області ставок на гравців...
            player_id = $('.player_info a[href*=player]').getId()
            readPlayerProfileData(player_id)
            showWQ(player_id)
            showCLHistory(player_id)
            showPracticeHistory(player_id)
            // Прикрашання
            $('.table thead td:nth-child(odd)').addClass('th1')
            $('.table thead td:nth-child(even)').addClass('th2')
            $('.table tbody tr:nth-child(odd) td:nth-child(odd)').addClass('tr0td1')
            $('.table tbody tr:nth-child(odd) td:nth-child(even)').addClass('tr0td2')
            $('.table tbody tr:nth-child(even) td:nth-child(odd)').addClass('tr1td1')
            $('.table tbody tr:nth-child(even) td:nth-child(even)').addClass('tr1td2')
            break
        case 'finances':
            makeFinancesControlBoard()
            readFinances()
            break
        case 'contracts':
        case 'player-contracts':
            readPlayerContracts()
            break
        case 'overview-of-players':
            updatePlayersOverview()
            break
        case 'team-news':
            checkLastDayOfSeason()
            break
        case 'lineup':
        case 'line-up':
        case 'lines':
            readLineup()
            updateLineup()
            break
        case 'team':
            parseTeamProfile4OTR($('html').html())
            showStat4OTR()
            teamInitAction()
            break
        case 'arena':
        case 'stadium':
            arenaInitAction()
            showStat4Attendance()
            break
        case 'calendar':
            calendarInitAction()
            break
       case 'game-summary':
       case 'match-report':
            reportInitAction()
            break
    }
    // Читання ЗРК, якщо воно сьогодні ще не було прочитане
    var hasOTRBeenReadToday = !!getCookie('de-otr')
    if (hasOTRBeenReadToday) getTeamProfile4OTR()
    // Збереження даних
    saveUserdata()
    saveGameReports()
    saveTeamData()
    // Зовнішнє дублювання даних
    doExtSave(true)
})
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————— ДОПОМІЖНІ ФУНКЦІЇ
// Якщо це останній день сезону, потрібно прочитати фінансові дані
function checkLastDayOfSeason() {
    if (curDay == seasonLength) {
        if (userdata.finances[curSeason].day < curDay) {
            window.location.href = window.location.href.replace('team-news', 'finances')
            alert(txtReadLastDayFinances)
        }
    }
}
// Приведення дати до формату, в якому вона входить у календарний URL — https://hockey.powerplaymanager.com/uk/calendar.html?data=38461-01-08-2015
function makeDate4Calendar(monthShift) {
    var d = new Date()
    d.setMonth(d.getMonth() + monthShift)
    var year = d.getFullYear()
    var month = d.getMonth() + 1
    if (month < 10) month = '0' + month
    var day = d.getDate()
    if (day < 10) day = '0' + day
    return '-' + day + '-' + month + '-' + year
}
// Чи потрібно записувати інформацію про суперника — потрібно, якщо гра відбулася менше 10 діб тому
function isTeamInfoNeeded(gameReport) {
    return ((new Date() - new Date(gameReport.date)) / 1000 < (3600 * 24 * 10))
}
// Приведення дати до формату "s{сезон}d{день}"
function makeSDdate(sday_rough) {
    var sday = parseInt(sday_rough)
    if (sday != sday_rough) sday = Math.floor((new Date(sday_rough) - preDate) / (3600000 * 24))
    var sea = Math.ceil(sday / seasonLength)
    var dos = sday - (sea - 1) * seasonLength
    return 's' + sea + 'd' + dos
}
// Прогноз зросту баскетболіста
function makeHeightPrediction(player) {
    var prediction = player.height
    if (player.age <= 18 && player.init_height && player.init_height_day < sportDay) {
        prediction = player.init_height + Math.round((player.height - player.init_height) / (sportDay - player.init_height_day))
    }
    return prediction
}
// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ТИМЧАСОВІ ФУНКЦІЇ
// Очистка записів тренування гравців від нульових приростів
function clearUserDataFromZeroProgress() {
    // if userdata.ZPisCleared == false
    Object.keys(userdata.players).forEach(function(p) {
        Object.keys(userdata.players[p].training).forEach(function(d) {
            if (!userdata.players[p].training[d].progress) {
                delete userdata.players[p].training[d]
            }
        })
    })
    // Очистку проведено
    userdata.ZPisCleared = true
    // Запис почищених даних
    saveUserdata()
    // TODO: Потрібно буде почистити userdata.players[10231007].expH — історію приросту досвіду
}

// ————————————————————————————————————————————————————————————————————————————————————————————————————
// ПРИНЦИП РОБОТИ (НЕОФОРМЛЕНО)
// Першим ділом мають бути визначені вид спорту, сезон, день сезону, ідентифікатори менеджера та команди (процедура checkSport)
// Далі мають бути завантажені з локального сховища (запасний варіант — з сервера) користувацькі дані (процедура loadUserdata)
// Далі мають бути прочитані дані зі сторінки

// V15. Виправлене оновлення з мережевого бекапу
// V16. Сценарій тепер працює на сторінках Фінанси, Гравці — Контракти, Гравці — Огляд (де показує зважену якість для вибраної позиції, а не середню якість)
// V17. Дрібні поправки. Новий домен
// V18. Нарешті нормально виправлене оновлення з мережевого бекапу
// V19. Збереження досвіду (зокрема у новий об’єкт player.expH), дії на сторінці "Склад команди", читання історії ЗРК, читання відвідуваності
// V20. Змінений показ історії ТК та історії тренування. Для баскетболістів доданий запис початкового зросту
// V21. Забране прибирання реклами з профілю гравця — цей самий стиль для області ставок використовується
// V23. Переїзд на HTTPS
// V24. Приріст тренування 0 не записується