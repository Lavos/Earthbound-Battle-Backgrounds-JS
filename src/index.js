import Rom from "./rom/rom";
import data from "../data/truncated_backgrounds.dat";
import Engine from "./engine";
import BackgroundLayer from "./rom/background_layer";
const backgroundData = new Uint8Array(Array.from(data).map(x => x.charCodeAt(0)));
const ROM = new Rom(backgroundData);

var defaults = {
	element: null,
	debug: false,
	fps: 60,
	frameSkip: 1,
	aspectRatio: 0,
	timeoutMS: 15000,
};

export class BackgroundManager {
	constructor (backgroundOptions) {
		this.options = backgroundOptions;
		this.current = null;
		this.a = new Background(backgroundOptions);
		this.b = new Background(backgroundOptions);

		this.timer = null;

		this.element = backgroundOptions.element;
		this.element.appendChild(this.a.element);
		this.element.appendChild(this.b.element);

		document.addEventListener('keyup', this.handleKeypress.bind(this));
	}

	change () {
		if (this.current) {
			this.current.transitionOut();
		};

		if (this.a === this.current) {
			this.current = this.b;
		} else {
			this.current = this.a;
		};

		this.current.start();
	}

	run () {
		if (this.timer) {
			clearInterval(this.timer);
		};

		this.change();
		window.requestAnimationFrame(this.handleFrame.bind(this));
		this.timer = setInterval(this.change.bind(this), this.options.timeoutMS);
	}

	handleKeypress (event) {
		switch (event.which) {
		case 32:
			this.run();
		break;
		}
	}

	handleFrame () {
		window.requestAnimationFrame(this.handleFrame.bind(this));

		if (this.a.animate) {
			this.a.frameCallback();
		};

		if (this.b.animate) {
			this.b.frameCallback();
		};
	}
}

function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

class Background {
	constructor (options) {
		this.options = Object.assign({}, defaults, options);
		this.element = document.createElement('canvas');
		this.animate = false;
	}

	initEngine () {
		this.layer1 = new BackgroundLayer(getRandomInt(0, 326), ROM);
		this.layer2 = new BackgroundLayer(getRandomInt(0, 326), ROM);

		// Create animation engine
		this.engine = new Engine([this.layer1, this.layer2], {
			fps: this.options.fps,
			aspectRatio: this.options.aspectRatio,
			frameSkip: this.options.frameSkip,
			alpha: [0.5, 0.5],
			canvas: this.element,
		});

		this.frameCallback = this.engine.animate(this.options.debug);
	}

	transitionOut () {
		this.element.classList.toggle('visible', false);

		setTimeout(() => {
			this.setAnimate(false);
		}, 2100);
	}

	start () {
		this.element.classList.toggle('visible', true);
		this.setAnimate(true);
		this.initEngine();
	}

	setAnimate (animate) {
		this.animate = animate;
	}
}

/*
var setupEngine = exports.setupEngine = function setupEngine() {
  let params = getJsonFromUrl()
  let loader = null

  let layer1Val = parseLayerParam(params.layer1, { firstLayer: true })
  let layer2Val = parseLayerParam(params.layer2, { firstLayer: false })
  let frameskip = parseFrameskipParam(params.frameskip)
  let aspectRatio = parseAspectRatioParam(params.aspectRatio)
  parseFullscreen(params.fullscreen)

  let debug = params.debug === "true";

  let fps = 30
  let alpha = parseFloat(0.5)

  if (layer2Val === 0) {
    alpha = parseFloat(1.0)
  }

  // Create two layers
  document.BackgroundLayer = BackgroundLayer
  const layer1 = new document.BackgroundLayer(layer1Val, ROM)
  const layer2 = new document.BackgroundLayer(layer2Val, ROM)

  // Create animation engine
  const engine = new Engine([layer1, layer2], {
    fps: fps,
    aspectRatio: aspectRatio,
    frameSkip: frameskip,
    alpha: [alpha, alpha],
    canvas: document.querySelector('canvas')
  })

  document.engine = engine
  document.engine.animate(debug)
}

setupEngine();

*/
