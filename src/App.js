import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';
import config from './config';

firebase.initializeApp(config);
//https://doodle-now.firebaseio.com/doodles/.json
class App extends Component {
  getInitialState(){
    return {
      doodles: [],
      doodle: {}
    };
  }
  componentWillMount() {
    this.firebaseRef = firebase.database().ref("doodles");
    this.firebaseRef.on("child_added", function(dataSnapshot) {
      this.items.push(dataSnapshot.val());
      this.setState({
        items: this.items
      });
    }.bind(this));
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
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <DoodleList items={ this.state.items } removeItem={ this.removeItem } />
        <form onSubmit={ this.handleSubmit }>
          title : <input name="title" onChange={ this.onChange } value={ this.state.title } /><br/>
          content : <input name="content" onChange={ this.onChange } value={ this.state.content } /><br/>
          url : <input name="url" onChange={ this.onChange } value={ this.state.url } /><br/>
          <button>{ 'Add #' + (this.state.items.length + 1) }</button>
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
          { item.text }
          <span onClick={ _this.props.removeItem.bind(null, item['.key']) }
                style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>
            X
          </span>
        </li>
      );
    };
    return <ul>{ this.props.items.map(createItem) }</ul>;
  }
});

export default App;
