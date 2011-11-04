ChoroplethJS.GmapOverlay = function() {};
	
ChoroplethJS.GmapOverlay.prototype = new google.maps.OverlayView();

ChoroplethJS.GmapOverlay.prototype.onAdd = function() {
	var map;
	var w = gmap.getDiv().scrollWidth;
	var h = gmap.getDiv().scrollHeight;
	this.div = document.createElement('div');
	this.div.style.position = 'absolute';
	this.div.style.overflow = 'visible';
	this.div.style.top = 0;
	this.div.style.left = 0;
	this.div.style.width = w;
	this.div.style.height = h;
	this.div.id = 'gmapCanvas';
	this.getPanes().overlayImage.appendChild(this.div);
	
	map = new ChoroplethJS('gmapCanvas', { projection: 'SphericalMercator' });
	
	this.scaleTo	= function(value, callback) { map.scaleTo(value, callback); };
	this.reset		= function(value, callback) { map.reset(); };
	this.setValue = function(key, value) { map.setValue(key, value); };
	this.getShape = function(key) { return map.getShape(key); };
	this.getShapeKeys = function() { return map.getShapeKeys(); };
	
};

ChoroplethJS.GmapOverlay.prototype.draw = function() {
	var center = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(38, -97));
	var topLeft = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(74.03, -180));
	this.scaleTo(this.getScaleByZoomLevel(gmap.getZoom()));
	var x = topLeft.x;
	var y = topLeft.y;
	this.div.style.top = y + 'px';
	this.div.style.left = x + 'px';
};

ChoroplethJS.GmapOverlay.prototype.onRemove = function() {
	this.div.parentNode.removeChild(this.div);
};

ChoroplethJS.GmapOverlay.prototype.getScaleByZoomLevel = function(zoomLevel) {
	var result = 1;
	switch (zoomLevel) {
		case 0: result = 0.0315; break;
		case 1: result = 0.0625; break;
		case 2: result = 0.125; break;
		case 3: result = 0.25; break;
		case 4: result = 0.5; break; 
		case 5: break;
		case 6: result = 2; break;
		case 7: result = 4; break;
		case 8: result = 8; break;
		case 9: result = 16; break;
		case 10: result = 32; break;
		case 11: result = 64; break;
		case 12: result = 128; break;
		case 13: result = 256; break;
		case 14: result = 512; break;
		case 15: result = 1024; break;
		default: break;
	}
	return result;
};