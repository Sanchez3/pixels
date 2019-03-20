'use strict';

var ComPoint = require('./entities/compoint');

var gridSize = 9;

var threepic = {
    initpic: function() {
        console.log('inipicstart');
        this.pic = new Image();
        this.pic.src = '../assets/img/pic.png';
        this.pic.addEventListener('load',this.createimg,false);
    },
    createimg: function() {
        console.log('createimg');
        threepic.initCanvas();
        threepic.getPixels();
        threepic.createPoints();
        threepic.tweenanimationIn();
        window.localStorage.setItem('points', JSON.stringify(threepic.points));
        window.addEventListener('touchstart', threepic.tweenanimationOut, false);
    },
    initCanvas: function() {
        console.log('initCanvas');
        this.picCanvas = document.getElementById('pic');
        this.dotsCanvas = document.getElementById('dots');
        this.picW = this.pic.width;
        this.picH = this.pic.height;

        this.picCanvas.width = this.picW;
        this.picCanvas.height = this.picH;
        this.dotsCanvas.width = this.picW * gridSize;
        this.dotsCanvas.height = this.picH * gridSize;

        this.picctx = this.picCanvas.getContext('2d');
        this.picctx.drawImage(this.pic, 0, 0);

        this.scale = this.ww / (this.picW * gridSize);

        this.dotsCanvas.style.webkitTransform = 'scale(' + this.scale + ')';
        this.dotsCanvas.style.left = '-' + (this.picW * gridSize - this.ww) / 2 + 'px';
        this.dotsCanvas.style.top = '-' + (this.picH * gridSize - this.wh) / 2 + 'px';

        this.dotsctx = this.dotsCanvas.getContext('2d');

        console.log(this.scale, this.ww);
    },
    getPixels: function() {
        console.log('getPixels');
        this.depths = [];
        this.imgpixels = this.picctx.getImageData(0, 0, this.picW, this.picH).data;
        for (var i = 0; i < this.imgpixels.length; i+=4) {
            var greyscale = this.imgpixels[Math.floor(i / 4) * 4] * 0.222 + this.imgpixels[Math.floor(i / 4) * 4 + 1] * 0.707 + this.imgpixels[Math.floor(i / 4) * 4 + 2] * 0.071;
            var depth = Math.floor(greyscale.map(0, 255, -50, -500));
            this.depths.push(depth);
        }
    },
    createPoints: function() {
        console.log('createPoints');
        var i;
        this.points = [];
        this.circles = [];

        for (var gridY = 0; gridY < this.picH; gridY++) {
            for (var gridX = 0; gridX < this.picW; gridX++) {
                i = gridY * this.picW + gridX;
                this.circles[i] = new ComPoint(gridX * gridSize + gridSize / 2, gridY * gridSize + gridSize / 2, 0);

                this.circles[i].draw(this.dotsctx);

                if (this.depths[i] !== (-364)) {
                    this.points[(gridX * this.picH + gridY) * 3] = gridX * gridSize - this.picW / 2 * gridSize;
                    this.points[(gridX * this.picH + gridY) * 3 + 1] = this.picH * gridSize - gridY * gridSize - this.picH / 2 * gridSize;
                    this.points[(gridX * this.picH + gridY) * 3 + 2] = this.depths[i];
                }
            }
        }
    },
    tweenanimationIn: function() {
        console.log('tweenanimationIn');

        for (var i = 0; i < this.circles.length - 1; i++) {
            TweenLite.to(this.circles[i], 2.5, { ease: Elastic.easeOut.config(1, 0.5), r: this.depths[i].map(-500, -50, 0, 4.5), delay: i * 0.00003 });
        }

        TweenLite.to(this.circles[this.circles.length - 1], 2.5, {
            ease: Elastic.easeOut.config(1, 0.5),
            r: this.depths[i].map(-500, -50, 0, 4.5),
            delay: (this.circles.length - 1) * 0.00003,
            onComplete: function() {
                console.log('complete');
                TweenLite.ticker.removeEventListener('tick', this.animatedots);
            }
        });

        TweenLite.ticker.addEventListener('tick', this.animatedots);
    },
    tweenanimationOut: function() {
        console.log('tweenanimationOut');
        TweenLite.ticker.addEventListener('tick', threepic.animatedots);

        for (var i = threepic.circles.length; i > 0; i--) {
            TweenLite.to(threepic.circles[i - 1], 0.5, { ease: Power1.easeOut, r: 0, delay: (threepic.circles.length - i) * 0.00003 });
        }

        TweenLite.to(threepic.circles[0], 0.5, {
            ease: Power1.easeOut,
            r: 0,
            delay: threepic.circles.length * 0.00005,
            onComplete: function() {
                TweenLite.ticker.removeEventListener('tick', threepic.animatedots);
                window.location.href = 'three.html';
            }
        });
    },
    animatedots: function() {
        threepic.dotsctx.clearRect(0, 0, threepic.dotsCanvas.width, threepic.dotsCanvas.height);
        for (var i = 0; i < threepic.circles.length; i++) {
            threepic.circles[i].draw(threepic.dotsctx);
        }
    },
    init: function() {
        this.ww = window.innerWidth;
        this.wh = window.innerHeight;
        this.initpic();
    }
}

threepic.init();

Number.prototype.map = function(inmin, inmax, outmin, outmax) {
    return (this - inmin) * (outmax - outmin) / (inmax - inmin) + outmin;
};