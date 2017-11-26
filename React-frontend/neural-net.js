const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const request = require('request').defaults({ encoding: null });

const KerasJS = require('keras-js');
// import * as KerasJS from 'keras-js'
const sharp = require('sharp');
// import sharp from 'sharp';

class NeuralNet {
  constructor() {
    this.classes = ['Abra', 'Aerodactyl', 'Alakazam', 'Arbok', 'Arcanine', 'Articuno', 'Beedrill', 'Bellsprout', 'Ivysaur', 'Venusaur'];
    this.modelFileName = 'pokedex_model';
    this.model = new KerasJS.Model({
      filepaths: {
        model: './model/' + this.modelFileName + '.json',
        weights: './model/' + this.modelFileName + '_weights.buf',
        metadata: './model/' + this.modelFileName + '_metadata.json'
      },
      filesystem: true
    });
    console.log('Model loaded');
  }

  predict(url, res) {
    sharp(url)
      .resize(150, 150)
      .background({r: 0, g: 0, b: 0, alpha: 0})
      .embed()
      // .extractChannel('red')
      .raw('test')
      .toBuffer((err, data, info) => {
        // console.log(info);
        const arr = Array.prototype.slice.call(data, 0);
        var data = [];
        for (let i = 0; i < arr.length / 4; i++) {
          Array.prototype.push.apply(data, arr.slice(i * 4, i * 4 + 3));
        }
        // console.log(data.length);
            
        this.model.ready()
          .then(() => {
            const inputData = {
              'input': new Float32Array(data)
            }
            return this.model.predict(inputData)
          })
          .then(outputData => {
            const predictedIndex = outputData['output']
              .reduce((max_index, value, index) => {
                return value > outputData['output'][max_index] ? index : max_index;
              }, 0);

            const predictedLabel = this.classes[predictedIndex];
            console.log(predictedLabel);
            res.send({
              predictedLabel: predictedLabel
            }); 
            // return this.classes[predictedIndex];
          });
      });
      // .toFile('test.png');
  }

}

var url = 'https://cdn.bulbagarden.net/upload/thumb/b/b8/059Arcanine.png/250px-059Arcanine.png';

const neuralNet = new NeuralNet();

const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get('/',function(req,res){
//   res.sendfile("index.html");
// });
app.post('/predict',function(req, res){
  var imageUrl = req.body.imageUrl;
  console.log('Received: ' + imageUrl);
  request.get(imageUrl, (_err, _res, body) => {
    neuralNet.predict(body, res);   
  });  
  // res.send(neuralNet.predict(imageUrl));
});

app.listen(3000,function(){
  console.log("Started on PORT 3000");
});
