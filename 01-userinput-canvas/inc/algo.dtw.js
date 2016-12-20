/**
 * @author Alexander Dümont / newtork <alexander_duemont@web.de>
 */
 
if(!VectorFunctions) {
	alert("Vector functions needed");
}

// Usage:
//  var dtw = DTW()
//           .addPatterns({ "a" : [1,2,3], "b" : [6,5,4] })
//           .addPattern("c", [9,1,1]);
//
//  var distances = dtw.add(1);
//
//  dtw.reset(); // to clear previous inputs

var DTWsingle = function(patternIn) {
	
	var ArrayRepeat = function(v, n) {
		return n && Array.apply(null, Array(n)).map(function(){return v});
	}

	
	// arguments
	var pattern = patternIn;
	var patternLength = pattern.length;
	
	// changing parameters
	var tCurrentstart, tCurrentEnd, numCorrections, dCurrentMin;
	var dLast, sLast;
	
	// temp variable
	var dThis = ArrayRepeat(0, patternLength),
	    sThis = ArrayRepeat(0, patternLength);
	
	
	// public object functions
	return {
		
		size : pattern.length,
		
		reset : function() {
			numCorrections = 0;
			dCurrentMin = tCurrentStart = tCurrentEnd = Number.POSITIVE_INFINITY;
			dLast = ArrayRepeat(Number.POSITIVE_INFINITY, patternLength);
			sLast = ArrayRepeat(0, patternLength);
		},
		
		add : function(vec, index) {
			
			for(var i=0; i<patternLength; i++) {
				var yI = pattern[i];
				var dH = dLast[i];
				var dM1 = i>0 ? dThis[i-1] : 0;
				var dHM1 = i>0 ? dLast[i-1] : 0;
				var dBest = Math.min(dM1, dH, dHM1);
				var di1 = VectorFunctions.length(VectorFunctions.difference(vec, yI));
				var dI = di1 + dBest;
				
				if(isNaN(parseFloat(dI))) {
					console.log("nooo");
				}
				
				var sI = dBest==0 && i==0
					? index
					: dM1==dBest
						? sThis[i-1]
						: dH==dBest
							? sLast[i]
							: sLast[i-1];
				
				dThis[i] = dI;
				sThis[i] = sI;
			}
			
			// switch "last" and "this" distance vector
			{
				var h = dLast;
				dLast = dThis;
				dThis = h;
			}
			
			// switch "last" and "this" start vector
			{
				h = sLast;
				sLast = sThis;
				sThis = h;
			}
			
			return dLast[patternLength-1];
		}
	};
}

var DTWcompare  = function() {
	var dtws = {};

	return {
		addPatterns : function(objs) {
			for (var key in objs) {
				this.addPattern(key, objs[key]);
			}
			return this;
		},
		
		addPattern : function(name, vectorvalues) {
			dtws[name] = DTWsingle(vectorvalues);
			dtws[name].reset();
			return this;
		},
		
		reset : function() {
			for(var name in dtws) {
				dtws[name].reset();
			}
			return this;
		},
		
		add : function(vec, index) {
			var result = {};
			var vMin = Number.POSITIVE_INFINITY;
			var vMax = 0;
			
			for (var name in dtws) {
				var vAbs = dtws[name].add(vec, index);
				var vRel = vAbs/dtws[name].size;
				result[name] = [vAbs, vRel];
				
				if(vMin>vRel) vMin=vRel;
				if(vMax<vRel) vMax=vRel;
			}
			
			var vDiff = vMax-vMin;
			for (var name in result) {
				result[name][1] = 1-(result[name][1] - vMin)/vDiff;
			}
			return result;
		}
	}
}