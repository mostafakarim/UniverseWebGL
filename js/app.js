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
controls = new THREE.OrbitControls( camera );
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
gridXZ.position.set(0,0,0 );
//scene.add(gridXZ);

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
	var planet = planet || 'Earth';
	this.focusRadius = UniverseData.getRadius(planet);
	this.focusPlanet = window[planet];
	/*camera.position.x = window[planet].planetMesh.position.x + this.focusRadius*4;
	camera.position.y =  window[planet].planetMesh.position.y;*/
	camera.position.y =  window[planet].planetMesh.position.y + this.focusRadius*8;

	//controls.target.copy(window[planet].planetMesh.position)

	onRenderFcts.push(function(){
		renderer.render( scene, camera );
		camera.lookAt(window[planet].planetMesh.position);
		controls.update();		
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

	onRenderFcts.push(function(delta, now){
		window[planet].planetMesh.rotation.y += 1/32 * delta;	
		if(OrbitalVelocity)
			window[planet].containerPlanet.rotation.y += OrbitalVelocity;
	})

	if(planet == 'Sun'){
		var radiusPlanet = UniverseData.getRadius(planet);
		radius = radiusPlanet ;
		var geometry	= new THREE.SphereGeometry(radius, 32, 32)
		var material	= THREEx.createAtmosphereMaterial()
		material.uniforms.glowColor.value.set(0xFFF191)
		material.uniforms.coeficient.value	= 0.8
		material.uniforms.power.value		= 3
		var atmosphereSun	= new THREE.Mesh(geometry, material );
		atmosphereSun.scale.multiplyScalar(1.01);
		this.containerPlanet.add(atmosphereSun);
	}
	if(planet == 'Uranus' ||planet == 'Saturn')
		this.planetMesh.add(this.planetMeshRing);


	if(planet == 'Earth'){
		//console.log(UniverseData.planet(planet)['RotationPeriod'] / UniverseData.ratioTmp, 1/32 )

		var radiusPlanet = UniverseData.getRadius(planet);
		radius = radiusPlanet ;
		var geometry	= new THREE.SphereGeometry(radius, 32, 32)
		var material	= THREEx.createAtmosphereMaterial()
		material.uniforms.glowColor.value.set(0x00b3ff)
		material.uniforms.coeficient.value	= 0.8
		material.uniforms.power.value		= 2.0
		var atmosphereEarth	= new THREE.Mesh(geometry, material );
		atmosphereEarth.scale.multiplyScalar(1.01);
		this.planetMesh.add(atmosphereEarth);

		var earthCloud	= THREEx.Planets.createEarthCloud(radius)
		earthCloud.receiveShadow	= true
		earthCloud.castShadow	= true
		this.planetMesh.add(earthCloud)

		onRenderFcts.push(function(delta, now){
			earthCloud.rotation.y += 1/8 * delta;		
		})

		this.sat = THREEx.Planets.createMoon()
		this.sat.position.set(0.5, 0.5, 0.5)
		this.sat.scale.multiplyScalar(1/5)
		this.sat.receiveShadow	= true
		this.sat.castShadow	= true          
		this.planetMesh.add(this.sat)
	}          
} 

//	Create solar system
/*var Sun = new Planet("Sun");
var Mercury = new Planet("Mercury")
var Venus = new Planet("Venus")
var Earth = new Planet("Earth")
var Mars = new Planet("Mars")
var Jupiter = new Planet("Jupiter")
var Saturn = new Planet("Saturn")
var Uranus = new Planet("Uranus")
var Neptune = new Planet("Neptune")
var Pluto = new Planet("Pluto");*/

for(var i=0; i < this.planets.length; i++){
	var newPlanet =  this.planets[i];
	console.log(newPlanet);
	newPlanet = new Planet(newPlanet);
}

// Set default focus
setFocusPlanet('Sun');


//var maxRange = UniverseData.planet('Pluto')['DistancefromSun']