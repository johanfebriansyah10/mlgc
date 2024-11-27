require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/route');
const loadModel = require('../services/loadModel');
const InputError = require('../exception/inputError');

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      },
    },
  })

  const model = await loadModel();
  server.app.model = model;
  
  server.route(routes);
  
  server.ext('onPreResponse', function (request, h) {
      const response = request.response;

      if(response.isBoom && response.output.statusCode === 413){
        return h.response ({
          status: 'fail',
          message: 'Payload content length greater than maximum allowed: 1000000'
        }).code(413)
      }

      if(response.isBoom && response.output.statusCode === 400){
        return h.response ({
          status: 'fail',
          message: 'Terjadi kesalahan dalam melakukan prediksi'
        }).code(400)
      }

      if(response instanceof InputError){
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if(response.isBoom){
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        })
        newResponse.code(response.output.statusCode)
        return newResponse;
      }

      return h.continue;
  })

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();