const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {
  try {

    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims() 
      .toFloat();

    const prediction = model.predict(tensor);


    const predictionData = await prediction.data();
    
    const classes = ['Cancer', 'Non-cancer'];
    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];

    let suggestion;
    if (label === 'Cancer') {
      suggestion = 'Segera periksa ke dokter!';
    } else if (label === 'Non-cancer') {
      suggestion = 'Penyakit kanker tidak terdeteksi.';
    }

    return { label, suggestion, predictionData };


  } catch (error) {
    console.error('Error during prediction:', error);
    throw new Error('Terjadi kesalahan dalam melakukan prediksi');
  }
}

module.exports = predictClassification;
