var container, controls;

var camera, scene, renderer, objects;
var particleLight, pointLight;
var dae;
var projector;

var clock = new THREE.Clock();
var objects = [];

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
	var loader = new THREE.ColladaLoader();
				loader.options.convertUpAxis = true;
				loader.load( 'teapot.dae', function colladaReady( collada ) {

				/*dae = collada.scene;
				skin = collada.skins[ 0 ];
				dae.children[1].doubleSided = true;
				dae.scale.x = dae.scale.y = dae.scale.z = 10;
				daemesh = dae.children[1];
				daemesh.castShadow = true;
				daemesh.receiveShadow = true;
				scene.add(dae);*/
				var geometry = collada.scene.children[ 1 ].geometry;
				var material = collada.scene.children[ 1 ].material;
				for(var i = 0;i < 5;++i){
					var mesh = new THREE.Mesh( geometry, material );
					mesh.scale.x = mesh.scale.y = mesh.scale.z = 10;
					mesh.doubleSided = true;
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					mesh.position.set( i*200, 0 , 1000-i*500 );
					scene.add( mesh );
					objects.push( mesh );
				}
			} );
	projector = new THREE.Projector();
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
	render();
}

function render() {
	var delta = clock.getDelta();
	THREE.AnimationHandler.update(delta);
	controls.update(delta);
	renderer.render(scene, camera);
}