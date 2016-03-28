


var masterPoints = [];
var humidMap;
var heatMap;
var horizontal;
var Vertical;
var dx;
var dy;
var alpha = .5;
var ctx1;
var ctx2;

var temp=30;


/********************************/
/*								*/
/*	Read temperature data and 	*/
/*	other data in functions		*/
/*			below.				*/
/*								*/
/********************************/

function asyncHandleData(nodeid, attr, val) {
	// Find object and update attribute.
	// attr 1 = Temperature, attr 0 = Humidity
	$.each(masterPoints, function( index, value ) {
		if (masterPoints[index].no == nodeid) {
			if (attr == 0) {
				masterPoints[index].tempHumidity = val[0];
			}else if (attr == 1) {
				masterPoints[index].tempTemperature = val[0];
			}
			masterPoints[index].lastUpdated = val[1];
		}
	});
	populateAverage();

}

function getTemperature(no){
    //Make some request.
    var query = "https://www.googleapis.com/fusiontables/v2/query?sql=SELECT%20temperature,date%20from%201ioYhIVWgWbysIz4ltA9gR5c_D-sSwVd1QIsZTygg%20WHERE%20nodeid=" + no + "%20ORDER%20BY%20date%20DESC%20LIMIT%201&key=AIzaSyCdl04mmrgRkoxyDgXIRC5cvRaAUJ7d4hk";
    var req = $.ajax({url: query, success: function (data) {
        console.log("temperature request for node: " + no + ", " + data.rows[0][0]);
		asyncHandleData(no, 1, data.rows[0]);
	}, fail: function() {
		return req;	
	}, cache: false});
}

function getHumidity(no){
    //Make some request.
    var query = "https://www.googleapis.com/fusiontables/v2/query?sql=SELECT%20humidity,date%20from%201ioYhIVWgWbysIz4ltA9gR5c_D-sSwVd1QIsZTygg%20WHERE%20nodeid=" + no + "%20ORDER%20BY%20date%20DESC%20LIMIT%201&key=AIzaSyCdl04mmrgRkoxyDgXIRC5cvRaAUJ7d4hk";
    var req = $.ajax({url: query, success: function (data) {
        console.log("humidity request for node: " + no + ", " + data.rows[0][0]);
        asyncHandleData(no, 0, data.rows[0]);
    }, fail: function() {
		return req;	
	}, cache: false});
}


//http://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
function distance(x1,y1,x2,y2){ 
  if(!x2) x2=0; 
  if(!y2) y2=0;
  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); 
}


function addSensor(x,y,no,name){
	//Get the context of both windows.
	var ctx1 = humidMap.getContext("2d");
	var ctx2 = heatMap.getContext("2d");

	//Fill the points as black dots for now...
	ctx2.fillRect(x*dx,y*dy,dx,dy);
	ctx2.stroke();
	ctx1.fillRect(x*dx,y*dy,dx,dy);
	ctx1.stroke();

	var tempHumidity = getHumidity(no);
	var tempTemperature = getTemperature(no);
	// Because the get methods are asynchronous, we need to push this after the promise() has been fulfilled.
	$.when(tempHumidity, tempTemperature).done(function(humi, temp) {
		masterPoints.push({x,y,no,name, tempHumidity: humi, tempTemperature: temp, distance: 0, fraciton: 0 });
	});
}

function interpolateHumidity(ctx,x,y){
	var tempTotalDistance=0;

	for (var i = masterPoints.length - 1; i >= 0; i--) {
		if (masterPoints[i].y == y/dy && masterPoints[i].x == x/dx) {
			ctx.fillStyle = humidColorArray[masterPoints[i].tempHumidity]+","+alpha+")";
			ctx.fillRect(x,y,dx,dy);
			return;
		}

		var temp = Math.floor(distance(x/dx,y/dy,masterPoints[i].x,masterPoints[i].y));
		masterPoints[i].distance = (1/(temp*temp));
		tempTotalDistance += (1/(temp*temp));
	}
	
	var ret=0;
	// var killme=0;
	for (var i = masterPoints.length - 1; i >= 0; i--) {
		masterPoints[i].fraciton = (masterPoints[i].distance/tempTotalDistance);
		ret += (masterPoints[i].fraciton*masterPoints[i].tempHumidity);
	}
	if (Math.floor(ret)>=100) {
		ctx.fillStyle = humidColorArray[100]+","+alpha+")";
		ctx.fillRect(x,y,dx,dy);
	}
	if((Math.floor(ret)/10)<10){
		ctx.fillStyle = humidColorArray[(Math.floor(ret))]+","+alpha+")";
		ctx.fillRect(x,y,dx,dy);
	}

	// return ret;
}


