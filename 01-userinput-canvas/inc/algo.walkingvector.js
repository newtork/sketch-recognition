/**
 * @author Alexander Dümont / newtork <alexander_duemont@web.de>
 */
 
if(!VectorFunctions) {
	alert("Vector functions needed");
}

// Usage:
//  var w = WalkingVector({ resolution:10, dimension:2 })
//           .add([1,2])
//           .add([3,4])
//           .add([9,2]);
//
//  var direction = getDirection();
//  var angle = w.getAngle();
//
//  w.reset(); // to clear previous inputs

var WalkingVector  = function(parameters) {

	// statics
	var n = parameters&&parameters.resolution || 10;
	var dim = parameters&&parameters.dimension || 2;
	
	// dynamics
	var records = Array(n*dim);
	var counter = 0;
	var indexCurrent=0;
	
	
	if(dim!=2) {
		// TODO: allow multi dimensional
		//		 currently 
		console.error("Only 2D space supported.");
	}
	
	// init walking average array
	var walkingAvg=Array(dim);
	walkingAvg.fill(0);
	
	// temp vars
	var directionPrev;
	var anglePrev;
	var angleVelocity;
	var recordPrev;
	var signPrev=1;
	var quadrantPrev;
	var averagePrev;
	
	

	// mod function, to return positive modulus
	function mod(n, m) { return ((n % m) + m) % m; }
	
	// walking average function, using a buffer the same size as the records
	function calcWalkingAvg() {
		if(counter<n) {
			// until buffer is full, add entries according to their current weight
			for(var i=0; i<dim; i++) {
				var valThis = records[indexCurrent*dim+i];
				var averagePrev = walkingAvg[i];
				walkingAvg[i] = ( (counter)*averagePrev + valThis ) / (counter+1);
			}
		}
		else {
			// remove the weighted fraction of the last element, add fraction of current element
			var indexLast = mod(indexCurrent+1, n);
			for(var i=0; i<dim; i++) {
				var valLast = records[indexLast*dim+i];
				var valThis = records[indexCurrent*dim+i];
				var averagePrev = walkingAvg[i];
				walkingAvg[i] = ( n*averagePrev - valLast + valThis ) / n;
			}
		}
		return walkingAvg;
	};
	
	
	// function to overwrite oldest record with new entry vector
	function updateRecord(vector) {
		var curr = indexCurrent*dim;
		for(var i=0; i<dim; i++) {
			records[curr+i] = vector[i];
		}
	};
	
	// function to calculate leading sign of angle, whether clockwise or counter-clockwise
	function calcSign(directionThis) {
		var QUADRANT_DEBUG = false;
		var l = QUADRANT_DEBUG && function(s) { console.log(s, directionThis, quadrantPrev); return true; } || function() { return true; }
		
		var signThis = -1;
		
		// determine current quadrant of the current direction vector
		var quadrant = directionThis[0]>=0 && directionThis[1]>=0 && l(1) && 1
					|| directionThis[0]<=0 && directionThis[1]>=0 && l(2) && 2
					|| directionThis[0]<=0 && directionThis[1]<=0 && l(3) && 3
					|| l(0) && 0;

		// check whether it has been moved its quadrant since last time
		//  if it has set sign accordingly to the orientation ..-> 0 <-> 1 <-> 2 <-> 3 <-> 0 <-..
		signThis = quadrantPrev==quadrant && signPrev
					|| mod(quadrantPrev+1, 4)==quadrant && 1
					|| -1;
		signPrev = signThis;
		quadrantPrev = quadrant;
		return signThis;
	}

	return {
	
		// function to add new vector to the calculation
		add : function(vector) {
			updateRecord(vector);
			
			// calculate new walking average and direction vector
			var averageThis = calcWalkingAvg();
			var directionThis = VectorFunctions.difference(averageThis, averagePrev||averageThis);
			
			if(counter > 0) {
				// calculate angle and sign between last direction vector and current direction vector
				anglePrev = VectorFunctions.angleBetween(directionThis, directionPrev);
				anglePrev *= calcSign(directionThis);
				
				// make the angle distance-weighted
				angleVelocity = VectorFunctions.angularVelocity(vector, recordPrev, anglePrev);
			}
			
			// copy vectors
			directionPrev = directionThis.slice();
			averagePrev = averageThis.slice();
			recordPrev = vector.slice();
			
			// increment status
			indexCurrent = mod(indexCurrent+1, n);
			counter++;
			return this;
		},
		
		reset : function() {
			walkingAvg.fill(0);
			directionPrev = null;
			averagePrev = null;
			anglePrev = null;
			angleVelocity = null;
			recordPrev = null;
			quadrantPrev = null;
			signPrev = 1;
			indexCurrent = counter = 0;
		},
		
		getAngle : function() {
			return anglePrev;
		},
		
		getAngleVelocity : function() {
			return angleVelocity;
		},
		
		getDirection : function() {
			return directionPrev;
		},
		
		Dimension : dim,
		Resolution : n
	}
}