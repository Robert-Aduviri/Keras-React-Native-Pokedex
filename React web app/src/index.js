import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
// import NeuralNet from './neural-net';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      imageUrl: 'https://cdn.bulbagarden.net/upload/thumb/b/b8/059Arcanine.png/250px-059Arcanine.png',
      buttonText: '¿Quién es ese Pokémon?'
    };
    // this.neuralNet = new NeuralNet();
  }
  
  loadImage(url) {
    this.setState({imageUrl: url});
    this.setState({buttonText: '¿Quién es ese Pokémon?'});
  }

  predictImage(url) {
    this.setState({buttonText: '...'});
    return fetch('http://localhost:3000/predict', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl: url
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        // this.setState({imageUrl: responseJson});
        this.setState({buttonText: `¡Es ${responseJson.predictedLabel}!`});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <div>
        <div className="input-container">
          <label>Ingresa la imagen del Pokémon: </label>
          <input 
            onChange={event => this.state.imageUrl = this.loadImage(event.target.value)} 
            value={this.state.imageUrl}/>
        </div>
        <div className="image-container">
          <img src={this.state.imageUrl} />
        </div>
        <div className="button-container">
          <a className="waves-effect deep-orange accent-3 btn-large" 
             onClick={() => this.predictImage(this.state.imageUrl)}>{this.state.buttonText}</a>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('.container'));