var container;
var camera, scene, renderer;
var cube;
var obj;

init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.y = 150;
	camera.position.z = 400;
	camera.position.x = 50;
	scene.add( camera );

	scene.add( new THREE.AmbientLight( 0xeeeeee ) );

	var loader2 = new THREE.ColladaLoader();
	loader2.options.convertUpAxis = true;
	loader2.load( 'testObj/testObj.dae',function colladaReady( collada ) {
		dae = collada.scene;
		dae.scale.x = dae.scale.y = dae.scale.z = 2;
		for(var i in dae.children){
			dae.children[ i ].doubleSided = true;
			if(dae.children[ i ].children[0]&&dae.children[ i ].children[0].material){	
				var material = dae.children[ i ].children[0].material;
				material.transparent = true;
			}
		}
		scene.add(dae);
		var geometrydebug = new THREE.Geometry();
		for(var i in dae.children[ 1 ].geometry.vertices){
			geometrydebug.vertices.push( dae.children[ 1 ].geometry.vertices[i] );
		}
		var line = new THREE.Line( geometrydebug, new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 0.5 } ) );
		line.position = {x:dae.position.x,y:dae.position.y,z:dae.position.z};
		scene.add( line );
	});

	


	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}