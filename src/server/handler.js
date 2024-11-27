const crypto = require('crypto');
const predictClassification = require('../services/inferencesService');
const { storeData, getHistory } = require('../services/storeData');

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

  await storeData(id, data)

  const response = h.response({
    status: 'success',
    message: predictionData > 0 ? 'Model Berhasil Melakukan Prediksi' : 'coba gunakan foto yang sesuai',
    data,
  });
  response.code(201);
  return response;
}

async function getPredict(request, h) {
  const { id } = request.params;
  const data = await getHistory(id);


  if (!data) {
    const response = h.response({
			status: "fail",
			message: "Tidak ditemukan",
		});
		response.code(404);
		return response;
  }

  const response = h.response({
		status: "success",
		data,
	});
	response.code(200);
	return response;
}

module.exports = { predictHandler, getPredict };
