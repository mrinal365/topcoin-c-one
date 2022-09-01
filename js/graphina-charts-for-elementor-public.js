(function ($) {
    'use strict';

    /**
     * All of the code for your public-facing JavaScript source
     * should reside in this file.
     *
     * Note: It has been assumed you will write jQuery code here, so the
     * $ function reference has been prepared for usage within the scope
     * of this function.
     *
     * This enables you to define handlers, for when the DOM is ready:
     *
     * $(function() {
     *
     * });
     *
     * When the window is loaded:
     *
     * $( window ).load(function() {
     *
     * });
     *
     * ...and/or other possibilities.
     *
     * Ideally, it is not considered best practise to attach more than a
     * single DOM-ready or window-load handler for a particular page.
     * Although scripts in the WordPress core, Plugins and Themes may be
     * practising this, we should strive to set a better example in our own work.
     */

    $(window).load(() => {
        let ele = $('.chart-card');
        addRemoveClass(ele.find('h4'), 'graphina-chart-heading');
        addRemoveClass(ele.find('p'), 'graphina-chart-sub-heading');
    })

    $(document).ready(function(){
        setTimeout(() => {
            window.scrollTo(0, window.pageYOffset + 1);
            window.scrollTo(0, window.pageYOffset - 1);
        },800);
    });

    // Graphina Feature Request For Elementor Panel
    document.addEventListener('DOMContentLoaded', function() { 
        if(parent.document.querySelector('.elementor-editor-active') !== null) {
            let _graphina_get_help = '' ; 
            let _graphina_get_help_url = "https://iqonic.design/feature-request/?for_product=graphina" ; 
            setInterval( function() {  
                if(parent.document.querySelector('[class*=elementor-control-iq]') != null) {
                    _graphina_get_help = parent.document.querySelector('#elementor-panel__editor__help__link');
                    if(_graphina_get_help != null) {  
                        if( _graphina_get_help.getAttribute("href") !== _graphina_get_help_url ) {
                            _graphina_get_help.setAttribute("href", _graphina_get_help_url );
                            _graphina_get_help.innerHTML = "<b> Graphina Feature Request <i class='eicon-editor-external-link'></i> </b>" ;
                        }
                    }
                }
            }, 3000)
        }
    });

})(jQuery);


/***********************
 * Variables
 */
if (typeof fadein == "undefined") {
    var fadein = {};
}
if (typeof fadeout == "undefined") {
    var fadeout = {};
}
if (typeof isInit == "undefined") {
    var isInit = {};
}

function resetGraphinaVars(){
    if(typeof graphina_localize.graphinaAllGraphs == "undefined"){
        graphina_localize.graphinaAllGraphs = {};
    }
    if(typeof graphina_localize.graphinaAllGraphsOptions == "undefined"){
        graphina_localize.graphinaAllGraphsOptions = {};
    }
    if(typeof graphina_localize.graphinaBlockCharts == "undefined"){
        graphina_localize.graphinaBlockCharts = {};
    }
}
resetGraphinaVars();

/***************
 * Jquery Base
 * @param ele
 * @param add
 * @param remove
 */

function addRemoveClass(ele, add = '', remove = '') {
    if (remove !== '' && ele.hasClass(add)) ele.removeClass(remove);
    if (add !== '' && !ele.hasClass(add)) ele.addClass(add);
}

/************
 *
 * @param timestamp
 * @param isTime
 * @param isDate
 * @returns {string}
 */

function dateFormat(timestamp, isTime = false, isDate = false) {
    let dateSeparator = '-';
    let date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear()
    return (isDate ? (day + dateSeparator + month + dateSeparator + year) : '') + (isDate && isTime ? ' ' : '') + (isTime ? (hours + ':' + minutes.substr(-2)) : '');
}

/********************
 *
 * @param date1
 * @param date2
 * @returns {string}
 */
