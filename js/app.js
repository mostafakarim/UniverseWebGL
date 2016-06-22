var renderer, onRenderFcts, scene, camera, controls, light, gridXZ, starSphere, axisHelper;

//this.universePlanet = Object.keys(UniverseData.planet());
this.planets = ["Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

// Render the scene
renderer	= new THREE.WebGLRenderer({
	antialias	: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMapEnabled	= true

onRenderFcts= [];
scene	= new THREE.Scene();
camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 5000 );

// Camera Controls
//var matrixCamera = new THREE.Matrix4();


// Lights 
light	= new THREE.AmbientLight( 0x222222 )
scene.add( light )

light	= new THREE.DirectionalLight( 0xffffff, 1 )
light.position.set(5,5,5)
scene.add( light )
light.castShadow	= true
light.shadowCameraNear	= 0.01
light.shadowCameraFar	= 15
light.shadowCameraFov	= 45

light.shadowCameraLeft	= -1
light.shadowCameraRight	=  1
light.shadowCameraTop	=  1
light.shadowCameraBottom= -1

light.shadowBias	= 0.001
light.shadowDarkness	= 0.2

light.shadowMapWidth	= 1024
light.shadowMapHeight	= 1024

// Helpers
gridXZ = new THREE.GridHelper(2000, 10);
gridXZ.setColors( new THREE.Color(0xFFC0CB), new THREE.Color(0x8f8f8f) );
gridXZ.position.set(0,0,0);
scene.add(gridXZ);

axisHelper = new THREE.AxisHelper( 5 );
//scene.add( axisHelper );

// Add starfield

starSphere	= THREEx.Planets.createStarfield()
scene.add(starSphere)

// Control panel
//var datGUI	= new dat.GUI();


// Listeners

window.addEventListener('resize', function() {
    var width = window.innerWidth,
        height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});


// Loop runner
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
	// keep looping
	requestAnimationFrame( animate );
	// measure time
	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
	lastTimeMsec	= nowMsec

	// call each update function
	onRenderFcts.forEach(function(onRenderFct){
		onRenderFct(deltaMsec/1000, nowMsec/1000)
	})

});


function setFocusPlanet(planet){
	var planet = planet || 'Sun';
	this.focusRadius = UniverseData.getRadius(planet);
	this.focusPlanet = window[planet];
	/*camera.position.x = window[planet].planetMesh.position.x + this.focusRadius*4;
	camera.position.y =  window[planet].planetMesh.position.y;*/
	//camera.position.y =  window[planet].planetMesh.position.y + this.focusRadius*8;

	var cameraPlanet = 'camera' + planet
	var controlsPlanet = 'controls' + planet
	window[cameraPlanet].position.x =  window[planet].planetMesh.position.x + this.focusRadius*8;
	window[cameraPlanet].position.y =  0;
	window[cameraPlanet].position.z =  window[planet].planetMesh.position.z + this.focusRadius*4;

	//window[cameraPlanet].rotation.y = window[planet].planetMesh.rotation.y;
	window[controlsPlanet] = new THREE.OrbitControls( window[cameraPlanet] );

	onRenderFcts.push(function(){
		renderer.render( scene, window[cameraPlanet] );
		window[cameraPlanet].lookAt(window[planet].planetMesh.position);
		window[controlsPlanet].update();		
	})
}

function rad(degree){
	var angle = degree * Math.PI / 180;
	return angle;
}

function sec(years){
	var secondes = years*24*60*60;
	return secondes;
}

 function dependency(planet, planetMesh){
	var type = type || null;
	var radiusPlanet = UniverseData.getRadius(planet);
	if(planet == 'Earth'){

		//Atmoshere
		var materialAtmosphere	= THREEx.createAtmosphereMaterial()
		materialAtmosphere.uniforms.glowColor.value.set(0x00b3ff)
		materialAtmosphere.uniforms.coeficient.value	= 0.8
		materialAtmosphere.uniforms.power.value		= 2.0
		var atmosphereEarth	= new THREE.Mesh(planetMesh.geometry, materialAtmosphere );
		atmosphereEarth.scale.multiplyScalar(1.01);

		planetMesh.add(atmosphereEarth);

		//Cloud
		var earthCloud = THREEx.Planets.createEarthCloud(radiusPlanet);
		//var earthCloud	= new THREE.Mesh(planetMesh.geometry, materialCloud );
		earthCloud.scale.multiplyScalar(0.25);

		planetMesh.add(earthCloud);

		//Moon
		var moon = THREEx.Planets.createMoon();
		moon.position.set(0.5, 0.5, 0.5)
		moon.castShadow	= true 
		moon.receiveShadow	= true
		moon.scale.multiplyScalar(1/10);
		
		planetMesh.add(moon);

	}

	if(planet == 'Sun'){
		var materialSun	= THREEx.createAtmosphereMaterial()
		materialSun.uniforms.glowColor.value.set(0xFFF191)
		materialSun.uniforms.coeficient.value	= 0.8
		materialSun.uniforms.power.value		= 3
		var atmosphereSun	= new THREE.Mesh(planetMesh.geometry, materialSun );
		atmosphereSun.scale.multiplyScalar(1.01);
		
		planetMesh.add(atmosphereSun);
	}

/*	if(planet == 'Uranus' ||planet == 'Saturn')
		planetMesh.add(this.planetMeshRing);*/

		
	return
}

// Class Planet 

var Planet = function(planet){
	this.containerPlanet = null;
	this.planetMesh = null;
	this.planetMeshRing = null;
	this.inclinaison = null;

	//Create Container
	this.containerPlanet = new THREE.Object3D()

	//Set Angle of each planets
	this.inclinaison = UniverseData.planet(planet)['OrbitalInclination']
	if(this.inclinaison)
		this.containerPlanet.rotateZ(rad(this.inclinaison))

	var cameraPlanet = 'camera' + planet
	window[cameraPlanet]  = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 5000 );

	window[cameraPlanet].rotateY(rad(this.inclinaison));
	console.log(window[cameraPlanet].rotation)
	// Add container to the scene
	scene.add(this.containerPlanet)
	var planetFunction = 'create' + planet
	this.planetMesh = THREEx.Planets[planetFunction]()

	this.containerPlanet.add(this.planetMesh)
	this.distanceFromSun =  UniverseData.getPosition(planet);
	this.planetMesh.position.set(this.distanceFromSun,0,0)
	var OrbitalVelocity = UniverseData.planet(planet)['OrbitalVelocity'];
	
	if(OrbitalVelocity){
		OrbitalVelocity = OrbitalVelocity.replace(',','');
		OrbitalVelocity = OrbitalVelocity / 1000
	}
	var planetContainerName;
	var radius = UniverseData.getRadius(planet);


	onRenderFcts.push(function(delta, now){
		planetContainerName = window[planet].containerPlanet;
		// Rotate around the world, around the world ♪
		window[planet].planetMesh.rotation.y += 1/32 * delta;

		//Rotate around the Sun	
		/*if(OrbitalVelocity){
			if(planetContainerName.rotation.y > rad(360))
				planetContainerName.rotation.y = 0;
			else
				planetContainerName.rotation.y += OrbitalVelocity;
		}*/

	})

	dependency(planet, this.planetMesh);          
} 

//	Create solar system

for(var i=0; i < this.planets.length; i++){
	var newPlanet =  this.planets[i];
	window[this.planets[i]] = new Planet(newPlanet);
}

// Set default focus
setFocusPlanet('Earth');


//var maxRange = UniverseData.planet('Pluto')['DistancefromSun']