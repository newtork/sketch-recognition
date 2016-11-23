/**
 * @author Alexander Dümont / newtork <alexander_duemont@web.de>
 */

var VectorFunctions = {

	radian2angle : function(a) {
		return a*180/Math.PI;
	},
	
	length : function(v) {
		return v.length==1
			? v[0]
			: Math.sqrt(v
				.map(function(ai,i) { return ai*ai; })
				.reduce(function(a,b) { return a+b; }));
	},
	
	product : function(v1,v2) {
		return Math.abs(v1.length==1
			? v1[0]*v2[0]
			: v1
				.map(function(ai,i) { return ai*v2[i]; })
				.reduce(function(a,b) { return a+b; }));
	},
	
	difference : function(v1,v2) {
		return v1.length==1
			? [v1[0]-v2[0]]
			: v1.map(function(ai,i) { return ai-v2[i]; });
	},
	
	angularVelocity : function(v1, v2, angle) {
		var l=this.length(this.difference(v1,v2));
		return angle*l;
	},
	
	angleBetween : function(m1, m2) {
		var cos = this.product(m1,m2)/(this.length(m1)*this.length(m2));
		var degree = this.radian2angle(Math.acos(cos));
		return degree || 0;
	}
}