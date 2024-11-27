const crypto = require('crypto');
const predictClassification = require('../services/inferencesService');

async function predictHandler(request, h) {

  const { image } = request.payload;
  const { model } = request.server.app;

  const { label, suggestion, predictionData } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: label,
    suggestion,
    predictionData,
    createdAt,
  };

  const response = h.response({
    status: 'success',
    message: predictionData > 0 ? 'Model Berhasil Melakukan Prediksi' : 'coba gunakan foto yang sesuai',
    data,
  });
  response.code(201);
  return response;
}

module.exports = predictHandler;
