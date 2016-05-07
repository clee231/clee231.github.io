/// <reference path="jquery.d.ts" />

// Global Vars
var canvas = document.getElementById('game');
var canvasID = 'game';
var centerHeight = $('#'+canvasID).height()/2;
var centerWidth = $('#'+canvasID).width()/2;
var boardobj;
var plimg = new Image();
	plimg.src = 'images/player.png';
var plus = new Image();
	plus.src = 'images/good.png';
var minus = new Image();
	minus.src = 'images/bad.png';

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

class Plus {
	constructor(objimage:HTMLImageElement, width:number, height:number)
	{
		this.image=objimage;
		this.width=width;
		this.height=height;
		this.type="plus";
	}
	image: HTMLImageElement;
	width: number;
	height: number;
	type: string;
}

class Minus {
	constructor(objimage:HTMLImageElement, width:number, height:number)
	{
		this.image=objimage;
		this.width=width;
		this.height=height;
		this.type="minus";
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
		this.width = width;
		this.height = height;
		this.innerSize = 50;
		this.lives = 3;
		this.score = 0;
	}
	canvasDOM: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	objlist: Object[];
	width: number;
	height: number;
	innerSize: number;
	lives: number;
	score: number;

	public placeObj (obj:Player, x:number, y:number) {
		if (this instanceof Board) {
		this.ctx.drawImage(obj.image,x,y,obj.width,obj.height);
		this.objlist.push([obj,x,y]);
		}
		else {
		//var myCanvas = <HTMLCanvasElement>document.getElementById('game');
		//var myCtx = <CanvasRenderingContext2D>myCanvas.canvasDOM.getContext("2d");
		console.log("This isn't of type Board, Houston, we are in trouble...");
		}
	}
	public clear ()
	{
		this.ctx.clearRect(0,0, this.width, this.height);
		//console.log("Clear called! from: 0,0 to " + this.width + "," + this.height);
	}

	private costumeHandle(ctx, obj, deg){
			    //Convert degrees to radian 
		var rad = deg * Math.PI / 180;

		//Set the origin to the center of the image
		ctx.translate(obj[1] + obj[0].width / 2, obj[2] + obj[0].height / 2);

		//Rotate the canvas around the origin
		ctx.rotate(rad);

		//draw the image 
		ctx.drawImage(obj[0],obj[0].width / 2 * (-1),obj[0].height / 2 * (-1),obj[0].width,obj[0].height);//
		//If you where doing a rectangle you would use draw rect, not draw image.
	

		//reset the canvas  
		ctx.rotate(rad * ( -1 ) );
		ctx.translate((obj[1] + obj[0].width / 2) * (-1), (obj[2] + obj[0].height / 2) * (-1));
    }
	public redraw () 
	{
		//console.log(this.objlist);
		var objl = this.objlist;
		var po = this.placeObj;
		var myCtx = this.ctx;
		myCtx.fillStyle="#FF0000";
		myCtx.fillRect(0,0, (400/3)*this.lives, 1);
		myCtx.fillStyle="#FFFFFF";
		var ypos = ((centerHeight/3)-(this.innerSize/2));
		//console.log("ypos: " + ypos);
		myCtx.fillRect(0,ypos, this.width, this.innerSize);
		var score = this.score;
		var board = this;
		$.each(objl, function(index, item) {
			//po(objl[index][0], objl[index][1], objl[index][2]);
			if (index != 0) {
			myCtx.rotate((Math.random()*2)*Math.PI/180);
			myCtx.drawImage(objl[index][0].image,objl[index][1], objl[index][2],objl[index][0].width,objl[index][0].height);
			myCtx.setTransform(1,0,0,1,0,0);
			}else {
			if (score >= 100) {
				board.costumeHandle(myCtx, objl[index], 90);
			} else {
				myCtx.drawImage(objl[index][0].image,objl[index][1], objl[index][2],objl[index][0].width,objl[index][0].height);
			}
			}
		});
	}
	public handleInput (e)
	{
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
		console.log("Down arrow");
    }
    if (e.keyCode == 39) {
        //keyCode 39 is right arrow
    }
    if (e.keyCode == 38) {
        //keyCode 38 is up arrow
		boardobj.objlist[0][2]--;
		console.log("Up Arrow");
    }

	}

	private genParticles() {
		var rand = Math.floor(Math.random() * 100);
		var rand2 = Math.floor(Math.random() * 2);
		if (rand >= 99) {
			if (rand2 == 1) {
				var newobj = new Plus(plus, 10, 10);
				this.objlist.push([newobj,280,this.objlist[0][2]]);
			}else {
				var newobj = new Minus(minus, 10, 10);
				this.objlist.push([newobj,280,this.objlist[0][2]]);

			}
		}
	}

	private updateParticles() {
		var objl = this.objlist;
		$.each(objl, function(index, item) {
			//po(objl[index][0], objl[index][1], objl[index][2]);
			if (objl[index][0].type != "player") {
				objl[index][1]--;
			}
		});

	}

	private collisionCheck() {
        var myleft = this.objlist[0][1];
        var myright = this.objlist[0][1] + (this.objlist[0][0].width);
        var mytop = this.objlist[0][2];
        var mybottom = this.objlist[0][2] + (this.objlist[0][0].height);
		var objl = this.objlist;
		var innersize = 0;
		var intermscore = 0;
		$.each(objl, function(index, item) {
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
					
				}else {
					innersize = innersize - 10;
				}
				objl.splice(index,1);
			}
		}
		});
		this.innerSize = this.innerSize + innersize;
		if (this.innerSize <= 0) {
			this.lives--;
			this.innerSize = 50;
		}else {
			this.score += intermscore;
		}
	}
	update= () =>
	{
		if (this.lives > 0) {
		this.clear();
		this.genParticles();
		this.updateParticles();
		this.collisionCheck();
		this.redraw();
		} else {
			this.clear();
			this.ctx.fillStyle = "red";
			this.ctx.textAlign = "center";
			this.ctx.fillText("Game Over",50, 10);
			this.ctx.fillText("Score: " + this.score,50, 30);
		}
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
	boardobj.placeObj(player, 10, 70);
	console.log("Game init function called");
}

$(document).ready(function(){
    var message = statusmsg(person);
	boardobj = new Board(canvasID, 800, 500);
    $("#status")[0].innerHTML=message;
	gameinit(boardobj);
	console.log("Document Ready!");
	var upInterval = setInterval(boardobj.update, 16);	
	boardobj.clear();
	$(document).on('keydown', boardobj.handleInput);
});


