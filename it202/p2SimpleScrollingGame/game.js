/// <reference path="jquery.d.ts" />
// Global Vars
var canvas = document.getElementById('game');
var canvasID = 'game';
var centerHeight = $('#' + canvasID).height() / 2;
var centerWidth = $('#' + canvasID).width() / 2;
var boardobj;
var plimg = new Image();
plimg.src = 'images/player.png';
var plus = new Image();
plus.src = 'images/good.png';
var minus = new Image();
minus.src = 'images/bad.png';
var Person = (function () {
    function Person(name) {
        this.name = name;
    }
    return Person;
}());
function statusmsg(person) {
    return "hallo " + person.name + "\n Center(WxH): (" + centerWidth + "," + centerHeight + ")";
}
var Player = (function () {
    function Player(playerimage, width, height) {
        this.image = playerimage;
        this.width = width;
        this.height = height;
        this.type = "player";
    }
    return Player;
}());
var Plus = (function () {
    function Plus(objimage, width, height) {
        this.image = objimage;
        this.width = width;
        this.height = height;
        this.type = "plus";
    }
    return Plus;
}());
var Minus = (function () {
    function Minus(objimage, width, height) {
        this.image = objimage;
        this.width = width;
        this.height = height;
        this.type = "minus";
    }
    return Minus;
}());
var Board = (function () {
    function Board(canvas, width, height) {
        var _this = this;
        this.update = function () {
            if (_this.lives > 0) {
                _this.clear();
                _this.genParticles();
                _this.updateParticles();
                _this.collisionCheck();
                _this.redraw();
            }
            else {
                _this.clear();
                _this.ctx.fillStyle = "red";
                _this.ctx.textAlign = "center";
                _this.ctx.fillText("Game Over", 50, 10);
                _this.ctx.fillText("Score: " + _this.score, 50, 30);
            }
        };
        this.canvasDOM = document.getElementById(canvas);
        console.log(this.canvasDOM);
        this.ctx = this.canvasDOM.getContext("2d");
        this.objlist = [];
        this.width = width;
        this.height = height;
        this.innerSize = 50;
        this.lives = 3;
        this.score = 0;
    }
    Board.prototype.placeObj = function (obj, x, y) {
        if (this instanceof Board) {
            this.ctx.drawImage(obj.image, x, y, obj.width, obj.height);
            this.objlist.push([obj, x, y]);
        }
        else {
            //var myCanvas = <HTMLCanvasElement>document.getElementById('game');
            //var myCtx = <CanvasRenderingContext2D>myCanvas.canvasDOM.getContext("2d");
            console.log("This isn't of type Board, Houston, we are in trouble...");
        }
    };
    Board.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        //console.log("Clear called! from: 0,0 to " + this.width + "," + this.height);
    };
    Board.prototype.costumeHandle = function (ctx, obj, deg) {
        //Convert degrees to radian 
        var rad = deg * Math.PI / 180;
        //Set the origin to the center of the image
        ctx.translate(obj[1] + obj[0].width / 2, obj[2] + obj[0].height / 2);
        //Rotate the canvas around the origin
        ctx.rotate(rad);
        //draw the image 
        ctx.drawImage(obj[0], obj[0].width / 2 * (-1), obj[0].height / 2 * (-1), obj[0].width, obj[0].height); //
        //If you where doing a rectangle you would use draw rect, not draw image.
        //reset the canvas  
        ctx.rotate(rad * (-1));
        ctx.translate((obj[1] + obj[0].width / 2) * (-1), (obj[2] + obj[0].height / 2) * (-1));
    };
    Board.prototype.redraw = function () {
        //console.log(this.objlist);
        var objl = this.objlist;
        var po = this.placeObj;
        var myCtx = this.ctx;
        myCtx.fillStyle = "#FF0000";
        myCtx.fillRect(0, 0, (this.width / 3) * this.lives, 1);
        myCtx.fillStyle = "#FFFFFF";
        var ypos = ((centerHeight / 3) - (this.innerSize / 2));
        //console.log("ypos: " + ypos);
        myCtx.fillRect(0, ypos, this.width, this.innerSize);
        var score = this.score;
        var board = this;
        $.each(objl, function (index, item) {
            //po(objl[index][0], objl[index][1], objl[index][2]);
            if (index != 0) {
                myCtx.rotate((Math.random() * 2) * Math.PI / 180);
                myCtx.drawImage(objl[index][0].image, objl[index][1], objl[index][2], objl[index][0].width, objl[index][0].height);
                myCtx.setTransform(1, 0, 0, 1, 0, 0);
            }
            else {
                if (score >= 100) {
                    board.costumeHandle(myCtx, objl[index], 90);
                }
                else {
                    myCtx.drawImage(objl[index][0].image, objl[index][1], objl[index][2], objl[index][0].width, objl[index][0].height);
                }
            }
        });
    };
    Board.prototype.handleInput = function (e) {
        if (!e) {
            e = window.event;
        }
        if (e.keyCode == 37) {
            //keyCode 37 is left arrow
            this.clear();
        }
        if (e.keyCode == 40) {
            //keyCode 40 is down arrow
            boardobj.objlist[0][2]++;
        }
        if (e.keyCode == 39) {
        }
        if (e.keyCode == 38) {
            //keyCode 38 is up arrow
            boardobj.objlist[0][2]--;
        }
    };
    Board.prototype.genParticles = function () {
        var rand = Math.floor(Math.random() * 100);
        var rand2 = Math.floor(Math.random() * 2);
        if (rand >= 99) {
            if (rand2 == 1) {
                var newobj = new Plus(plus, 10, 10);
                this.objlist.push([newobj, 280, this.objlist[0][2]]);
            }
            else {
                var newobj = new Minus(minus, 10, 10);
                this.objlist.push([newobj, 280, this.objlist[0][2]]);
            }
        }
    };
    Board.prototype.updateParticles = function () {
        var objl = this.objlist;
        $.each(objl, function (index, item) {
            //po(objl[index][0], objl[index][1], objl[index][2]);
            if (objl[index][0].type != "player") {
                objl[index][1]--;
            }
        });
    };
    Board.prototype.collisionCheck = function () {
        var myleft = this.objlist[0][1];
        var myright = this.objlist[0][1] + (this.objlist[0][0].width);
        var mytop = this.objlist[0][2];
        var mybottom = this.objlist[0][2] + (this.objlist[0][0].height);
        var objl = this.objlist;
        var innersize = 0;
        var intermscore = 0;
        $.each(objl, function (index, item) {
            if (index != 0 && objl[index] != null) {
                var otherobj = objl[index];
                var otherleft = otherobj[1];
                var otherright = otherobj[1] + (otherobj[0].width);
                var othertop = otherobj[2];
                var otherbottom = otherobj[2] + (otherobj[0].height);
                var crash = true;
                if ((mybottom < othertop) ||
                    (mytop > otherbottom) ||
                    (myright < otherleft) ||
                    (myleft > otherright)) {
                    crash = false;
                }
                if (crash == true) {
                    if (objl[index][0].type == 'plus') {
                        innersize = innersize + 10;
                        intermscore++;
                    }
                    else {
                        innersize = innersize - 10;
                    }
                    objl.splice(index, 1);
                }
            }
        });
        this.innerSize = this.innerSize + innersize;
        if (this.innerSize <= 0) {
            this.lives--;
            this.innerSize = 50;
        }
        else {
            this.score += intermscore;
        }
    };
    return Board;
}());
var person = new Person("Cody");
function gameinit(boardobj) {
    $('#' + canvasID).css('background-color', '#111');
    var centerHeight = $('#' + canvasID).height() / 2;
    var centerWidth = $('#' + canvasID).width() / 2;
    var canvas = document.getElementById('game');
    var plimg = new Image();
    plimg.src = 'images/player.png';
    var player = new Player(plimg, 20, 17);
    boardobj.placeObj(player, 10, 70);
    console.log("Game init function called");
}
$(document).ready(function () {
    var message = statusmsg(person);
    boardobj = new Board(canvasID, 800, 500);
    $("#status")[0].innerHTML = message;
    gameinit(boardobj);
    console.log("Document Ready!");
    var upInterval = setInterval(boardobj.update, 16);
    boardobj.clear();
    $(document).on('keypress', boardobj.handleInput);
});