function timeDifference(date1, date2) {
    let difference = new Date(date2).getTime() - new Date(date1).getTime();

    let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24

    let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60

    let minutesDifference = Math.floor(difference / 1000 / 60);

    return getPostfix(daysDifference, 'day', 'days')
        + (daysDifference > 0 && hoursDifference > 0 ? ' ' : '')
        + getPostfix(hoursDifference, 'hour', 'hours')
        + (hoursDifference > 0 && minutesDifference > 0 ? ' ' : '')
        + getPostfix(minutesDifference, 'minute', 'minutes');
}

/*********************
 *
 * @param value
 * @param postfix1
 * @param postfix2
 * @returns {string}
 */
function getPostfix(value, postfix1, postfix2) {
    let result = ''
    switch (true) {
        case value === 0:
            break;
        case value === 1:
            result += value + ' ' + postfix1;
            break;
        case value > 1:
            result += value + ' ' + postfix2;
            break;
    }
    return result;
}


/*******************
 *
 * @param svg
 * @param mainId
 */

function adjustSize(svg, mainId) {
    const innerHeight = getInnerHeightWidth(document.querySelector('#animated-radial_' + mainId), 'height');
    const innerWidth = getInnerHeightWidth(document.querySelector('#animated-radial_' + mainId), 'width');
    svg[mainId].attr("width", innerWidth).attr("height", innerHeight);
}

/************************
 *
 * @param elm
 * @param type
 * @returns {number}
 */

function getInnerHeightWidth(elm, type) {
    let computed = getComputedStyle(elm);
    let padding = 0;
    let val = 0;
    switch (type) {
        case 'height':
            padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);
            val = elm.clientHeight - padding;
            break;
        case 'width':
            padding = parseInt(computed.paddingLeft) + parseInt(computed.paddingRight);
            val = elm.clientWidth - padding;
            break;
    }
    return val;
}

/**********************************
 *
 * @param main_id
 * @param n
 * @param g
 * @param interval
 * @param animeSpeed
 * @param bars
 * @param animatedRadialChartHeight
 */

function update(main_id, n = [], g = [], interval = [], animeSpeed = [], bars = [], animatedRadialChartHeight = []) {
    if (typeof g[main_id] === "undefined") {
        clearInterval(interval[main_id]);
    }

    n[main_id] += parseFloat(animeSpeed[main_id]);
    g[main_id].selectAll("rect")
        .data(bars[main_id])
        .attr("width", d => (parseFloat(animatedRadialChartHeight[main_id]) + noise.perlin3(d, 1, n[main_id]) * 160));
}

/****************************************
 *
 * @param main_id
 * @param svg
 * @param g
 * @param bars
 * @param radialGradient
 * @param animatedRadialChartColor
 * @param animatedRadialChartLineSpace
 */

function drawBars(main_id, svg, g, bars, radialGradient, animatedRadialChartColor, animatedRadialChartLineSpace) {
    if (typeof svg[main_id] !== "undefined") {
        d3.selectAll("#animated-radial_" + main_id + " svg > *").remove();
    }
    svg[main_id] = d3.select("#animated-radial_" + main_id + " svg");
    adjustSize(svg, main_id)

    g[main_id] = svg[main_id].append("g").attr("transform", `translate(${960 / 2},${560 / 2})`);

    bars[main_id] = d3.range(0, 120);

    radialGradient[main_id] = svg[main_id]
        .append("defs")
        .append("radialGradient")
        .attr("id", "radial-gradient-" + main_id)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", "30%");

    radialGradient[main_id]
        .append("stop")
        .attr("offset", "60%")
        .attr("stop-color", animatedRadialChartColor[main_id].gradient_1);

    radialGradient[main_id]
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", animatedRadialChartColor[main_id].gradient_2);

    g[main_id].append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 80)
        .attr("stroke", animatedRadialChartColor[main_id].stroke_color)
        .attr("fill", "none")
        .attr("text", "none");

    g[main_id].selectAll("rect")
        .data(bars[main_id])
        .enter()
        .append("rect")
        .attr("x", 100)
        .attr("y", 0)
        .attr("width", 100)
        .attr("height", 6)
        .attr("fill", "url(#radial-gradient-" + main_id + ")")
        .attr("transform", d => `rotate(${d * animatedRadialChartLineSpace[main_id]})`);
}

