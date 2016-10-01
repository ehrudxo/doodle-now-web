import React, { Component } from 'react';
import logo from './img/main_logo.png';
import newPng from './img/new.png';
import './App.css';
import firebase from 'firebase';
import config from './config';
import moment from 'moment';
import trashCan from './img/trash-can.png'
import Embedly from './Embedly'

firebase.initializeApp(config);
//https://doodle-now.firebaseio.com/doodles/.json
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doodles: [],
    };
    this.firebaseRef = firebase.database().ref("doodles");
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }
  componentWillMount() {
    this.firebaseRef.orderByKey().limitToLast(25).on('value', (dataSnapshot)=> {
      var items = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item['.key'] = childSnapshot.key;
        items.push(item);
      });
      if(items && items.length>0){
        this.setState({
          doodles: items.reverse()
        });
      }
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    if(this.state.title && this.state.title!==""&&
       this.state.url && this.state.url!==""&&
      this.state.content && this.state.content!==""){
      var val = {
        title: this.state.title,
        url :this.state.url,
        content : this.state.content,
        createdAt : new Date().getTime()
      }

      this.firebaseRef.push(val);
      this.setState({
        title: undefined,
        url : undefined,
        content : undefined,
        createdAt :undefined
      });
    }else{
      alert("값을 확인해 주세요")
    }
    document.getElementById("nForm").reset();
    // location.reload();
  }
  componentWillUnmount() {
    this.firebaseRef.off();
  }
  onChange(e) {
    // console.log(e.target.name,e.target.value);
    var stateObj = {};
    stateObj[e.target.name]=e.target.value;
    this.setState(stateObj);
  }
  removeItem(key) {
    var firebaseRef = firebase.database().ref('doodles');;
    firebaseRef.child(key).remove();
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="logo"><img src={logo} height="150px" alt="logo" /></div>
          <h2>Doodle Now</h2>
        </div>
        <p/>
        <form id="nForm" onSubmit={()=>{return false;}}>
        <div className="row_edit">
          <h3 className="row_title">title</h3>
          <input className="row_input" name="title" type="text"
                  onChange={ this.onChange }/>
        </div>
        <div className="row_edit">
          <h3 className="row_title">url</h3>
          <input className="row_input" name="url" type="text"
                  onChange={ this.onChange }/>
        </div>
        <div className="row_edit">
          <h3 className="row_title">content</h3>
          <textarea className="row_input" name="content"
                  onChange={ this.onChange }/>
        </div>
        <button onClick={ this.handleSubmit }>doodle!</button>
        </form>
        <DoodleList doodles={ this.state.doodles } removeItem={ this.removeItem }/>
      </div>
    );
  }
}
class DoodleList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      doodles: [],
    };
    this.getimage = this.getimage.bind(this);
    this.createItem = this.createItem.bind(this);
  }
  getimage(createdTime){
    var diffTime = Math.floor(moment().diff(moment(createdTime))/86400000*24);
    if(diffTime<60){
      return(<img src={newPng} alt="new" height="20px"/>)
    }else{
      return null;
    }
  }
  createItem(item, index) {
    if(item&&item.url&&(item.url!=="")&&item.title)
      return (
        <li key={ index } className="itemList">
          <div>{this.getimage(item.createdAt)}
          <h3>{ item.title }({moment(item.createdAt).fromNow() })</h3>
          <span onClick={ this.props.removeItem.bind(null, item['.key']) }
                  style={{ color: 'red', marginRight: '10px', cursor: 'pointer',float:'right' }}>
              <img src={trashCan} width="15px"  alt="trash"/>
          </span></div>
          <pre className="elegant_grey">{ item.content }</pre>
          <Embedly url={ item.url } apiKey={config.embedlyKey}/>
        </li>
      );
    else return null;
  }
  render() {
    return <ul>{ this.props.doodles.map(this.createItem) }</ul>;
  }
}
export default App;
