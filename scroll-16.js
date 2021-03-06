class Line {

	constructor(length, density, direction, speed, col) {
		this.length         = length;
		this.density        = density;
		this.direction      = direction;
		this.speed          = speed;
		this.col            = col;
		this.characterArray = Array.from({length: length}, v => {
			if (random() < density) {
				return randomCharacter();
			} else {
				return ' ';
			}
		});
	}

	createPaddedString() {
		var string = this.characterArray.join('');
		var paddedString;

		if (this.direction) {
			paddedString = string.padStart(columns);
		} else {
			paddedString = string.padEnd(columns);
		}

		return paddedString;
	}

	move() {
		this.characterArray = rotateArray(this.characterArray, this.speed, this.direction);
	}
}

var lines = [];

var speedMinimum = 1;
var speedMaximum = 5;

function setup() {
	createCanvas(windowWidth, windowHeight);
	noCursor();
	frameRate(30);
	background('#000000');

	textFont('Menlo');
	textAlign(LEFT, TOP);
	textSize(16);
	// fill('#00f72c');

	columnWidth = Math.floor(textWidth(' '));
	rowHeight = 15;

	columns = Math.floor(width / columnWidth);
	rows = Math.floor(height / rowHeight);

	for (var i = 0; i < rows; i++) {
		lines.push(createLine());
	}
}

function draw() {
	background('#000000');

	for (var i = 0; i < rows; i++) {
		fill(lines[i].col);
		text(lines[i].createPaddedString(), 0, i * rowHeight);
		lines[i].move();
	}

	lines.shift();
	lines.push(createLine());
}

function createLine() {
	var length    = randomIntegerInclusive(1, columns);
	var density   = random();
	var direction = random() < 0.5;
	var speed     = randomIntegerInclusive(speedMinimum, speedMaximum);
	var col       = color(random(255), random(255), random(255));

	return new Line(length, density, direction, speed, col);
}

function randomCharacter() {
	return String.fromCharCode(randomIntegerInclusive(32, 127));
}