/************************************
 *
 * @param mainId
 * @param svg
 * @param g
 * @param bars
 * @param radialGradient
 * @param animatedRadialChartColor
 * @param animatedRadialChartLineSpace
 * @param n
 * @param interval
 * @param animeSpeed
 * @param animatedRadialChartHeight
 */

function initAnimatedRadial(mainId, svg, g, bars, radialGradient, animatedRadialChartColor, animatedRadialChartLineSpace, n, interval, animeSpeed, animatedRadialChartHeight) {
    window.addEventListener("resize", () => {
        adjustSize(svg, mainId)
    });
    drawBars(mainId, svg, g, bars, radialGradient, animatedRadialChartColor, animatedRadialChartLineSpace)
    update(mainId, n, g, interval, animeSpeed, bars, animatedRadialChartHeight);
    if (typeof interval !== undefined && typeof interval[mainId] !== undefined) {
        adjustSize(svg, mainId);
        drawBars(mainId, svg, g, bars, radialGradient, animatedRadialChartColor, animatedRadialChartLineSpace)
        clearInterval(interval[mainId]);
    }
    interval[mainId] = setInterval(function () {
        update(mainId, n, g, interval, animeSpeed, bars, animatedRadialChartHeight);
    }, 50);
}

function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        (
            (rect.top - ((window.innerHeight || document.documentElement.clientHeight) / 2.1)) >= 0 &&
            (rect.bottom - ((window.innerHeight || document.documentElement.clientHeight) / 1.9)) <= (window.innerHeight || document.documentElement.clientHeight)
        )
        ||
        (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        )
    );
}

function initNowGraphina(myElement, chart, id) {
    resetGraphinaVars();
    if (id in graphina_localize.graphinaAllGraphs) {
        graphina_localize.graphinaAllGraphs[id].destroy();
        delete graphina_localize.graphinaAllGraphs[id];
        delete graphina_localize.graphinaBlockCharts[id];
    }
    graphina_localize.graphinaAllGraphsOptions[id] = chart;
    isInit[id] = false;
    getChart(graphina_localize.graphinaAllGraphsOptions[id].ele, id);
    document.addEventListener('scroll', function () {
        getChart(graphina_localize.graphinaAllGraphsOptions[id].ele, id);
    });
}

function getChart(myElement, id) {
    if (typeof ApexCharts == 'function' && myElement !== null
        && isInViewport(myElement) && (id in isInit) && isInit[id] === false) {
        setTimeout(() => {
            if (isInit[id] === false) {
                initGraphinaCharts(id);
            }
        },1000);
    }
}

function initGraphinaCharts(id) {
    if(Object.keys(graphina_localize.graphinaBlockCharts).includes(id)){
        if (isInit[id] === true){
            graphina_localize.graphinaAllGraphs[id].destroy();
        }
        graphina_localize.graphinaAllGraphsOptions[id].ele.innerHTML='';
        graphina_localize.graphinaAllGraphsOptions[id].ele.innerHTML = graphina_localize.graphinaBlockCharts[id];
    } else {
        if (isInit[id] === true || graphina_localize.graphinaAllGraphs[id]) {
            let option = graphina_localize.graphinaAllGraphsOptions[id].options;
            let series = option.series;
            // delete option.series;
            graphina_localize.graphinaAllGraphs[id].updateOptions(option, true, graphina_localize.graphinaAllGraphsOptions[id].animation);
            graphina_localize.graphinaAllGraphs[id].updateSeries(series, graphina_localize.graphinaAllGraphsOptions[id].animation);
        } else {
            graphina_localize.graphinaAllGraphs[id] = new ApexCharts(graphina_localize.graphinaAllGraphsOptions[id].ele, graphina_localize.graphinaAllGraphsOptions[id].options);
            graphina_localize.graphinaAllGraphs[id].render();
            isInit[id] = true;
        }
    }
}
// function updateChartType(select,id){
//     var x = document.getElementById(select).value;
//     if( x == 'area'){
//         graphina_localize.graphinaAllGraphs[id].updateOptions({
//             chart: {
//                 type: x
//             },
//             fill:{
//                 opacity:0.4
//             },
//             pattern:{
//
//             }
//         })
//     }
//     else{
//         graphina_localize.graphinaAllGraphs[id].updateOptions({
//             chart: {
//                 type: x
//             }
//         })
//     }
// }

