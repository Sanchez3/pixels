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
import { TweenMax } from "gsap/TweenMax";
// import Js Plugins/Entities

//ES6 Module

import * as PIXI from 'pixi.js'

window.h5 = {
    initCanvas: function() {
        var ggroup;
        var wh = window.innerWidth;
        var ww = window.innerHeight;
        var app = new PIXI.Application();
        document.getElementById('canvas-wrapper').appendChild(app.view);
        PIXI.loader.add('umbrella', './assets/img/umbrella.png').load(onStart);
        app.ticker.add(function() {
            app.render(app.stage);
        });

        function onStart() {
            var w = 600;
            // var h = 256;
            var pixels = [];
            var ub = new PIXI.Sprite.fromImage('umbrella');
            // ub.x = app.screen.width / 2;
            // ub.y = app.screen.height / 2;
            // ub.anchor.set(0.5);
            ub.alpha = 0;
            app.stage.addChild(ub);
            ggroup = new PIXI.Container();
            ggroup.x = 100;
            ggroup.y = (600 - 6 / 8 * 600) / 2;
            app.stage.addChild(ggroup);

            var pointerCir = new PIXI.Circle(0, 0, 100);
            ggroup.interactive = true;
            var dragging = false;
            ggroup.on('pointerdown', function() {
                console.log('down');
                dragging = true
            });
            ggroup.on('pointerover', function() {
                console.log('over');
                dragging = true
            });
            ggroup.on('pointerup', onDragEnd)
            ggroup.on('pointerupoutside', onDragEnd)

            function onDragEnd() {
                dragging = false;
            }

            var gtween = [];
            ggroup.on('pointermove', function(e) {
                if (dragging) {
                    var newPosition = e.data.getLocalPosition(this);
                    pointerCir.x = newPosition.x;
                    pointerCir.y = newPosition.y;
                    for (var i = ggroup.children.length - 1; i >= 0; i--) {
                        if (pointerCir.contains(ggroup.children[i].x, ggroup.children[i].y) && !gtween[i]) {
                            (function(i) {
                                gtween[i] = TweenMax.to(ggroup.children[i], 0.5, {
                                    x: function() {
                                        if (Math.random() > 0.5) {
                                            return '+=3';
                                        } else {
                                            return '-=3';
                                        }
                                    },
                                    y: function() {
                                        if (Math.random() > 0.5) {
                                            return '+=3';
                                        } else {
                                            return '-=3';
                                        }
                                    },
                                    yoyo: true,
                                    repeat: 1,
                                    delay: Math.random() * 2,
                                    // ease: Bounce.easeInOut,
                                    onComplete: function() {
                                        gtween[i] = 0;
                                        // console.log(gtween)
                                    }
                                });
                            })(i)


                        }
                    }
                }

            });

            function containsG() {
                for (var i = ggroup.children.length - 1; i >= 0; i--) {
                    if (pointerCir.contains(ggroup.children[i].x, ggroup.children[i].y)) {

                        TweenMax.to(ggroup.children[i], 0.5, { alpha: 0, yoyo: true, repeat: 1 });
                    }
                }
            }

            var pixelA = app.renderer.plugins.extract.pixels(ub);
            console.log(pixelA);

            console.log(ub.width, ub.height);



            for (var i = 0; i < pixelA.length; i += 4) {

                pixels.push({ r: pixelA[i], g: pixelA[i + 1], b: pixelA[i + 2], a: pixelA[i + 3] / 255 });

            }
            // console.log(pixels)

            // document.getElementById('canvas-wrapper').addEventListener('mousemove', function(event) {
            //     var x = Math.round(event.clientX);
            //     var y = Math.round(event.clientY);
            //     document.getElementById('op').innerHTML = 'R: ' + pixels[y * ub.width + x].r + '<br>G: ' + pixels[y * ub.width + x].g + '<br>B: ' + pixels[y * ub.width + x].b + '<br>A: ' + pixels[y * ub.width + x].a;

            // })
            for (var gridX = 0; gridX < ub.width; gridX += 3) {
                for (var gridY = 0; gridY < ub.height; gridY += 3) {
                    var tileWidth = w / ub.width;
                    var tileHeight = w / ub.height;
                    var posX = tileWidth * gridX;
                    var posY = tileWidth * gridY;
                    var c = pixels[Math.ceil(gridY * ub.width + gridX)];
                    var greyscale = Math.round(c.r * 0.222 + c.g * 0.707 + c.b * 0.071);
                    var w1 = _map(greyscale, 0, 255, 15, 0.1);
                    // console.log(greyscale);

                    drawG(posX, posY, 2, c);

                }
            }
        }


        function drawG(x, y, w1, c) {
            var color16 = ('0' + c.r.toString(16)).slice(-2) + ('0' + c.g.toString(16)).slice(-2) + ('0' + c.b.toString(16)).slice(-2);
            var g = new PIXI.Graphics();
            if (c.a !== 0) {
                g.beginFill(parseInt(color16, 16), c.a);
                var l = w1 * 2;
                g.drawRect(0, 0, l, l);
                g.endFill();
                g.x = x;
                g.y = y;
                ggroup.addChild(g);
            }
        }

        function _map(t, e, r, o, n) {

            return (t - e) / (r - e) * (n - o) + o;

        }

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

import Stats from 'stats.js';
showStats();

function showStats() {
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    var fs = document.createElement('div');
    fs.style.position = 'absolute';
    fs.style.left = 0;
    fs.style.top = 0;
    fs.style.zIndex = 999;
    fs.appendChild(stats.domElement);
    document.body.appendChild(fs);

    function animate() {
        stats.begin();
        // monitored code goes here
        stats.end();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}