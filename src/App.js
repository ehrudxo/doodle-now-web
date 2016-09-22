import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';
import config from './config';
import Embedly from 'react-embedly';

firebase.initializeApp(config);
//https://doodle-now.firebaseio.com/doodles/.json
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doodles: [],
    };
  }
  componentWillMount() {
    console.log(firebase.database());
    this.firebaseRef = firebase.database().ref("doodles");
    var _this =this;
    this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
      var items = [];
      console.log(dataSnapshot);
      dataSnapshot.forEach(function(childSnapshot) {
        console.log(childSnapshot.val());
        var item = childSnapshot.val();
        item['.key'] = childSnapshot.key;
        items.push(item);
      });
      console.log(items);
      _this.setState({
        doodles: items
      });
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.firebaseRef.push({
      text: this.state.text
    });
    this.setState({text: ""});
  }
  componentWillUnmount() {
    this.firebaseRef.off();
  }
  onChange(e) {
    var stateObj = {};
    stateObj[e.target.name]=e.target.value;
    this.setState(stateObj);
   }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Doodle Now</h2>
        </div>
        <DoodleList doodles={ this.state.doodles }/>
        <form onSubmit={ this.handleSubmit }>
          title : <input name="title" onChange={ this.onChange } value={ this.state.title } /><br/>
          content : <input name="content" onChange={ this.onChange } value={ this.state.content } /><br/>
          url : <input name="url" onChange={ this.onChange } value={ this.state.url } /><br/>
          <button>{ 'Add #' + (this.state.doodles.length + 1) }</button>
        </form>
      </div>
    );
  }
}
var DoodleList = React.createClass({
  render: function() {
    var _this = this;
    var createItem = function(item, index) {
      return (
        <li key={ index }>
          { item.title }|
          { item.content }
          <Embedly url={ item.url } apiKey={config.embedlyKey} />
        </li>
      );
    };
    return <ul>{ this.props.doodles.map(createItem) }</ul>;
  }
});

export default App;
