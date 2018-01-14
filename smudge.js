class Cell {

	constructor(row, column, h, s, b) {
		this.row    = row;
		this.column = column;
		this.h      = h;
		this.s      = s;
		this.b      = b;
	}

	display() {
		fill(color(this.h, this.s, this.b));
		rect(this.column * settings.gridSize, this.row * settings.gridSize, settings.gridSize, settings.gridSize);
	}

	interpolateColor() {
		var previousRow    = constrain(this.row    - 1, 0, settings.rows    - 1);
		var nextRow        = constrain(this.row    + 1, 0, settings.rows    - 1);
		var previousColumn = constrain(this.column - 1, 0, settings.columns - 1);
		var nextColumn     = constrain(this.column + 1, 0, settings.columns - 1);

		var neighbors = [];

		// neighbors.push(cells[previousRow][this.column]);
		// neighbors.push(cells[nextRow][this.column]);
		// neighbors.push(cells[this.row][previousColumn]);
		// neighbors.push(cells[this.row][nextColumn]);

		neighbors.push(cells[previousRow][previousColumn]);
		neighbors.push(cells[previousRow][nextColumn]);
		neighbors.push(cells[nextRow][previousColumn]);
		neighbors.push(cells[nextRow][nextColumn]);

		shuffleArray(neighbors);

		var color0 = color(neighbors[0].h, neighbors[0].s, neighbors[0].b);
		var color1 = color(neighbors[1].h, neighbors[1].s, neighbors[1].b);
		var amount = randomFloat(0, 1);

		var interpolatedColor = lerpColor(color0, color1, amount);

		this.h = hue(interpolatedColor);
		this.s = saturation(interpolatedColor);
		this.b = brightness(interpolatedColor);
	}
}

var settings = {
	gridSize                                :  10,

	minSeedsPerFrame                        :   0,
	minSeedsPerFrameMin                     :   0,
	minSeedsPerFrameMax                     :  10,
	minSeedsPerFrameWalkProbability         :   0.1,
	minSeedsPerFrameWalkStep                :   2,

	maxSeedsPerFrame                        :  10,
	maxSeedsPerFrameMin                     :   0,
	maxSeedsPerFrameMax                     :  10,
	maxSeedsPerFrameWalkProbability         :   0.1,
	maxSeedsPerFrameWalkStep                :   2,

	maxSeedSize                             :  50,
	maxSeedSizeMin                          :  10,
	maxSeedSizeMax                          :  50,
	maxSeedSizeWalkProbability              :   0.1,
	maxSeedSizeWalkStep                     :  10,

	interpolationProbability                :   1.0,
	interpolationProbabilityMin             :   0.0,
	interpolationProbabilityMax             :   1.0,
	interpolationProbabilityWalkProbability :   0.1,
	interpolationProbabilityWalkStep        :   0.2,

	minS                                    :   0,
	minSMin                                 :   0,
	minSMax                                 : 100,
	minSWalkProbability                     :   0.1,
	minSWalkStep                            :  10,

	maxS                                    : 100,
	maxSMin                                 :   0,
	maxSMax                                 : 100,
	maxSWalkProbability                     :   0.1,
	maxSWalkStep                            :  10,

	minB                                    :   0,
	minBMin                                 :   0,
	minBMax                                 : 100,
	minBWalkProbability                     :   0.1,
	minBWalkStep                            :  10,

	maxB                                    : 100,
	maxBMin                                 :   0,
	maxBMax                                 : 100,
	maxBWalkProbability                     :   0.1,
	maxBWalkStep                            :  10,
};

var cells;

