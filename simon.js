function Game() {
	var sequence = [];
	var green = $("#green");
	var red = $("#red");
	var blue = $("#blue");
	var yellow = $("#yellow");

	var colorElement = function(elementID, active) {
		//switch
	}

	var randomizer = function() {
		//number 0-3
		return Math.floor(Math.random() * 4);
	}

	this.animateSequence = function() {
		var elemID = randomizer();
		sequence.push(elemID);
	}

}

$(function() {});