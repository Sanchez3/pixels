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

import { PixelateFilter } from '@pixi/filter-pixelate';
// import Js Plugins/Entities

//ES6 Module

import * as PIXI from 'pixi.js'

window.h5 = {
    initCanvas: function() {
        var pcontainer;
        var particlecontainer;
        var sprite;
        var wh = window.innerWidth;
        var ww = window.innerHeight;
        var app = new PIXI.Application({ forceCanvas: false, resolution: window.devicePixelRatio });
        document.getElementById('canvas-wrapper').appendChild(app.view);
        PIXI.loader
            .add('umbrella', './assets/img/umbrella.png')
            .add('sample1', './assets/img/sample1.png')
            .load(onStart);
        app.ticker.add(function() {
            app.render(app.stage);
        });

        function onStart() {
            sprite = new PIXI.Sprite.fromImage('sample1');
            // sprite.x = app.screen.width / 2;
            // sprite.y = app.screen.height / 2;
            // sprite.anchor.set(0.5);
            app.stage.addChild(sprite);
            pcontainer = new PIXI.Container();
            particlecontainer = new PIXI.particles.ParticleContainer(20000, { alpha: false });
            pcontainer.x = 100;
            pcontainer.y = (600 - 6 / 8 * 600) / 2;
            app.stage.addChild(pcontainer);
            // pgraphics = new PIXI.Graphics();
            // useGraphic();
            useFilter();




        }

        function useFilter() {
            pcontainer.addChild(sprite);
            var pixelate = new PixelateFilter(1);
            pcontainer.filters = [pixelate];
            console.log(pixelate)
            var v = { n: 10 };
            TweenMax.to(v, 1, {
                n: 1,
                onUpdate: function() {
                    pcontainer.filters = [new PixelateFilter(v.n)];
                },
                repeat: -1,
                yoyo: true
            })
        }

        function useGraphic() {
            sprite.alpha = 0;
            var w = 400;
            var pointerCir = new PIXI.Circle(0, 0, 100);
            pcontainer.interactive = true;
            var dragging = false;
            var pixels = [];
            var pixelA = app.renderer.plugins.extract.pixels(sprite);

            for (var i = 0; i < pixelA.length; i += 4) {

                pixels.push({ r: pixelA[i], g: pixelA[i + 1], b: pixelA[i + 2], a: pixelA[i + 3] / 255 });
            }
            pcontainer.on('pointerdown', function() {
                console.log('down');
                dragging = true;
            });
            pcontainer.on('pointerover', function() {
                console.log('over');
                dragging = true;
            });
            pcontainer.on('pointerup', onDragEnd)
            pcontainer.on('pointerupoutside', onDragEnd)

            function onDragEnd() {
                dragging = false;
            }

            var gtween = [];
            pcontainer.on('pointermove', function(e) {
                if (dragging) {
                    var newPosition = e.data.getLocalPosition(this);
                    pointerCir.x = newPosition.x;
                    pointerCir.y = newPosition.y;
                    for (var i = pcontainer.children.length - 1; i >= 0; i--) {
                        if (pointerCir.contains(pcontainer.children[i].x, pcontainer.children[i].y) && !gtween[i]) {
                            (function(i) {
                                gtween[i] = TweenMax.to(pcontainer.children[i], 0.5, {
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
            // make Graphic
            for (var gridX = 0; gridX < sprite.width; gridX += 2) {
                for (var gridY = 0; gridY < sprite.height; gridY += 2) {
                    var tileWidth = w / sprite.width;
                    var tileHeight = w / sprite.height;
                    var posX = tileWidth * gridX;
                    var posY = tileWidth * gridY;
                    var c = pixels[Math.ceil(gridY * sprite.width + gridX)];
                    var greyscale = Math.round(c.r * 0.222 + c.g * 0.707 + c.b * 0.071);
                    var w1 = _map(greyscale, 0, 255, 15, 0.1);
                    drawG(posX, posY, 2, c);
                    // var graphic = makeParticleGraphic(w1, c);
                    // if (graphic) {
                    // var texture = app.renderer.generateTexture(pcontainer);
                    // var spriteParticle = new PIXI.Sprite(texture);
                    //     spriteParticle.x = posX;
                    //     spriteParticle.y = posY;
                    // app.stage.addChild(spriteParticle);
                    // }
                }
            }
        }

        function makeParticleGraphic(w1, c) {
            var color16 = ('0' + c.r.toString(16)).slice(-2) + ('0' + c.g.toString(16)).slice(-2) + ('0' + c.b.toString(16)).slice(-2);
            if (c.a !== 0) {
                // var g = new PIXI.Graphics();
                pgraphics.clear();
                pgraphics.beginFill(parseInt(color16, 16));
                var l = w1 * 1;
                pgraphics.drawRect(0, 0, l, l);
                pgraphics.endFill();

                //  g.beginFill(0xfff);
                // var l = 2 * 1;
                // g.drawRect(0, 0, l, l);
                // g.endFill();

                return pgraphics;
            } else return 0;
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
                pcontainer.addChild(g);
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