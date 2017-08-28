const KerasJS = require('keras-js');

const fileName = 'pokedex_model';
const testFileName = 'alakazam2.jpg'

const classes = ['Abra', 'Aerodactyl', 'Alakazam', 'Arbok', 'Arcanine', 'Articuno', 'Beedrill', 'Bellsprout', 'Ivysaur', 'Venusaur'];
const model = new KerasJS.Model({
  filepaths: {
    model: fileName + '.json',
    weights: fileName + '_weights.buf',
    metadata: fileName + '_metadata.json'
  },
  filesystem: true
});

const sharp = require('sharp');

sharp('data/test/' + testFileName)
  .resize(150, 150)
  .background({r: 0, g: 0, b: 0, alpha: 0})
  .embed()
  // .extractChannel('red')
  .raw('test')
  .toBuffer((err, data, info) => {
    console.log(info);
    const arr = Array.prototype.slice.call(data, 0);
    var data = [];
    for (let i = 0; i < arr.length / 4; i++) {
      Array.prototype.push.apply(data, arr.slice(i * 4, i * 4 + 3));
    }
    console.log(data.length);
        
    model.ready()
      .then(() => {
        const inputData = {
          'input': new Float32Array(data)
        }
        return model.predict(inputData)
      })
      .then(outputData => {
        const predictedIndex = outputData['output']
          .reduce((max_index, value, index) => {
            return value > outputData['output'][max_index] ? index : max_index;
          }, 0);
        console.log(classes[predictedIndex]);
      });
  });
  // .toFile('test.png');



