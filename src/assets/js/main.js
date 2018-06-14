/**
 * Created by sanchez 
 */
'use strict';

//check the environment
// if (process.env.NODE_ENV !== 'production') {
//     console.log('Looks like we are in development mode!');
// }

// import CSS
// import animate_css from 'animate.css/animate.min.css';
import css from '../css/css.css';

// import Js Plugins/Entities

//ES6 Module
import Bar1 from './entities/Bar1';


import * as PIXI from 'pixi.js'

window.h5 = {
    initCanvas: function() {
        var wh = window.innerWidth;
        var ww = window.innerHeight;
        var app = new PIXI.Application();
        document.getElementById('canvas-wrapper').appendChild(app.view);
        PIXI.loader.add('umbrella', './assets/img/umbrella.png').load(onStart);
        app.ticker.add(function() {
            app.render(app.stage);
        });

        function onStart() {
            var ub = new PIXI.Sprite.fromImage('umbrella');
            // ub.x = app.screen.width / 2;
            // ub.y = app.screen.height / 2;
            // ub.anchor.set(0.5);
            app.stage.addChild(ub);

            var pixelA = app.renderer.plugins.extract.pixels(ub);
            console.log(pixelA);

            console.log(ub.width, ub.height);

            var w = 256;
            var h = 256;
            var pixels = [];

            for (var i = 0; i < pixelA.length; i += 4) {

                pixels.push({ r: pixelA[i], g: pixelA[i + 1], b: pixelA[i + 2], a: pixelA[i + 3] });

            }
            // console.log(pixels)

             document.getElementById('canvas-wrapper').addEventListener('mousemove',function(event){
                var x=Math.round(event.clientX);
                var y=Math.round(event.clientY);
                document.getElementById('op').innerHTML='R: ' + pixels[y*ub.width+x].r + '<br>G: ' + pixels[y*ub.width+x].g + '<br>B: ' + pixels[y*ub.width+x].b + '<br>A: ' + pixels[y*ub.width+x].a;
            
            })
            for (var gridX = 0; gridX < ub.width; gridX++) {
                for (var gridY = 0; gridY < ub.height; gridY++) {
                    var tileWidth = w / ub.width;
                    var tileHeight = h / ub.height;
                    var posX = tileWidth * gridX;
                    var posY = tileHeight * gridY;
                    var c = pixels[Math.ceil(gridY * ub.width + gridX)];
                    var greyscale = Math.round(c.r * 0.222 + c.g * 0.707 + c.b * 0.071);
                    var w1 = _map(greyscale, 0, 255, 15, 0.1);
                    // console.log(greyscale);
                    var color16 = ('0' + c.r.toString(16)).slice(-2) + ('0' + c.g.toString(16)).slice(-2) + ('0' + c.b.toString(16)).slice(-2);

                    drawG(posX, posY, 2, parseInt(color16, 16));

                }
            }
        }


        function drawG(x, y, w1, c) {
            var g = new PIXI.Graphics();
            g.beginFill(c);
            var l = w1 * 2;
            g.drawRect(x, y, l, l);
            g.endFill();
            app.stage.addChild(g);
        }

        function _map(t, e, r, o, n) {

            return (t - e) / (r - e) * (n - o) + o;

        }

    },
    isPc: function() {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod');
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
    },
    rootResize: function() {
        //orientation portrait width=750px height=1334px / WeChat width=750px height=1206px 
        var wFsize;
        //screen.width screen.height  bug !!!
        // var wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width :
        //     window.innerWidth : window.innerWidth;
        // var wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ?
        //     screen.height : window.innerHeight : window.innerHeight;
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;
        if (wWidth > wHeight) {
            wFsize = wHeight / 750 * 100;
        } else {
            wFsize = wWidth / 750 * 100;
        }
        document.getElementsByTagName('html')[0].style.fontSize = wFsize + 'px';
    },
    eventInit: function() {
        var that = this;
        document.addEventListener('touchstart', function(e) {}, false);
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);
        return that;
    },
    cssInit: function() {
        var that = this;
        var noChangeCountToEnd = 100,
            noEndTimeout = 1000;
        that.rootResize();
        window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function() {
            var interval,
                timeout,
                end,
                lastInnerWidth,
                lastInnerHeight,
                noChangeCount;
            end = function() {
                // "orientationchangeend"
                clearInterval(interval);
                clearTimeout(timeout);
                interval = null;
                timeout = null;
                that.rootResize();
            };
            interval = setInterval(function() {
                if (window.innerWidth === lastInnerWidth && window.innerHeight === lastInnerHeight) {
                    noChangeCount++;
                    if (noChangeCount === noChangeCountToEnd) {
                        // The interval resolved the issue first.
                        end();
                    }
                } else {
                    lastInnerWidth = window.innerWidth;
                    lastInnerHeight = window.innerHeight;
                    noChangeCount = 0;
                }
            });
            timeout = setTimeout(function() {
                // The timeout happened first.
                end();
            }, noEndTimeout);
        });

        return that;
    },
    init: function() {
        var that = this;
        that.initCanvas();
    }
};
window.onload = function() {
    window.h5.init();
};

//Stats JavaScript Performance Monitor

//import Stats from 'stats.js';
//showStats();
// function showStats() {
//     var stats = new Stats();
//     stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
//     var fs = document.createElement('div');
//     fs.style.position = 'absolute';
//     fs.style.left = 0;
//     fs.style.top = 0;
//     fs.style.zIndex = 999;
//     fs.appendChild(stats.domElement);
//     document.body.appendChild(fs);

//     function animate() {
//         stats.begin();
//         // monitored code goes here
//         stats.end();
//         requestAnimationFrame(animate);
//     }
//     requestAnimationFrame(animate);
// }