var container, controls;

var camera, scene, renderer, objects;
var particleLight, pointLight;
var dae, skin;

var clock = new THREE.Clock();
var morphs = [];

// Collada model

init();
animate();

function init() {
	container = document.createElement('div');
	document.body.appendChild(container);
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
	camera.position.set(700, 1000, 700);
	camera.lookAt({
		x : 0,
		y : 0,
		z : 0
	});
	scene.add(camera);
	controls = new THREE.TrackballControls(camera);

	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;

	controls.noZoom = false;
	controls.noPan = false;

	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	controls.keys = [65, 83, 68];

	// GROUND

	var geometry = new THREE.PlaneGeometry(100, 100);
	var planeMaterial = new THREE.MeshPhongMaterial({
		color : 0xffdd99
	});
	THREE.ColorUtils.adjustHSV(planeMaterial.color, 0, 0, 0.9);
	planeMaterial.ambient = planeMaterial.color;

	var ground = new THREE.Mesh(geometry, planeMaterial);

	ground.position.set(0, 0, 0);
	ground.rotation.x = -Math.PI / 2;
	ground.scale.set(100, 100, 100);

	ground.castShadow = false;
	ground.receiveShadow = true;

	scene.add(ground);

	// Add Blender exported Collada model
	var loader = new THREE.JSONLoader();
	loader.load("ateapot.js", function(geometry) {//models/animated/monster/monster.js
		// adjust color a bit
		var material = geometry.materials[0];
		material.morphTargets = true;

		var faceMaterial = new THREE.MeshFaceMaterial();
		morph = new THREE.MorphAnimMesh(geometry, faceMaterial);
		morph.duration = 1000;
		morph.time = 1000 * Math.random();
		morph.scale.set(10, 10, 10);
		//morph.scale.set(0.1, 0.1, 0.1);
		morph.position.set(0, 0, 0);
		morph.castShadow = true;
		morph.receiveShadow = true;
		scene.add(morph);
		morphs.push(morph);
	});
	// Lights
	light = new THREE.SpotLight(0xeeeeee);
	light.position.set(0, 1500, 1000);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	scene.add(light);
	// Renderer
	renderer = new THREE.WebGLRenderer({
		clearColor : 0x000000,
		clearAlpha : 1,
		antialias : true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
}

function animate() {
	requestAnimationFrame(animate);
	// animate morphs

	var delta = clock.getDelta();

	if(morphs.length) {

		for(var i = 0; i < morphs.length; i++)
		morphs[i].updateAnimation(1000 * delta);

	}
	render();
}

function render() {
	var delta = clock.getDelta();

	THREE.AnimationHandler.update(delta);

	controls.update(delta);
	renderer.render(scene, camera);
}