const crypto = require('crypto');
const predictClassification = require('../services/inferencesService');

async function predictHandler(request, h) {
  try {
    const { image } = request.payload;

    const model = request.server.app.model;
    const predictImage = image._data;
    const { label, suggestion } = await predictClassification(model, predictImage);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();


    const data = {
      id,
      result: label,
      suggestion,
      createdAt,
    };


    const response = h.response({
      status: 'success',
      message: 'Model berhasil melakukan prediksi',
      data,
    });
    response.code(201);
    return response;
    
  } catch (error) {

    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    }).code(400);
  }
}

module.exports = predictHandler;