function chartDatalabelsFormat( option, showlabel, showValue, numberformat, prefix, postfix, valueInStringShow, valueInString ){

    if(showlabel =='yes' && showValue == 'yes'){
        return option.dataLabels.formatter = function (val, opt) {
            if(numberformat == "yes"){
                opt.w.config.series[opt.seriesIndex] = opt.w.config.series[opt.seriesIndex].toLocaleString()
            }else{
                opt.w.config.series[opt.seriesIndex] = valueInStringShow == 'no' ? opt.w.config.series[opt.seriesIndex] : graphinaAbbrNum(opt.w.config.series[opt.seriesIndex] , valueInString);
            }
            return prefix + opt.w.config.labels[opt.seriesIndex] + '-'+ opt.w.config.series[opt.seriesIndex] + postfix
        }
    }
    else if(showlabel =='yes'){
        return option.dataLabels.formatter = function (val, opt) {
            if(numberformat == "yes"){
                opt.w.config.series[opt.seriesIndex] = opt.w.config.series[opt.seriesIndex].toLocaleString()
            }else{
                opt.w.config.series[opt.seriesIndex] = valueInStringShow == 'no' ? opt.w.config.series[opt.seriesIndex] : graphinaAbbrNum(opt.w.config.series[opt.seriesIndex] , valueInString);
            }
            return prefix + opt.w.config.labels[opt.seriesIndex] + '-' + parseFloat(val).toFixed(1)+'%'   + postfix
        }
    }
    else if(showValue == 'yes'){
        return option.dataLabels.formatter = function (val, opt) {
            opt.w.config.series[opt.seriesIndex] = valueInStringShow == 'no' ? opt.w.config.series[opt.seriesIndex] : graphinaAbbrNum(opt.w.config.series[opt.seriesIndex] , valueInString);
            return prefix + opt.w.config.series[opt.seriesIndex] + postfix
        }
    }
    else {
        return option.dataLabels.formatter = function (val, opt) {
            return prefix + parseFloat(val).toFixed(1)+'%'  +postfix;
        }
    }

}

function axisTitle(option, type ,title, style){
    return option[type]['title']= {
        text: title,
        offsetX: 0,
        offsetY: 0,
        style,
    }
}


function instantInitGraphinaCharts(id) {
    graphina_localize.graphinaAllGraphs[id] = new ApexCharts(graphina_localize.graphinaAllGraphsOptions[id].ele, graphina_localize.graphinaAllGraphsOptions[id].options);
    graphina_localize.graphinaAllGraphs[id].render();
    isInit[id] = true;
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param sources
 */
function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (isObject(source[key])) {
                    if (!target[key]) Object.assign(target, {[key]: {}});
                    mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, {[key]: source[key]});
                }
            }
        }
    }

    return mergeDeep(target, ...sources);
}

function chunk(array, size) {
    if (!array) return [];
    const firstChunk = array.slice(0, size);
    if (!firstChunk.length) {
        return array;
    }
    return [firstChunk].concat(chunk(array.slice(size, array.length), size));
}

function graphinaAbbrNum(number, decPlaces) {
    if( number === undefined || number == null){
        return number;
    }
    var negativesign = '';
    if(number < 0){
        negativesign = '-';
        number = Math.abs(number)
    }
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "k", "m", "b", "t" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round(number*decPlaces/size)/decPlaces;

            // Handle special case where we round up to the next abbreviation
            if((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }

            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
        }
    }

    return negativesign + number;
}

