var renderer, onRenderFcts, scene, camera, controls, light, gridXZ, starSphere, axisHelper;

this.planets = ["Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Moon"];

// Render the scene
renderer	= new THREE.WebGLRenderer({
	antialias	: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled	= true

onRenderFcts= [];
scene	= new THREE.Scene();
camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 5000 );

// Helpers
gridXZ = new THREE.GridHelper(2000, 10);
axisHelper = new THREE.AxisHelper( 5 );

// Light
light	= new THREE.AmbientLight( 0x222222 )
scene.add( light )
light	= new THREE.DirectionalLight( 0xffffff, 1)
scene.add(light)


light2	= new THREE.AmbientLight( 0x222222 )
scene.add( light2 )
light2.rotation.y= rad(45)
light2	= new THREE.DirectionalLight( 0xffffff, 1)
scene.add(light2)

// Add starfield
starSphere	= THREEx.Planets.createStarfield()
scene.add(starSphere)

function initEvents() {
	var _this = this,
		contentData = $('.content'),
		closeButton = $('.close');

	// Show & Hide panel data
	closeButton.on('click', function(){
		contentData.toggleClass('closed');
	});

	// Update size Universe when window's resized
	window.addEventListener('resize', function() {
		_this.setScaling();
	});

	contentData.on('hover', function() {
		this.focusPlanet.controlsPlanet.enabled = false;
	});

}
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

// Convert degree to radian
function rad(degree){
	var angle = degree * Math.PI / 180;
	return angle;
}

// Convert radian to degree
function deg(rad){
	var angle = rad * 180 / Math.PI;
	return angle;
}

// Convert years to secondes
function sec(years){
	var secondes = years*24*60*60;
	return secondes;
}

// Keep scaling when the window is resized
function setScaling() {
	this.widthWindow = window.innerWidth
	this.heightWindow = window.innerHeight;

    renderer.setSize(this.widthWindow, this.heightWindow);

    this.focusPlanet.cameraPlanet.aspect = this.widthWindow / this.heightWindow;
    this.focusPlanet.cameraPlanet.updateProjectionMatrix();
}

// Because every planet are unique ...
function dependency(self){
	var planet = self.planet,
		planetMesh = self.planetMesh,
		radiusPlanet = UniverseData.getRadius(planet);

	if(planet == 'Earth'){

		var earthCloud	= THREEx.Planets.createEarthCloud()
		earthCloud.receiveShadow	= true
		earthCloud.castShadow	= true
		earthCloud.scale.multiplyScalar(1.01);
		planetMesh.add(earthCloud)
		onRenderFcts.push(function(delta, now){
			earthCloud.rotation.y += 1/8 * delta;		
		})
	}

	if(planet == 'Saturn'){
		var planetMeshRing = new THREEx.Planets.createSaturnRing();
		//planetMeshRing.scale.multiplyScalar(4);
		self.planetMesh.add(planetMeshRing);
	}
	if(planet == 'Uranus'){
		var planetMeshRing = new THREEx.Planets.createUranusRing();
		//planetMeshRing.scale.multiplyScalar(4);
		self.planetMesh.add(planetMeshRing);
	}
	return
}

// Set current planet focus 
function setFocusPlanet(planet){
	var planet = planet || 'Sun',
		_this = this,
		planetContent = $('.planet');

	this.focusRadius = UniverseData.getRadius(planet);
	this.focusPlanet = eval(planet);

	this.focusPlanet.cameraPlanet.position.set(this.focusPlanet.radius*4,this.focusPlanet.radius,0)
	this.focusPlanet.cameraPlanet.rotation.set(0,0,0)
	this.focusPlanet.cameraPlanet.lookAt(Sun.planetMesh.position);
	this.focusPlanet.controlsPlanet.reset();

	this.widthWindow = window.innerWidth
	this.heightWindow = window.innerHeight;

	onRenderFcts.push(function(){
		renderer.render( scene, this.focusPlanet.cameraPlanet );
		this.focusPlanet.controlsPlanet.update();		
	});

	for(var i=0; i < this.planets.length; i++){
		if (planet == this.planets[i]) {
			planetContent.removeClass('active');
			$(planetContent[i]).addClass('active');
		}
	}
	
	this.setScaling();
}


// Class Planet 

var Planet = function(planet){
	var planetSceneName;
	var planetData =  UniverseData.planet(planet);

	this.planet = planet;
	this.containerPlanet = null;
	this.planetMesh = null;
	this.planetMeshRing = null;
	this.inclinaison = null;
	this.radius = UniverseData.getRadius(this.planet);


	//Create Scene for each planet
	this.scenePlanet = new THREE.Object3D()

	//Create Container
	this.containerPlanet = new THREE.Object3D()

	// Add container to the scene
	this.scenePlanet.add(this.containerPlanet);

	if(this.planet == 'Moon')
		window['Earth'].planetMesh.add(this.scenePlanet);
	else
		scene.add(this.scenePlanet);

	this.planetMesh = THREEx.Planets.create(planet);

	this.containerPlanet.add(this.planetMesh)
	this.distanceFromOrigine =  UniverseData.getPosition(this.planet);
	this.containerPlanet.position.set(this.distanceFromOrigine,0,0)

	var OrbitalPeriod = planetData.OrbitalPeriod;
	if(OrbitalPeriod){
		OrbitalPeriod = OrbitalPeriod.replace(',','');
	}

	//Atmoshere
	var geometry	= new THREE.SphereGeometry(this.radius, 32, 32)
	this.material	= THREEx.createAtmosphereMaterial()
	this.material.side	= THREE.BackSide
	this.material.uniforms.glowColor.value.set(0xffffff)
	this.material.uniforms.coeficient.value	= 0.5
	this.material.uniforms.power.value		= 15.0

	var mesh	= new THREE.Mesh(geometry, this.material );
	mesh.scale.multiplyScalar(1.15);
	this.planetMesh.add( mesh );

	//Set Angle for each planet
	this.inclinaison = planetData.OrbitalInclination
	if(this.inclinaison)
		this.scenePlanet.rotateZ(rad(this.inclinaison))

	//Set cericle in one day for each planet
	this.circlePerDay = planetData.RotationPeriod
	this.cameraPlanet  = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 5000);
	this.cameraPlanet.position.x =  this.radius*4;
	this.cameraPlanet.position.y =  this.radius;
	this.cameraPlanet.position.z =  0;

	this.containerPlanet.add(this.cameraPlanet)
	this.controlsPlanet = new THREE.OrbitControls( this.cameraPlanet );

	//Set Color Atmosphere
	this.material.uniforms.glowColor.value.set(planetData.Color)

	if(this.planet != 'Sun'){
		var countDay = 0,
			countYear = 0,
			self = this;
		onRenderFcts.push(function(delta, now){
			planetSceneName = window[self.planet];

			// Rotate around the world, around the world ♪
			if(planetSceneName.planetMesh.rotation.y > rad(360)){
				countDay++;
				planetSceneName.planetMesh.rotation.y = 0;
			}else
				planetSceneName.planetMesh.rotation.y += rad(360) * delta / planetSceneName.circlePerDay;
			
			//Rotate around the Sun	
			if(OrbitalPeriod){
				if(planetSceneName.scenePlanet.rotation.y > rad(360)){
					planetSceneName.scenePlanet.rotation.y = 0;
				}
				else
					planetSceneName.scenePlanet.rotation.y += rad(360) * delta / OrbitalPeriod;
			}
		})
	}

	dependency(this);   

} 

//	Create solar system
var contentDataHtml = $('.content-data'),
	tableData = {},
	_this = this;

for(var i=0; i < this.planets.length; i++){
	var newPlanet =  this.planets[i];

	$.each( UniverseData.unity(), function( key, value ) {
		if(UniverseData.planet(newPlanet)[key]){
			tableData = '<b> ' +  value[1] + ' : ' + UniverseData.planet(newPlanet)[key] + '</b> <span>'+  value[0] + '</span> <br><br>';
			$(contentDataHtml[i]).append('<p>' + tableData +'</p>');
		}
	});

	window[this.planets[i]] = new Planet(newPlanet);
}

light.position.y = -Sun.radius /2 ;
light2.position.x = 0;

// Set default focus
setFocusPlanet('Uranus');

//Listeners
initEvents();

