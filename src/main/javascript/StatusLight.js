function StatusLight(width, height) {
	this.status = new Canvas(25, 25);
	this.gc = this.status.getGraphicsContext2D();
}

StatusLight.prototype = {

	setColour : function(color) {
		this.gc.setFill(color || Color.GRAY);
		this.gc.fillOval(0, 0, 25, 25);
	},

	toNode : function() {
		return this.status;
	}
}