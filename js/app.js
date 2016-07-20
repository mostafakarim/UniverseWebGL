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

// Helpers
gridXZ = new THREE.GridHelper(2000, 10);
axisHelper = new THREE.AxisHelper( 5 );

light	= new THREE.AmbientLight( 0x222222 )
//scene.add( light )
light	= new THREE.DirectionalLight( 0xffffff, 0.5)
//scene.add(light)


light2	= new THREE.AmbientLight( 0x222222 )
scene.add( light2 )
light2.rotation.y= rad(45)
light2	= new THREE.DirectionalLight( 0xffffff, 1)
scene.add(light2)

//light.add(axisHelper)
//light2.add(axisHelper)

/*light.position.set(0,0,0)
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
light.decay = 2;*/


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

function rad(degree){
	var angle = degree * Math.PI / 180;
	return angle;
}

function deg(rad){
	var angle = rad * 180 / Math.PI;
	return angle;
}

function sec(years){
	var secondes = years*24*60*60;
	return secondes;
}

 function dependency(planet, planetMesh, radius){
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
		var moonData = UniverseData.planet('Moon');
		var distanceMoon = UniverseData.getPosition('Moon') *10;
		moon.position.set(distanceMoon, 0, 0)
		moon.castShadow	= true 
		moon.receiveShadow	= true

		this.moonContainer = new THREE.Object3D();
		this.moonContainer.add(moon);
		
		planetMesh.add(this.moonContainer);
		planetMesh.rotation.x = rad(moonData.OrbitalInclination);

		/*
		moon.add(gridXZ);
		moon.add( axisHelper );
		*/

		

		onRenderFcts.push(function(delta, now){
			// Rotate around the world, around the world ♪
			//moon.rotation.y += moonDay * UniverseData.ratioTmp;
			//this.moonContainer.rotation.y += moonYear * UniverseData.ratioTmp;
			

			this.moonContainer.rotation.y += rad(360) * delta / moonData.RotationPeriod;

			if(moon.rotation.y > rad(360)){
				moon.rotation.y = 0;
			}
			else{
				moon.rotation.y += rad(360) * delta / moonData.OrbitalPeriod;
			}
			
		})

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

	if(planet == 'Saturn'){
		this.planetMeshRing = new THREEx.Planets.createSaturnRing();
		this.planetMeshRing.scale.multiplyScalar(4);
		planetMesh.add(this.planetMeshRing);
	}
	return
}

function setFocusPlanet(planet){
	var planet = planet || 'Sun';
	this.focusRadius = UniverseData.getRadius(planet);
	this.focusPlanet = window[planet];

	this.focusPlanet.cameraPlanet.position.set(this.focusPlanet.radius*4,this.focusPlanet.radius,0)
	this.focusPlanet.cameraPlanet.rotation.set(0,0,0)
	this.focusPlanet.cameraPlanet.lookAt(Sun.planetMesh.position);
	this.focusPlanet.controlsPlanet.reset();

	onRenderFcts.push(function(){
		renderer.render( scene, this.focusPlanet.cameraPlanet );
		this.focusPlanet.controlsPlanet.update();		
	})
}

// Class Planet 

var Planet = function(planet){
	this.containerPlanet = null;
	this.planetMesh = null;
	this.planetMeshRing = null;
	this.inclinaison = null;
	var planetSceneName;
	this.radius = UniverseData.getRadius(planet);


	//Create Scene for each planet
	this.scenePlanet = new THREE.Object3D()

	//Create Container
	this.containerPlanet = new THREE.Object3D()

	// Add container to the scene
	this.scenePlanet.add(this.containerPlanet);

	scene.add(this.scenePlanet);
	//this.scenePlanet.add(gridXZ)
	var planetFunction = 'create' + planet
	this.planetMesh = THREEx.Planets[planetFunction]()

	this.containerPlanet.add(this.planetMesh)
	this.distanceFromSun =  UniverseData.getPosition(planet);
	this.containerPlanet.position.set(this.distanceFromSun,0,0)

	var OrbitalPeriod = UniverseData.planet(planet).OrbitalPeriod;
	if(OrbitalPeriod){
		OrbitalPeriod = OrbitalPeriod.replace(',','');
		//OrbitalPeriod = OrbitalPeriod * UniverseData.ratioTmp
	}

	//Set Angle for each planet
	this.inclinaison = UniverseData.planet(planet).OrbitalInclination
	if(this.inclinaison)
		this.scenePlanet.rotateZ(rad(this.inclinaison))

	//Set cericle in one day for each planet
	this.circlePerDay = UniverseData.planet(planet).RotationPeriod
	this.cameraPlanet  = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 5000 );
	this.cameraPlanet.position.x =  this.radius*4;
	this.cameraPlanet.position.y =  this.radius;
	this.cameraPlanet.position.z =  0;

	this.containerPlanet.add(this.cameraPlanet)
	this.controlsPlanet = new THREE.OrbitControls( this.cameraPlanet );
	this.containerPlanet.add(this.controlsPlanet)

	if(planet != 'Sun'){
		var countDay = 0;
		var countYear = 0;
		console.log(planet + ' : ' + this.circlePerDay, OrbitalPeriod)
		onRenderFcts.push(function(delta, now){
			var planetSceneName = window[planet];

			// Rotate around the world, around the world ♪
			if(planetSceneName.planetMesh.rotation.y > rad(360)){
				countDay++;
				planetSceneName.planetMesh.rotation.y = 0;
				console.log(planet +' : '+countDay);
			}else
				planetSceneName.planetMesh.rotation.y += rad(360) * delta / planetSceneName.circlePerDay;
				//console.log(planet + ': ' + deg(planetSceneName.scenePlanet.rotation.y));
			
			//Rotate around the Sun	
			if(OrbitalPeriod){
				if(planetSceneName.scenePlanet.rotation.y > rad(360)){
					planetSceneName.scenePlanet.rotation.y = 0;
					console.log(planet +' : '+countYear);
				}
				else
					planetSceneName.scenePlanet.rotation.y += rad(360) * delta / OrbitalPeriod;
			}
		})
	}

	dependency(planet, this.planetMesh, this.radius);          
} 

//	Create solar system

for(var i=0; i < this.planets.length; i++){
	var newPlanet =  this.planets[i];
	window[this.planets[i]] = new Planet(newPlanet);
}

light.position.y= -Sun.radius /2 ;
light2.position.x= 0;

// Set default focus
setFocusPlanet('Earth');


//var maxRange = UniverseData.planet('Pluto')['DistancefromSun']