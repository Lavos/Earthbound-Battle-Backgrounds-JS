import Rom from "./rom/rom";
import data from "../data/truncated_backgrounds.dat";
import Engine from "./engine";
import BackgroundLayer from "./rom/background_layer";
const backgroundData = new Uint8Array(Array.from(data).map(x => x.charCodeAt(0)));
const ROM = new Rom(backgroundData);

var defaults = {
	canvasid: null,
	debug: false,
	fps: 30,
	frameSkip: 1,
	aspectRatio: 16,
	layer1: 270,
	layer2: 269,
};

export class Background {
	constructor (options) {
		this.options = Object.assign({}, defaults, options);

		this.layer1 = new BackgroundLayer(this.options.layer1, ROM)
		this.layer2 = new BackgroundLayer(this.options.layer2, ROM)

		if (this.options.canvasid) {
			// Create animation engine
			this.engine = new Engine([this.layer1, this.layer2], {
				fps: this.options.fps,
				aspectRatio: this.options.aspectRatio,
				frameSkip: this.options.frameSkip,
				alpha: [0.5, 0.5],
				canvas: document.getElementById(this.options.canvasid)
			})
		};

		backgrounds.push(this);
	}

	animate () {
		return this.engine.animate(this.options.debug);
	}
}

export function RunAllBackgrounds(backgrounds) {
	var fs = [];

	for (var x = 0, n = backgrounds.length; x < n; x++) {
		fs.push(backgrounds[x].animate());
	};

	var f = function () {
		window.requestAnimationFrame(f);

		for (var x = 0, n = fs.length; x < n; x++) {
			fs[x]();
		};
	};

	window.requestAnimationFrame(f);
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