function interpolateTemperature(ctx,x,y){
	var tempTotalDistance=0;

	for (var i = masterPoints.length - 1; i >= 0; i--) {
		if (masterPoints[i].y == y/dy && masterPoints[i].x == x/dx) {
			ctx.fillStyle = humidColorArray[(Math.floor(((masterPoints[i].tempTemperature*9)/5)+32))]+","+alpha+")";
			ctx.fillRect(x,y,dx,dy);
			return;
		}

		var temp = Math.floor(distance(x/dx,y/dy,masterPoints[i].x,masterPoints[i].y));
		masterPoints[i].distance = (1/(temp*temp));
		tempTotalDistance += (1/(temp*temp));
	}
	
	var ret=0;
	// var killme=0;
	for (var i = masterPoints.length - 1; i >= 0; i--) {
		masterPoints[i].fraciton = (masterPoints[i].distance/tempTotalDistance);
		ret += (masterPoints[i].fraciton*(((masterPoints[i].tempTemperature*9)/5)+32));
	}
	if (Math.floor(ret)>=100) {
		ctx.fillStyle = humidColorArray[100]+","+alpha+")";
		ctx.fillRect(x,y,dx,dy);
	}
	if((Math.floor(ret)/10)<10){
		ctx.fillStyle = humidColorArray[(Math.floor(ret))]+","+alpha+")";
		ctx.fillRect(x,y,dx,dy);
	}

	// return ret;
}

function p(){
	for (var i = masterPoints.length - 1; i >= 0; i--) {
		console.log(masterPoints[i]);
	
	}
	var tmp=0;
	for (var i = masterPoints.length - 1; i >= 0; i--) {
		tmp+=masterPoints[i].fraciton;
	}
	console.log(tmp);
}

function updateAll(){
	ctx1.clearRect(0, 0, 6000, 3000);
	ctx2.clearRect(0, 0, 6000, 3000);
	for (var i = masterPoints.length - 1; i >= 0; i--) {
		// console.log(masterPoints[i]);
		//Read new data.
	}

	updateMap();
}

function drawBoxes(horizontalSquares,VerticalSquares){
	horizontal = horizontalSquares;
	Vertical = VerticalSquares;

	updateMap();
}


function updateMap(){
	//Updates the rest of the map.
	ctx1 = heatMap.getContext("2d");
	ctx2 = humidMap.getContext("2d");
	X = horizontal;
	Y = Vertical;
	
	var xOffset = 0;
	var yOffset = 0;

	dx = ((humidMap.width) / (horizontal));
	dy = ((humidMap.height) / (Vertical));


	//Setup the default state.
	for (var j = 0; j<Y; j++) {
		xOffset = 0;
		for (var i = 0; i<X; i++) {

			interpolateTemperature(ctx1,xOffset,yOffset);
			interpolateHumidity(ctx2,xOffset,yOffset);
			// ctx2.rect(xOffset,yOffset,dx,dy);

			xOffset += dx;
		}
		yOffset += dy;
	}
	ctx1.stroke();
	ctx2.stroke();
}

function drawChart(arrdata, div) {
	if ($('#'+div).children().length == 0) {
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'date');
		data.addColumn('number', 'temperature');
		data.addColumn('number', 'humidity');

		$.each(arrdata, function(i,entry) {
			data.addRow([arrdata[i][0],parseFloat(arrdata[i][1]),parseFloat(arrdata[i][2])]);
		});

		var chart = new google.visualization.LineChart(document.getElementById(div));
		chart.draw(data, {});
	}
}


