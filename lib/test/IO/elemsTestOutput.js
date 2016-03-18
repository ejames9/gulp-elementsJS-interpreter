// This file tests the elements syntax portion of the elements.js interpreter.
//Testing Testing Testing Testing.

var _ = require('element.js').interpreter;
var imports = require('element.js').imports;



///Begin Module requires///
 
var lodash = require("lodash");
var omit = lodash.omit; 
var deburr = lodash.deburr; 
var each = lodash.each; 
var map = lodash.map; 
    
var elements = require("elements.js");
var on = elements.on; 
var off = elements.off; 
var put = elements.put; 
var log = elements.log; 
var make = elements.make; 
    
var $ = require("jquery");
     
///End Module requires///
 




1 /*--------------------------------------------------------*/ 1
var _$ = require("elementsJS").$; 
 
 
 
 
_$("main") ? dom("main") :  make(".main1", "main").put("body");
 make('#container').put("main");
 make('#list', "ol").put('#container');
 [
 make('.list-item', "li").put('#list')
,make('.list-item', "li").put('#list')
,make('.list-item', "li").put('#list')
]

                    .color('red')
                    .put('body');
          .color('blue')
          .border('1px solid yellow')
          .borderRadius('25px');
2 /*--------------------------------------------------------*/ 2
 _$('#footer') ? dom('#footer') :  make('#footer').put("body");
 make('#tap').put("body");
 make('#slip').put("body");
 make('#hillside').put('#slip');
 make('.apples').put('#hillside');
 make('#cherry').put('#hillside');
 [
 make('.switch', "button").put('#hillside')
,make('.switch', "button").put('#hillside')
]

           .on('click', fuckOff);
3 /*--------------------------------------------------------*/ 3
 _$('#header') ? dom('#header') :  make('#header').put("body");
 [
 make(".button0", "button").put('#header')
,make(".button1", "button").put('#header')
]

           .on('docready', fuckOnn);
4 /*--------------------------------------------------------*/ 4
_$("body") ? dom("body") :  make(".body1", "body").put("body");
 [
 make('.submit', "button").put("body")
,make('.submit', "button").put("body")
,make('.submit', "button").put("body")
,make('.submit', "button").put("body")
,make('.submit', "button").put("body")
]

                .width('200px')
                .height('100px')
                .backgroundColor('transparent')
                .border('1px solid white')
                .borderRadius('10px')
                .on('click', exeCute);
5 /*--------------------------------------------------------*/ 5
_$('#footer') ? dom('#footer') :  make('#footer').put("body");
 make('#tab').put('#footer');
 [
 make('.buttons').put('#footer')
,make('.buttons').put('#footer')
]

                      .on('click', fuckOff);
6 /*--------------------------------------------------------*/ 6
var elem0 = _$('#header') ? dom('#header') :  make('#header').put("body"); 
	 elem0
          .on('docready', fuckOnn);
7 /*--------------------------------------------------------*/ 7
_$('#input') ? dom('#input') :  make('#input', "input").put("body");
 make(".button1", "button").put("body");
 make('#header').put("body");
 make('#footer').put("body");
 make('.mid-left-of-center').put("body");
 make('#list2', "ol").put('.mid-left-of-center');
 [
 make('.list-points2', "li").put('#list2')
,make('.list-points2', "li").put('#list2')
,make('.list-points2', "li").put('#list2')
]
 make('#list', "ol").put('#list2');
 [
 make('.list-point', "li").put('#list')
,make('.list-point', "li").put('#list')
,make('.list-point', "li").put('#list')
,make('.list-point', "li").put('#list')
]

.on('click', doStuff);
.color('blue');

8 /*--------------------------------------------------------*/ 8
_$("body") ? dom("body") :  make(".body1", "body").put("body");
 make('#submit', "button").put("body")
                .width('200px')
                .height('100px')
                .backgroundColor('transparent')
                .border('1px solid white')
                .borderRadius('10px')
                .on('click', exeCute);
 9 /*--------------------------------------------------------*/ 9

 var elem1 = _$('.submit') ? dom('.submit') : [
 make('.submit', "button").put("body")
,make('.submit', "button").put("body")
,make('.submit', "button").put("body")
]
; 
	 elem1
             .forEach((element, i , a)=> {
                 element
                     .size('60px', '100px')
                     .position('absolute')
                     .border('2px solid white')
                     .top('40px')
                     .left(String(left += 120) + 'px')
                     .borderRadius('10px')
                     .backgroundColor('transparent')
                     .color('white')
                     .html('submit')
                     .zIndex('999')
                     .click(()=> {
                       alert('Hells to the fuck yeah!!!!!');
                     })
                     .only(1, ()=> {
                        element
                            .top('200px')
                            .border('2px solid blue')
                            .backgroundColor('red');
                     }, a)
                     .only(3, ()=> {
                        element
                            .top('200px')
                            .border('2px solid blue')
                            .backgroundColor('green');
                     }, a);
             });

  /*--------------------------------------------------------*/
