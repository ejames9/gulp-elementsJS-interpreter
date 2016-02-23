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
 make('#container').put(main);
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
  make('#footer').put("document.body");
 make('#tap').put(document.body);
 make('#slip').put(document.body);
 make('#hillside').put('#slip');
 make('.apples').put('#hillside');
 make('#cherry').put('#hillside');
 [
 make('.switch', "button").put('#hillside')
,make('.switch', "button").put('#hillside')
]

           .on('click', fuckOff);
3 /*--------------------------------------------------------*/ 3
  make('#header').put(document.body);
 [
 make(".button0", "button").put('#header')
,make(".button1", "button").put('#header')
]

           .on('docready', fuckOnn);
4 /*--------------------------------------------------------*/ 4
 [
 make('.submit', "button").put(body)
,make('.submit', "button").put(body)
,make('.submit', "button").put(body)
,make('.submit', "button").put(body)
,make('.submit', "button").put(body)
]

                .width('200px')
                .height('100px')
                .backgroundColor('transparent')
                .border('1px solid white')
                .borderRadius('10px')
                .on('click', exeCute);
5 /*--------------------------------------------------------*/ 5
 make('#footer').put(document.body);
 make('#tab').put('#footer');
 [
 make('.buttons').put('#footer')
,make('.buttons').put('#footer')
]

                      .on('click', fuckOff);
6 /*--------------------------------------------------------*/ 6
 make('#header').put("document.body")
          .on('docready', fuckOnn);
7 /*--------------------------------------------------------*/ 7
 make('#input', "input").put("document.body");
 make(".button1", "button").put(document.body);
 make('#header').put(document.body);
 make('#footer').put(document.body);
 make('.mid-left-of-center').put(document.body);
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
 make('#submit', "button").put(body)
                .width('200px')
                .height('100px')
                .backgroundColor('transparent')
                .border('1px solid white')
                .borderRadius('10px')
                .on('click', exeCute);
 /*--------------------------------------------------------*/
