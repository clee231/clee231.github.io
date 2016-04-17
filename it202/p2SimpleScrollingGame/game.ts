/// <reference path="jquery.d.ts" />

// Global Vars
var canvas = document.getElementById('game');
var canvasID = 'game';
var centerHeight = $('#'+canvasID).height()/2;
var centerWidth = $('#'+canvasID).width()/2;

interface canvasObj {
	x: number;
	y: number;
	type: string;
	width: number;
	height: number;
}

class Person {

  constructor(name:string)
	{
		this.name=name;
	}
	name: string;
}

function statusmsg (person:Person){
	return "hallo "+person.name+"\n Center(WxH): (" + centerWidth+","+centerHeight+")";
}

class Player {
	constructor(playerimage:HTMLImageElement, width:number, height:number)
	{
		this.image=playerimage;
		this.width=width;
		this.height=height;
		this.type="player";
	}
	image: HTMLImageElement;
	width: number;
	height: number;
	type: string;
}

class Board {
	constructor(canvas:string, width:number, height:number)
	{
		this.canvasDOM = <HTMLCanvasElement>document.getElementById(canvas);
		console.log(this.canvasDOM);
		this.ctx = <CanvasRenderingContext2D>this.canvasDOM.getContext("2d");
		this.objlist = [];
		
	}
	canvasDOM: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	objlist: Object[];
	width: number;
	height: number;

	placeObj (obj:Player, x:number, y:number) {
		this.ctx.drawImage(obj.image,x,y,obj.width,obj.height);
		this.objlist.push([obj,x,y]);
		console.log("Placed object");
		console.log(this.objlist);
	}
	clear ()
	{
		this.ctx.clearRect(0,0, this.width, this.height);
	}
	redraw () 
	{
		$.each(this.objlist, function(index, item) {
			this.placeObj(this.objlist[index]);
		});
	}
	inputSetup ()
	{
	$(document).on('keypress', function (e) {
			switch(e.keyCode) {
				case 38:
					console.log("Up Arrow!");
					break;
				case 40:
					console.log("Down Arrow!");
					console.log(this.objlist);
					break;
			}
		});
	}
	update ()
	{
		this.clear;
		this.redraw;
		console.log("Updating!");
	}
}

var person=new Person("Cody");

function gameinit(boardobj) {
	$('#'+canvasID).css('background-color', '#111');
	var centerHeight = $('#'+canvasID).height()/2;
	var centerWidth = $('#'+canvasID).width()/2;
	var canvas = document.getElementById('game');
	var plimg = new Image();
	plimg.src = 'images/player.png';
	var player = new Player(plimg,20,17);
	boardobj.placeObj(player, 100, 100);
	boardobj.inputSetup();
	console.log("Game init function called");
}

$(document).ready(function(){
    var message = statusmsg(person);
	var boardobj = new Board(canvasID, $('#'+canvasID).width(), $('#'+canvasID).height());
    $("#status")[0].innerHTML=message;
	gameinit(boardobj);
	console.log("Document Ready!");
	var upInterval = setInterval(boardobj.update, 1000);	
	boardobj.clear();
});
