/**
	Creates a new Choropleth Map.
	@constructor
	@param {String|HTMLElement} container The HTML element to use as a canvas.
	@param {Object} [options] A map of options that override the default options.
	@param {Function} [callback] A fuction to execute after the Choropleth Map has been rendered.
*/
ChoroplethJS = function(container, options, callback) {

	/** @private */
	var bounds = [];
	
	options = options || {};
	this.options = ChoroplethJS.DefaultOptions;
	
	for (var attrname in options) {
		if (this.options.hasOwnProperty(attrname)) {
			this.options[attrname] = options[attrname];
		}
	}

	bounds = ChoroplethJS.Paths[this.options.projection].bounds;
	
	this.shapes = {};
	this.paper = ScaleRaphael(container, bounds[0], bounds[1]);
	this.initialize();
	this.scaleTo(this.options.scale);

	if (typeof callback == 'function') {
		callback();
	}

};

ChoroplethJS.prototype = {
	
	/** Creates a shape for each key in the current Paths object. */
	initialize: function() {
		
		var stateAttrs = {
			"fill":				this.options.fill,
			"fill-opacity":		this.options.fillOpacity,
			"stroke":			this.options.stroke,
			"stroke-opacity":	this.options.strokeOpacity,
			"stroke-width":		this.options.strokeWidth
		};
		
		for (var key in ChoroplethJS.Paths[this.options.projection]) {
			
			if (key == 'bounds') {
				continue;
			}
			
			else if (ChoroplethJS.Paths[this.options.projection].hasOwnProperty(key)) {
				this.shapes[key] = this.paper.path(ChoroplethJS.Paths[this.options.projection][key]);
				this.shapes[key].attr(stateAttrs);
				this.shapes[key].node.id = key;
				this.shapes[key].value = 0;
			}
			
		}
		
		this.scaleTo(this.options.scale);
		
	},

	/**
		Scales the entire canvas.
		@param {Number} value The scaling ratio to apply.
		@param {Function} [callback] A method to call once scaling has been applied. 
	*/
	scaleTo: function(value, callback) {
		this.paper.scaleAll(value);
		if (!!callback) {
			callback();
		}
	},

	/**
		Resets the color of each shape on the map to the value of options.fill.
	*/
	reset: function() {
		for (var key in this.shapes) {
			if (true) {
				this.shapes[key].attr('fill', this.options.fill);
			}
		}
	},
	
	/**
		Assigns a value and corresponding color to a shape. This method uses the color values defined
		in options.colors. A value of 0 will use the 0th item in the array, a value
		of 1 will used the last item in the array, and any other value will use the
		nth item in the array where n varies based on the length of the array.
		
		@param {String} key The key of the shape to be colorized.
		@param {Number} value A value between 0 - 1 that determines which color from options.colors should be used.
	*/
	setValue: function(key, value) {
		var i = Math.floor(value * this.options.colors.length);
		if (this.shapes.hasOwnProperty(key)) {
			if (i == this.options.colors.length) {
				i--;
			}
			this.shapes[key].value = value;
			// this.shapes[key].attr('fill', this.options.colors[i]);
			this.shapes[key].animate({'fill': this.options.colors[i]}, this.options.speed);
		}
	},

	/**
		Gets a Raphel shape objet from the current map.
		@param {String} key The name of the shape to get.
		@return The shape, or undefined if it doesn't exist.
	*/
	getShape: function(key) {
		return this.shapes[key];
	},
	
	getShapeKeys: function() {
		var result = [];
		for (var key in this.shapes) {
			result.push(key);
		}
		return result;
	}

};

/**
	A map of available options and their default values. Available options are:
	
	<ul>
		<li><strong>fill:</strong> The default color of each shape.</li>
		<li><strong>fillOpacity:</strong> The default opacity of each shape.</li>
		<li><strong>stroke:</strong> The default stroke color of each shape.</li>
		<li><strong>strokeOpacity:</strong> The default stroke opacity of each shape.</li>
		<li><strong>scale:</strong> The initial scale ratio of the map.</li>
		<li><strong>projection:</strong> The ChoroplethJS.Paths object to use.</li>
		<li><strong>colors:</strong> An array of colors used when colorizing the map.</li>
		<li><strong>speed:</strong> The time (in milliseconds) it takes to fade the map colors in.</li>
	</ul>
*/
ChoroplethJS.DefaultOptions = {
	"fill":				'#929292',
	"fillOpacity":		0.6,
	"stroke":			'#fff',
	"strokeOpacity":	1,
	"strokeWidth":		1,
	"scale":			1,
	"projection":		"Conical",
	"colors":			[ '#333333', '#b39f7b', '#efc77f', '#c4785d', '#98293a' ],
	"speed": 800
};

/** @namespace */
ChoroplethJS.Paths = {};