var UniverseData = UniverseData || {}

UniverseData.ratioDistance = 25512*4; // default value 
UniverseData.planet	= {}
UniverseData.unity	= {}

UniverseData.unity = function(unity){
	var unity = unity || null;

	this.planets = {
		'Mass' 					:  {
										0 : '10e24 Kg',
										1 : 'Mass'
									},
		'Diameter' 				:  {
										0 : 'Km',
										1 : 'Diameter'
									},
		'Density' 				:  {
										0 : 'Kg/m3',
										1 : 'Density'
									},
		'Gravity'  				:  {
										0 : 'M/s^2',
										1 : 'Gravity'
									},
		'EscapeVelocity' 		:  {
										0 : 'Km/s',
										1 : 'Escape Velocity'
									},
		'RotationPeriod' 		:  {
										0 : 'Hours',
										1 : 'Rotation Period'
									},
		'LengthDay' 			:  {
										0 : 'Hours',
										1 : 'Length of day'
									},
		'DistanceFromSun' 		:  {
										0 : '10e6 Km',
										1 : 'Distance from Sun'
									},
		'DistanceFromEarth'		:  {
										0 : '10e6 Km',
										1 : 'Distance from Earth'
									},
		'Perihelion' 			:  {
										0 : '10e6 Km',
										1 : 'Perihelion'
									},
		'Aphelion' 				:  {
										0 : '10e6 Km',
										1 : 'Aphelion'
									},
		'OrbitalPeriod' 		:  {
										0 : 'Days',
										1 : 'Orbital Period'
									},
		'OrbitalVelocity' 		:  {
										0 : 'Km/s',
										1 : 'Orbital Velocity'
									},
		'OrbitalInclination'	:  {
										0 : 'Degrees',
										1 : 'Orbital Inclination'
									},
		'OrbitalEccentricity' 	:  {
										0 : '',
										1 : 'Orbital Eccentricity'
									},
		'ObliquityToOrbit' 		:  {
										0 : 'Degrees',
										1 : 'Obliquity to Orbit'
									},
		'MeanTemperature' 		:  {
										0 : 'C',
										1 : 'Mean Temperature'
									},
		'SurfacePressure' 		:  {
										0 : 'Bars',
										1 : 'Surface Pressure'
									},
		'NumberMoons' 			:  {
										0 : '',
										1 : 'Number of Moons'
									},
		'GlobalMagneticField' 	:  {
										0 : '',
										1 : 'Global MagneticField'
									}
	}

	if(!unity)
		return this.planets;
	else
		return this.planets[unity];
}

UniverseData.setRatio = function(ratioDistance) {
	if(isNumber (ratioDistance))
		return UniverseData.ratioDistance = ratioDistance;
}

UniverseData.getRadius = function(planet){
	var diameter = UniverseData.planet(eval('planet'))['Diameter'];
	diameter = diameter.replace(',','');
	diameter = Number(diameter) / UniverseData.ratioDistance;
	return diameter/2;
}

UniverseData.getPosition = function(planet){
	var distance;
	if(planet == 'Moon')
		distance = UniverseData.planet(planet)['DistanceFromEarth'] *10;
	else
		distance = UniverseData.planet(planet)['DistancefromSun'];

	distance = (Number(distance) * Math.pow(10, 6)) / (UniverseData.ratioDistance*256);
	return distance;
}