function getRawHistoryData(no) {
	// Make requests for making history data.
    var query = "https://www.googleapis.com/fusiontables/v2/query?sql=SELECT%20date,temperature,humidity%20from%201ioYhIVWgWbysIz4ltA9gR5c_D-sSwVd1QIsZTygg%20WHERE%20nodeid=" + no + "%20ORDER%20BY%20date%20DESC%20LIMIT%2010&key=AIzaSyCdl04mmrgRkoxyDgXIRC5cvRaAUJ7d4hk";
	if ($('#graph-'+no).children().length == 0) {
		var req = $.ajax({url: query, success: function (data) {
			drawChart(data.rows, 'graph-'+no);
		}, fail: function() {
			return req;	
		}, cache: false});
	}

}

function populateRawData() {
    //Using the Master Points array, populate the data onto the DOM.
    if ($('#noderawview').children().length == 0) {
	$.each(masterPoints, function (index, value) {
		var header = '<h3 class="ui-bar ui-bar-a">Node #' + value.no + ', ' + value.name + '<span style="font-size:small"> - Last Update: ' + value.lastUpdated + '</span></h3>';
		var body = '<div class="ui-grid-a"><div class="ui-block-a"><h3>Temperature:</h3><h1>' + Math.round(value.tempTemperature*100)/100 + '&#176;C</h1></div><div class="ui-block-b"><h3>Humidity:</h3><h1>' + Math.round(value.tempHumidity*100)/100 + '%</h1></div></div><div id="graph-'+value.no+'"></div>';
		// Why this line below doesn't work... is weird. 
		//var header = $('h3').addClass('ui-bar ui-bar-a').text('Node #' + value.no + ', ' + value.name);
        $('#noderawview').append(header);
        $('#noderawview').append(body);
        getRawHistoryData(value.no);
	});
	}
}

function populateAverage() {
	// Populate average temperatures based on current values.
	var avgT = 0;
	var avgH = 0;
	var count = 0;
	$.each(masterPoints, function (index, value) {
		avgT += value.tempTemperature;
		avgH += value.tempHumidity;
		if (value.tempTemperature != 0 && value.tempHumidity != 0) {count++; }
	});
	avgT = (avgT / count);
	avgH = (avgH / count);
	$('#avgTemp').text(Math.round(avgT*100)/100);
	$('#avgHumi').text(Math.round(avgH*100)/100);

}

humidColorArray = [];
//1 for each 10%
//Whatever, no calculation needs to be done. its fine...
humidColorArray[0] = "rgba(50, 0, 0";//DarkBrown
humidColorArray[1] = "rgba(54, 7, 0";
humidColorArray[2] = "rgba(58, 12, 0";
humidColorArray[3] = "rgba(62, 19, 0";
humidColorArray[4] = "rgba(66, 24, 0";
humidColorArray[5] = "rgba(72, 30, 0";
humidColorArray[6] = "rgba(76, 36, 0";
humidColorArray[7] = "rgba(80, 42, 0";
humidColorArray[8] = "rgba(85, 47, 0";
humidColorArray[9] = "rgba(90, 51, 0";

humidColorArray[10] = "rgba(95, 56, 0";//Brown
humidColorArray[11] = "rgba(100, 60, 0";
humidColorArray[12] = "rgba(105, 65, 0";
humidColorArray[13] = "rgba(110, 70, 0";
humidColorArray[14] = "rgba(115, 75, 0";
humidColorArray[15] = "rgba(120, 81, 0";
humidColorArray[16] = "rgba(123, 87, 0";
humidColorArray[17] = "rgba(127, 94, 0";
humidColorArray[18] = "rgba(130, 102, 0";
humidColorArray[19] = "rgba(135, 108, 0";

humidColorArray[20] = "rgba(140, 112, 0";//Light brown
humidColorArray[21] = "rgba(144, 117, 0";
humidColorArray[22] = "rgba(148, 123, 0";
humidColorArray[23] = "rgba(152, 128, 0";
humidColorArray[24] = "rgba(156, 134, 0";
humidColorArray[25] = "rgba(160, 140, 0";
humidColorArray[26] = "rgba(164, 146, 0";
humidColorArray[27] = "rgba(168, 152, 0";
humidColorArray[28] = "rgba(175, 158, 0";
humidColorArray[29] = "rgba(180, 164, 0";