function setup() {
	createCanvas(windowWidth, windowHeight);
	noCursor();
	colorMode(HSB);
	noStroke();

	settings.rows    = Math.round(height / settings.gridSize);
	settings.columns = Math.round(width  / settings.gridSize);

	cells = create2DArray(settings.rows, settings.columns);

	for (var i = 0; i < settings.rows; i++) {
		for (var j = 0; j < settings.columns; j++) {
			var row    = i;
			var column = j;
			var h      = randomIntegerInclusive(0, 360);
			var s      = randomIntegerInclusive(settings.minS, settings.maxS);
			var b      = 0;

			cells[i][j] = new Cell(row, column, h, s, b);
		}
	}
}

function draw() {
	for (var i = 0; i < settings.rows; i++) {
		for (var j = 0; j < settings.columns; j++) {
			cells[i][j].display();

			if (coin(settings.interpolationProbability)) {
				cells[i][j].interpolateColor();
			}
		}
	}

	var newSeeds = randomIntegerInclusive(settings.minSeedsPerFrame, settings.maxSeedsPerFrame);

	for (var i = 0; i < newSeeds; i++) {
		seed();
	}

	walk();
}

function seed() {
	var i1 = randomIntegerInclusive(0, settings.rows    - 1);
	var j1 = randomIntegerInclusive(0, settings.columns - 1);

	var iOffset = randomIntegerInclusive(-settings.maxSeedSize, settings.maxSeedSize);
	var jOffset = randomIntegerInclusive(-settings.maxSeedSize, settings.maxSeedSize);

	var i2 = constrain(i1 + iOffset, 0, settings.rows    - 1);
	var j2 = constrain(j1 + jOffset, 0, settings.columns - 1);

	var h = randomIntegerInclusive(0, 360);
	var s = randomIntegerInclusive(settings.minS, settings.maxS);
	var b = randomIntegerInclusive(settings.minB, settings.maxB);

	for (var i = i1; i < i2 - 1; i++) {
		for (var j = j1; j < j2 - 1; j++) {
			cells[i][j].h = h;
			cells[i][j].s = s;
			cells[i][j].b = b;
		}
	}
}

function walk() {
	if (coin(settings.minSeedsPerFrameWalkProbability)) {
		settings.minSeedsPerFrame         = randomWalkInteger(settings.minSeedsPerFrame,         settings.minSeedsPerFrameMin,         settings.minSeedsPerFrameMax,         settings.minSeedsPerFrameWalkStep);
	}

	if (coin(settings.maxSeedsPerFrameWalkProbability)) {
		settings.maxSeedsPerFrame         = randomWalkInteger(settings.maxSeedsPerFrame,         settings.maxSeedsPerFrameMin,         settings.maxSeedsPerFrameMax,         settings.maxSeedsPerFrameWalkStep);
	}

	if (coin(settings.maxSeedSizeWalkProbability)) {
		settings.maxSeedSize              = randomWalkInteger(settings.maxSeedSize,              settings.maxSeedSizeMin,              settings.maxSeedSizeMax,              settings.maxSeedSizeWalkStep);
	}

	if (coin(settings.interpolationProbabilityWalkProbability)) {
		settings.interpolationProbability = randomWalkFloat(  settings.interpolationProbability, settings.interpolationProbabilityMin, settings.interpolationProbabilityMax, settings.interpolationProbabilityWalkStep);
	}

	if (coin(settings.minSWalkProbability)) {
		settings.minS                     = randomWalkInteger(settings.minS,                     settings.minSMin,                     settings.minSMax,                     settings.minSWalkStep);
	}

	if (coin(settings.maxSWalkProbability)) {
		settings.maxS                     = randomWalkInteger(settings.maxS,                     settings.maxSMin,                     settings.maxSMax,                     settings.maxSWalkStep);
	}

	if (coin(settings.minBWalkProbability)) {
		settings.minB                     = randomWalkInteger(settings.minB,                     settings.minBMin,                     settings.minBMax,                     settings.minBWalkStep);
	}

	if (coin(settings.maxBWalkProbability)) {
		settings.maxB                     = randomWalkInteger(settings.maxB,                     settings.maxBMin,                     settings.maxBMax,                     settings.maxBWalkStep);
	}
}