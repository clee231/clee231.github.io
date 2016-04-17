/// <reference path="jquery.d.ts" />
// Global Vars
var canvas = document.getElementById('game');
var canvasID = 'game';
var centerHeight = $('#' + canvasID).height() / 2;
var centerWidth = $('#' + canvasID).width() / 2;
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
var Board = (function () {
    function Board(canvas, width, height) {
        var _this = this;
        this.update = function () {
            _this.clear();
            //this.redraw();
            console.log("Updating!");
        };
        this.canvasDOM = document.getElementById(canvas);
        console.log(this.canvasDOM);
        this.ctx = this.canvasDOM.getContext("2d");
        this.objlist = [];
    }
    Board.prototype.placeObj = function (obj, x, y) {
        this.ctx.drawImage(obj.image, x, y, obj.width, obj.height);
        this.objlist.push([obj, x, y]);
        console.log("Placed object");
        console.log(this.objlist);
    };
    Board.prototype.clear = function () {
        console.log("clearing canvas");
        this.ctx.clearRect(0, 0, this.width, this.height);
    };
    Board.prototype.redraw = function () {
        console.log(this.objlist);
        var objl = this.objlist;
        var po = this.placeObj;
        $.each(objl, function (index, item) {
            po(objl[index][0], objl[index][1], objl[index][2]);
        });
    };
    Board.prototype.inputSetup = function () {
        var objl = this.objlist;
        $(document).on('keypress', function (e) {
            switch (e.keyCode) {
                case 38:
                    console.log("Up Arrow!");
                    break;
                case 40:
                    console.log("Down Arrow!");
                    objl[0][2]--;
                    console.log(objl);
                    break;
            }
        });
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
    boardobj.placeObj(player, 100, 100);
    boardobj.inputSetup();
    console.log("Game init function called");
}
$(document).ready(function () {
    var message = statusmsg(person);
    var boardobj = new Board(canvasID, $('#' + canvasID).width(), $('#' + canvasID).height());
    $("#status")[0].innerHTML = message;
    gameinit(boardobj);
    console.log("Document Ready!");
    var upInterval = setInterval(boardobj.update, 1000);
    boardobj.clear();
});