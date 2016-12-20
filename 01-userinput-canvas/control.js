// TODO comments

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function feedbackAreaInitialization() {

	var walkVec = WalkingVector({ resolution:11, dimension:2 }); // size=10
	
	var drawLast;
	var counter=0;
	var handlers={};
	var resetters={};

	var element = document.getElementById('angle');
	var angle = element.getContext("2d");
	angle.strokeStyle = "#005500";
	angle.lineJoin = "round";
	angle.lineWidth = 1;
	
	return {
		point : function(vec) {
			walkVec.add(vec);
			var alpha = walkVec.getAngleVelocity();
			var direction = walkVec.getDirection();
			for(h in handlers) {
				handlers[h] && handlers[h](vec, alpha, direction);
			}
			
			if(isNumeric(alpha)) {	
				var theAngle = alpha/50;
				var drawThis = element.height*(0.5+walkVec.Resolution*theAngle/2);
				var drawFrom = !drawLast && drawLast!==0 && drawThis || drawLast;

				angle.beginPath();
				angle.moveTo((counter-1) % angle.canvas.width, drawFrom);
				angle.lineTo((counter) % angle.canvas.width, drawThis);
				angle.closePath();
				angle.stroke();
				
				drawLast=drawThis;
			}
			
			// reset visible area
			if(counter % angle.canvas.width == 0) {
				angle.clearRect(0, 0, angle.canvas.width, angle.canvas.height);
				
				drawLast = null;
				angle.strokeStyle = "#cccccc";
				angle.lineJoin = "round";
				angle.lineWidth = 1;
				angle.beginPath();
				angle.moveTo(0, element.height/2);
				angle.lineTo(element.width, element.height/2);
				angle.closePath();
				angle.stroke();
				angle.strokeStyle = "#005500";
			}
			counter++;
		},
		
		reset : function() {
			walkVec.reset();
			for(h in resetters) {
				resetters[h] && resetters[h]();
			}
		},
		
		AddHandler : function(key, handler) {
			return handlers[key || handlers.length] = handler;
		},
		
		ResetHandler : function(key, resetter) {
			return resetters[key || resetters.length] = resetter;
		}
	}
}



function drawAreaInitialization(feedback) {
	var paint = false;
	var xPrev = null;
	var yPrev = null;
	var progressionLength = 20
	var doReset = false;
	
	var canvas  = document.getElementById('canvas');
	var context = canvas.getContext("2d");
	
	
	// canvas mouse interaction
	{
		canvas.onmousedown = function(e) {
			if(doReset) {
				reset();
				doReset = false;
			}
			
			paint = true;
			addPoint(e.offsetX, e.offsetY);
		}
		canvas.onmousemove = function(e){
			if(paint){
				addPoint(e.offsetX, e.offsetY);
			}
		};
		canvas.onmouseup = canvas.onmouseleave = function(e){
			paint = false;
			xPrev = yPrev = null;
			if(feedback && feedback.reset)
				feedback.reset();
		};
	}

	function reset() {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	}
	
	function style()
	{
		context.strokeStyle = "#df4b26";
		context.lineJoin = "round";
		context.lineWidth = 5;
	}
	
	function addPoint(x, y) {
		style();
		context.beginPath();
		context.moveTo(xPrev!==null ? xPrev : x-1, yPrev!==null ? yPrev : y-1);
		context.lineTo(x, y);
		context.closePath();
		context.stroke();
		xPrev = x;
		yPrev = y;
	  
		if(feedback && feedback.point)
			feedback.point([x,y]);
	}

	return {
		handleDrawProgression : function(vec, direction){
			var l = VectorFunctions.length(direction);
			var trg = vec.map(function(vi,i) {
				return vi + direction[i]*progressionLength/l;
			});
			context.strokeStyle = "#0000ff";
			context.lineJoin = "round";
			context.lineWidth = 1;
			context.beginPath();
			context.moveTo(vec[0], vec[1]);
			context.lineTo(trg[0], trg[1]);
			context.closePath();
			context.stroke();
		},
		
		handleReset : function() {
			doReset = true;
		}
	};
}


var feedbackArea = feedbackAreaInitialization();
var drawArea = drawAreaInitialization(feedbackArea);

// draw blue projection line
{
	var directionToggle = document.getElementsByName("toggle-direction")[0];
	feedbackArea.AddHandler("graph-projection", function(vec, alpha, direction) {
		if(directionToggle.checked)
		 drawArea.handleDrawProgression(vec, direction);
	});
}


// check clear toggle
{
	var clearToggle = document.getElementsByName("toggle-clear")[0];
	clearToggle.onchange = 
	feedbackArea.ResetHandler("toggle-clear", function() {
		if(clearToggle.checked)
		 drawArea.handleReset();
	});
}

// record angle velocity
{
	var recc = 0;
	window.rec = [];
	feedbackArea.AddHandler("record-angular", function(vec, alpha, direction) {
		window.rec[recc++] = alpha;
	});
}

// dtw pattern detection
{
	var dtw = DTWcompare();
	var dtwtag = document.getElementById("dtw-status");
	var groups = ["shapes", "words", "numbers"];
	var dtwlookup = {};

	groups.forEach(function(group, i) {
		for(var name in recordings[group]) {
			var patternvector = recordings[group][name].map(function(v) { return [v]; });
			
			var id = group+"."+name;
			dtw.addPattern(id, patternvector);
			
			var element = document.createElement("div");
			element.setAttribute("class", "entry");
			element.setAttribute("name", id);
			dtwtag.appendChild(element);
			dtwlookup[id] = { element : element, size : patternvector.length };
		}
	});
				
	var c=0;
	feedbackArea.AddHandler("dtw-report", function(vec, alpha, direction) {
		if(isNumeric(alpha)) {	
			var distances = dtw.add([alpha], c++);			
			for(var item in distances) {
				var perc0 = Math.round(distances[item][0])
				var perc1 = Math.round(distances[item][1]*100)+"%";
				var perc2 = Math.round(distances[item][1]*distances[item][1]*100)+"%";
			
				dtwlookup[item].element.innerText = perc1;
				dtwlookup[item].element.setAttribute("distance", perc0);
				dtwlookup[item].element.setAttribute("style", "background-size:"+perc2);
			}
		}
	});
	
	feedbackArea.ResetHandler("dtw-report", function() {
		dtw.reset();
	});
}