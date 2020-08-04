module.exports = {
	openapi: '3.0.1',
	info: {
		title: 'Challenge Zoox',
		version: '1.0.0',
		description: 'Document crud API REST and models',
		// license: {
		//   name: "MIT",
		//   url: "https://choosealicense.com/licenses/mit/",
		// },
		//   contact: {
		//     name: "Swagger",
		//     url: "https://swagger.io",
		//     email: "Info@SmartBear.com",
		//   },
	},
	components: {
		securitySchemes: {
			
		},
		schemas: {
            State: require('../doc/model/State.json'),
            City: require('../doc/model/City.json')
		},
	},
	security: [
		{
			bearerAuth: [],
		},
	],
	servers: [
		{
			url: 'http://localhost:8080/',
		}
	],
	paths: {
        '/city': require('../doc/controller/City/BaseRoute.json'),
        '/city/states': require('../doc/controller/City/StatesRoute.json'),
        '/city/:_id': require('../doc/controller/City/ParamRoute.json'),
        '/state': require('../doc/controller/State/BaseRoute.json'),
        '/state/:_id': require('../doc/controller/State/ParamRoute.json'),
	},
};