UniverseData.planet = function(planet){

	var planet = planet || null;
	this.data = {
		'Sun' : {
			'Name' 	: 'Sun',
			'Mass' : '1,988,500',
			'Diameter': '391,400',
			'Density': '1408',
			'Gravity': '274.0',
			'EscapeVelocity': '617.6',
			'RotationPeriod': '609.1',
			'LengthDay': false,
			'DistancefromSun': false,
			'Perihelion': false,
			'Aphelion': false,
			'OrbitalPeriod': false,
			'OrbitalVelocity': false,
			'OrbitalInclination': false,
			'OrbitalEccentricit' : false,
			'ObliquityToOrbit': false,
			'MeanTemperature': false,
			'SurfacePressure': false,
			'NumberMoons': '10',
			'RingSystem': false,
			'GlobalMagneticFied' : true,
			'Color' : 0xb28129

		},
		'Mercury' : {
			'Name' 	: 'Mercury',
			'Mass' : '0.330',
			'Diameter': '4879',
			'Density': '5427',
			'Gravity': '3.7',
			'EscapeVelocity': '4.3',
			'RotationPeriod': '1407.6',
			'LengthDay': '4222.6',
			'DistancefromSun': '57.9',
			'Perihelion': '46.0',
			'Aphelion': '69.8',
			'OrbitalPeriod': '88.0',
			'OrbitalVelocity': '47.4',
			'OrbitalInclination': '7.0',
			'OrbitalEccentricit' : '0.205',
			'ObliquityToOrbit': '0.01',
			'MeanTemperature': '167',
			'SurfacePressure': '0',
			'NumberMoons': '0',
			'RingSystem': false,
			'GlobalMagneticFied' : true,
			'Color' : 0xbd9156
		},
		'Venus' : {
			'Name' 	: 'Venus',
			'Mass' : '4.87',
			'Diameter': '12,104',
			'Density': '5243',
			'Gravity': '8.9',
			'EscapeVelocity': '10.4',
			'RotationPeriod': '-5832.5',
			'LengthDay': '2802.0',
			'DistancefromSun': '108.2',
			'Perihelion': '107.5',
			'Aphelion': '108.9',
			'OrbitalPeriod': '224.7',
			'OrbitalVelocity': '35.0',
			'OrbitalInclination': '3.4',
			'OrbitalEccentricit' : '0.007',
			'ObliquityToOrbit': '177.4',
			'MeanTemperature': '464',
			'SurfacePressure': '92',
			'NumberMoons': '0',
			'RingSystem': false,
			'GlobalMagneticFied' : false,
			'Color' : 0xa05912
		},
		'Earth' : {
			'Name' 	: 'Earth',
			'Mass' : '5.97',
			'Diameter': '12,756',
			'Density': '5514',
			'Gravity': '9.8',
			'EscapeVelocity': '11.2',
			'RotationPeriod': '23.9',
			'LengthDay': '24.0',
			'DistancefromSun': '149.6',
			'Perihelion': '147.1',
			'Aphelion': '152.1',
			'OrbitalPeriod': '365.2',
			'OrbitalVelocity': '29.8',
			'OrbitalInclination': '0.0',
			'OrbitalEccentricit' : '0.017',
			'ObliquityToOrbit': '23.4',
			'MeanTemperature': '15',
			'SurfacePressure': '1',
			'NumberMoons': '1',
			'RingSystem': false,
			'GlobalMagneticFied' : true,
			'Color' : 0x6eaae4
		},
		'Moon' : {
			'Name' 	: 'Moon',
			'Mass' : '0.073',
			'Diameter': '3475',
			'Density': '3340',
			'Gravity': '1.6',
			'EscapeVelocity': '2.4',
			'RotationPeriod': '655.7',
			'LengthDay': '708.7',
			'DistanceFromEarth': '0.384',
			'Perihelion': '0.363',
			'Aphelion': '0.406',
			'OrbitalPeriod': '27.3',
			'OrbitalVelocity': '1.0',
			'OrbitalInclination': '5.1',
			'OrbitalEccentricit' : '0.055',
			'ObliquityToOrbit': '6.7',
			'MeanTemperature': '-20',
			'SurfacePressure': '0',
			'NumberMoons': '0',
			'RingSystem': false,
			'GlobalMagneticFied' : false,
			'Color' : 0xa4a4a4
		},
		'Mars' : {
			'Name' 	: 'Mars',
			'Mass' : '0.642',
			'Diameter': '6792',
			'Density': '3933',
			'Gravity': '3.7',
			'EscapeVelocity': '5.0',
			'RotationPeriod': '24.6',
			'LengthDay': '24.7',
			'DistancefromSun': '227.9',
			'Perihelion': '206.6',
			'Aphelion': '249.2',
			'OrbitalPeriod': '687.0',
			'OrbitalVelocity': '24.1',
			'OrbitalInclination': '1.9',
			'OrbitalEccentricit' : '0.094',
			'ObliquityToOrbit': '25.2',
			'MeanTemperature': '-65',
			'SurfacePressure': '0.01',
			'NumberMoons': '2',
			'RingSystem': false,
			'GlobalMagneticFied' : false,
			'Color' : 0x76583b
		},
		'Jupiter' : {
			'Name' 	: 'Jupiter',
			'Mass' : '1898',
			'Diameter': '142,984',
			'Density': '1326',
			'Gravity': '23.1',
			'EscapeVelocity': '59.5',
			'RotationPeriod': '9.9',
			'LengthDay': '9.9',
			'DistancefromSun': '778.6',
			'Perihelion': '740.5',
			'Aphelion': '816.6',
			'OrbitalPeriod': '4331',
			'OrbitalVelocity': '13.1',
			'OrbitalInclination': '1.3',
			'OrbitalEccentricit' : '0.049',
			'ObliquityToOrbit': '3.1',
			'MeanTemperature': '-110',
			'SurfacePressure':  false,
			'NumberMoons': '67',
			'RingSystem': true,
			'GlobalMagneticFied' : true,
			'Color' : 0xb09377
		},
		'Saturn' : {
			'Name' 	: 'Saturn',
			'Mass' : '568',
			'Diameter': '120,536',
			'Density': '687',
			'Gravity': '9.0',
			'EscapeVelocity': '35.5',
			'RotationPeriod': '10.7',
			'LengthDay': '10.7',
			'DistancefromSun': '1433.5',
			'Perihelion': '1352.6',
			'Aphelion': '1514.5',
			'OrbitalPeriod': '10,747',
			'OrbitalVelocity': '9.7',
			'OrbitalInclination': '2.5',
			'OrbitalEccentricit' : '0.057',
			'ObliquityToOrbit': '26.7',
			'MeanTemperature': '-140',
			'SurfacePressure': false,
			'NumberMoons': '62',
			'RingSystem': true,
			'GlobalMagneticFied' : true,
			'Color' : 0x876a49
		},
		'Uranus' : {
			'Name' 	: 'Uranus',
			'Mass' : '86.8',
			'Diameter': '51,118',
			'Density': '1271',
			'Gravity': '8.7',
			'EscapeVelocity': '21.3',
			'RotationPeriod': '-17.2',
			'LengthDay': '17.2',
			'DistancefromSun': '2872.5',
			'Perihelion': '2741.3',
			'Aphelion': '3003.6',
			'OrbitalPeriod': '30,589',
			'OrbitalVelocity': '6.8',
			'OrbitalInclination': '0.8',
			'OrbitalEccentricit' : '0.046',
			'ObliquityToOrbit': '97.8',
			'MeanTemperature': '-195',
			'SurfacePressure': false,
			'NumberMoons': '27',
			'RingSystem': true,
			'GlobalMagneticFied' : true,
			'Color' : 0x697d86
		},
		'Neptune' : {
			'Name' 	: 'Neptune',
			'Mass' : '102',
			'Diameter': '49,528',
			'Density': '1638',
			'Gravity': '11.0',
			'EscapeVelocity': '23.5',
			'RotationPeriod': '16.1',
			'LengthDay': '16.1',
			'DistancefromSun': '4495.1',
			'Perihelion': '4444.5',
			'Aphelion': '4545.7',
			'OrbitalPeriod': '59,800',
			'OrbitalVelocity': '5.4',
			'OrbitalInclination': '1.8',
			'OrbitalEccentricit' : '0.011',
			'ObliquityToOrbit': '28.3',
			'MeanTemperature': '-200',
			'SurfacePressure': false,
			'NumberMoons': '14',
			'RingSystem': true,
			'GlobalMagneticFied' : true,
			'Color' : 0x4a62a9
		},
		'Pluto' : {
			'Name' 	: 'Pluto',
			'Mass' : '0.0146',
			'Diameter': '2370',
			'Density': '2095',
			'Gravity': '0.7',
			'EscapeVelocity': '1.3',
			'RotationPeriod': '-153.3',
			'LengthDay': '153.3',
			'DistancefromSun': '5906.4',
			'Perihelion': '4436.8',
			'Aphelion': '7375.9',
			'OrbitalPeriod': '90,560',
			'OrbitalVelocity': '4.7',
			'OrbitalInclination': '17.2',
			'OrbitalEccentricit' : '0.244',
			'ObliquityToOrbit': '122.5',
			'MeanTemperature': '-225',
			'SurfacePressure': '0',
			'NumberMoons': '5',
			'RingSystem': false,
			'GlobalMagneticFied' : false,
			'Color' : 0x464a57
		}
	}

	if(!planet)
		return this.data;
	else 
		return this.data[planet];

}