const tf = require('@tensorflow/tfjs-node')

async function predictSimilarity (img0, img1, threshold) {
  const model = await tf.loadGraphModel('file://src/tfjs-20230919T191458Z-001/tfjs/model.json')

  let result = model.predict([img0, img1])
  result = await result.data()

  const statusObj = {}
  if (result[0] > threshold) {
    statusObj.similarity = 'Not Similar'
  } else {
    statusObj.similarity = 'Similar'
  }
  statusObj.threshold = threshold
  statusObj.distance_score = parseFloat(result[0].toFixed(5))
  return statusObj
}

async function predictionHandler (req, h) {
  const { threshold = 0.5 } = req.query
  console.log(threshold)
  const files = req.payload

  const buffer0 = new Uint8Array(files.file0)
  const buffer1 = new Uint8Array(files.file1)

  let tensor0 = tf.node.decodeImage(buffer0, 3, 'int32', true).resizeBilinear([120, 120])
  let tensor1 = tf.node.decodeImage(buffer1, 3, 'int32', true).resizeBilinear([120, 120])

  tensor0 = tf.div(tensor0, 255.0)
  tensor1 = tf.div(tensor1, 255.0)

  tensor0 = tf.expandDims(tensor0, 0)
  tensor1 = tf.expandDims(tensor1, 0)

  const predictionStatus = await predictSimilarity(tensor0, tensor1, parseFloat(threshold))

  return predictionStatus
}

module.exports = {
  predict: {
    Predict: predictionHandler
  }
}
