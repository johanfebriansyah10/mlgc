const tf = require('@tensorflow/tfjs-node');
const inputError = require('../exception/inputError')

async function predictClassification(model, image) {
  try {

    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims() 
      .toFloat()

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const predictionData = Math.max(...score) * 100;

    let result = {
      predictionData,
      label: 'Cancer',
      suggestion: 'Segera periksa ke Dokter!'
    };
    
    if(predictionData < 1){
      result.label = 'Non-cancer';
      result.suggestion = 'Penyakit kanker tidak terdeteksi.'
    }

    return result;

  } catch (error) {
    console.error('Error during prediction:', error);
    throw new Error('Terjadi kesalahan dalam melakukan prediksi');
  }
}

module.exports = predictClassification;