humidColorArray[30] = "rgba(186, 170, 0";//Brass
humidColorArray[31] = "rgba(189, 174, 0";
humidColorArray[32] = "rgba(192, 178, 0";
humidColorArray[33] = "rgba(195, 182, 0";
humidColorArray[34] = "rgba(198, 186, 0";
humidColorArray[35] = "rgba(201, 190, 0";
humidColorArray[36] = "rgba(104, 194, 0";
humidColorArray[37] = "rgba(108, 198, 0";
humidColorArray[38] = "rgba(112, 202, 0";
humidColorArray[39] = "rgba(116, 207, 0";

humidColorArray[40] = "rgba(220, 212, 0";//Gold
humidColorArray[41] = "rgba(223, 216, 0";
humidColorArray[42] = "rgba(226, 220, 0";
humidColorArray[43] = "rgba(229, 224, 0";
humidColorArray[44] = "rgba(232, 228, 0";
humidColorArray[45] = "rgba(235, 232, 0";
humidColorArray[46] = "rgba(239, 236, 0";
humidColorArray[47] = "rgba(243, 240, 0";
humidColorArray[48] = "rgba(247, 245, 0";
humidColorArray[49] = "rgba(251, 250, 0";


humidColorArray[50] = "rgba(255, 255, 0";//Yellow
humidColorArray[51] = "rgba(243, 255, 0";
humidColorArray[52] = "rgba(231, 255, 0";
humidColorArray[53] = "rgba(218, 255, 0";
humidColorArray[54] = "rgba(205, 255, 0";
humidColorArray[55] = "rgba(192, 255, 0";
humidColorArray[56] = "rgba(179, 255, 0";
humidColorArray[57] = "rgba(166, 255, 0";
humidColorArray[58] = "rgba(153, 255, 0";
humidColorArray[59] = "rgba(140, 255, 0";

humidColorArray[60] = "rgba(127, 255, 0";//Green
humidColorArray[61] = "rgba(121, 252, 0";
humidColorArray[62] = "rgba(115, 248, 0";
humidColorArray[63] = "rgba(109, 244, 0";
humidColorArray[64] = "rgba(103, 240, 0";
humidColorArray[65] = "rgba(97, 236, 0";
humidColorArray[66] = "rgba(91, 232, 0";
humidColorArray[67] = "rgba(85, 228, 0";
humidColorArray[68] = "rgba(79, 224, 0";
humidColorArray[69] = "rgba(73, 220, 0";

humidColorArray[70] = "rgba(63, 216, 0";//Grass Green
humidColorArray[71] = "rgba(57, 213, 0";
humidColorArray[72] = "rgba(51, 210, 0";
humidColorArray[73] = "rgba(45, 206, 0";
humidColorArray[74] = "rgba(39, 202, 0";
humidColorArray[75] = "rgba(33, 198, 0";
humidColorArray[76] = "rgba(27, 194, 0";
humidColorArray[77] = "rgba(21, 190, 0";
humidColorArray[78] = "rgba(14, 186, 0";
humidColorArray[79] = "rgba(7, 182, 0";

humidColorArray[80] = "rgba(0, 178, 0";//Thick Green
humidColorArray[81] = "rgba(0, 171, 0";
humidColorArray[82] = "rgba(0, 164, 0";
humidColorArray[83] = "rgba(0, 157, 0";
humidColorArray[84] = "rgba(0, 150, 0";
humidColorArray[85] = "rgba(0, 142, 0";
humidColorArray[86] = "rgba(0, 134, 0";
humidColorArray[87] = "rgba(0, 126, 0";
humidColorArray[88] = "rgba(0, 118, 0";
humidColorArray[89] = "rgba(0, 110, 0";

humidColorArray[90] = "rgba(0, 102, 0";//Dark Green
humidColorArray[91] = "rgba(0, 92, 0";
humidColorArray[92] = "rgba(0, 82, 0";
humidColorArray[93] = "rgba(0, 72, 0";
humidColorArray[94] = "rgba(0, 62, 0";
humidColorArray[95] = "rgba(0, 52, 0";
humidColorArray[96] = "rgba(0, 42, 0";
humidColorArray[97] = "rgba(0, 32, 0";
humidColorArray[98] = "rgba(0, 22, 0";
humidColorArray[99] = "rgba(0, 12, 0";

humidColorArray[100] = "rgba(0, 12, 0";//Dark Green Same :D