function getDataForChartsAjax(request_fields, type, id) {

    if(jQuery('body').hasClass("elementor-editor-active")) {
        let element_x = parent.document.querySelector('[data-setting="iq_' + type + '_chart_sql_builder_x_columns"]');
        let element_y = parent.document.querySelector('[data-setting="iq_' + type + '_chart_sql_builder_y_columns"]');
        if(element_x !== null && element_y !== null) {
            element_x.innerHTML = '' ;
            element_y.innerHTML = '' ;
        }
    };

   jQuery.ajax({
        url: graphina_localize.ajaxurl,
        type: "post",
        data: {
            action: "get_graphina_chart_settings",
            chart_type: type,
            chart_id: id,
            fields: request_fields
        },
        success: function (response) {
            if(document.getElementsByClassName(type+'-chart-'+id).length === 0) {
                return 0;
            }
            if (response.status === true) {
                if(response.fail === true) {

                    graphina_localize.graphinaBlockCharts[response.chart_id] = response.fail_message;
                    initGraphinaCharts(response.chart_id);

                }else {

                    if (response.instant_init === true) {
                        instantInitGraphinaCharts(response.chart_id);
                        graphina_localize.graphinaAllGraphsOptions[response.chart_id].animation = false;
                    }
                    graphina_localize.graphinaAllGraphsOptions[response.chart_id].options = mergeDeep(graphina_localize.graphinaAllGraphsOptions[response.chart_id].options, response.chart_option);
                    if (isInit[response.chart_id] === true) {
                        initGraphinaCharts(response.chart_id);
                    }

                }

                if(request_fields['iq_' + type + '_chart_dynamic_data_option'] !== undefined ) {
                    if ( request_fields['iq_' + type + '_chart_dynamic_data_option'] === "sql-builder") {
                        if(jQuery('body').hasClass("elementor-editor-active")) {
                            setFieldsFromSQLStateMent(request_fields, response, type);
                        };
                    }
                }
             
            }
        },
        error: function () {
            console.log('fail');
        }
    });

}

function setFieldsFromSQLStateMent (request_fields, response, type) {

    let element_x = parent.document.querySelector('[data-setting="iq_' + type + '_chart_sql_builder_x_columns"]');
    let element_y = parent.document.querySelector('[data-setting="iq_' + type + '_chart_sql_builder_y_columns"]');

    if(element_x == null || element_y == null) {
        return ;
    }

    if(response.extra !== undefined && response.extra.sql_fail !== undefined && response.extra.sql_fail !== '' ) {
        let char_element = document.querySelector('[id="' + type + '-chart"]') ;
        if(char_element !==  null) {
            char_element.innerHTML = '' ;
            char_element.innerHTML = "<div class='text-center' style='color:red'> No data found, Please check your sql statement. </div>" ;
        }
        return ;
    }
    
    // graphina pro sql-builder select sql result column
    let db_columns = response.extra.db_column ;

    x_option_tag = '' ;
    y_option_tag = '' ;

    if(db_columns !== undefined &&  db_columns.length !== undefined && db_columns.length > 0) {
        db_columns.forEach(function(currentValue, index, arr) {
            x_axis_selected_field = '' ;
            y_axis_selected_field = '' ;
            if(request_fields['iq_' + type + '_chart_sql_builder_x_columns'].includes(currentValue)) {
                x_axis_selected_field = 'selected' ;
            }
            if(request_fields['iq_' + type + '_chart_sql_builder_y_columns'].includes(currentValue)) {
                y_axis_selected_field = 'selected' ;
            }
            x_option_tag += '<option value="' + currentValue.toLowerCase() + '" ' + x_axis_selected_field + ' > ' + currentValue + '</option>' ;
            y_option_tag += '<option value="' + currentValue.toLowerCase() + '" ' + y_axis_selected_field + ' > ' + currentValue + '</option>' ;
        });
    }
    
    element_x.innerHTML = x_option_tag ;
    element_y.innerHTML = y_option_tag ;

}

function graphinasetCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function graphinaRestrictedPasswordAjax(form,e){
    e.preventDefault()
    jQuery.ajax({
        url: graphina_localize.ajaxurl,
        type: "post",
        data: jQuery(form).serialize(),
        success: function (response) {
        if(response.status === true){
            graphinasetCookie(response.chart, true,1);
            location.reload();
        }
        else{
           jQuery(form).find('.graphina-error').css('display', 'flex');
        }
        }
    });



}