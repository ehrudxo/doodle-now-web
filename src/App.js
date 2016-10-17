import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import config from './config';
import moment from 'moment';
import Embedly from './Embedly';
import logo from './img/main_logo.png';
import newPng from './img/new.png';
import trashcan from './img/trash-can.png';
import heart from './img/heart.png';

console.log(process.env);
firebase.initializeApp(config);
//https://doodle-now.firebaseio.com/doodles/.json
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doodles: [],
      textEmbedlyUrl:undefined
    };
    this.firebaseRef = firebase.database().ref("doodles");
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.editorChange  = this.editorChange.bind(this);
    this.detectURL = this.detectURL.bind(this);
    this.likeArticle = this.likeArticle.bind(this);
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
  //URL체크
  onPaste(event){
    event.clipboardData.items[0].getAsString(text=>{
      if(this.detectURL(text)){
        this.setState({textEmbedlyUrl:text});
      }
    })
  }
  //에디터 만들기 체크
  editorChange(event){
    let checkText = this.detectURL(event.currentTarget.textContent);
    if(!this.state.textEmbedlyUrl&&
        (event.keyCode===32||event.keyCode===13)&&
        checkText){
      this.setState({textEmbedlyUrl:checkText,content:this.state.content});
    }else{
      this.setState({content:event.currentTarget.textContent});
    }
  }
  detectURL(text){
    return (text.match(/(https?:\/\/[^\s]+)/g)||text.match(/(www.[^\s]+)/g));
  }
  handleSubmit(e) {
    e.preventDefault();
    if(this.state.content && this.state.content!==""){
      let content = this.state.content;
      let newLineAt = content.charAt("\n");
      let title,textEmbedlyUrl;
      if(newLineAt>0){
        title = content;
        if(content.length<10){
          title = content;
        }else{
          title = content.substring(0,newLineAt);
        }
      }else{
        title = content;
      }
      if(!this.state.textEmbedlyUrl){
        textEmbedlyUrl ="http://www.example.com";
      }else{
        textEmbedlyUrl =this.state.textEmbedlyUrl;
      }
      var val = {
        title: title,
        url :textEmbedlyUrl,
        content : content,
        createdAt : new Date().getTime()
      }
      this.firebaseRef.push(val);
      this.setState({
        textEmbedlyUrl : undefined,
        content : ""
      });
    }else{
      alert("값을 확인해 주세요")
    }
    // document.getElementById("nForm").reset();
    // location.reload();
  }
  componentWillUnmount() {
    this.firebaseRef.off();
  }
  removeItem(key) {
    var firebaseRef = firebase.database().ref('doodles');;
    firebaseRef.child(key).remove();
  }
  likeArticle(key){
    console.log("likedIt :"+ key);
    alert("준비중입니다. 같이 해보실까요? keen에게 이야기하기!");
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="logo"><img src={logo} height="60px" alt="logo" /></div>
          <h3>Doodle Now</h3>
        </div>
        <div className="wrapEditor">
          <div className="textEditor">
            <div className="innerEdit"
              contentEditable="true"
              onPaste={this.onPaste}
              onKeyUp={this.editorChange} placeholder="글쓰기...">{this.state.content}</div>
            <GetSingleEmbedly embedlyUrl={this.state.textEmbedlyUrl}/>
          </div>
          <div className="actionBar">
            <button className="upload" onClick={this.handleSubmit}><span>두들 나우!</span></button>
          </div>
        </div>
        <DoodleList doodles={ this.state.doodles } removeItem={ this.removeItem } likeArticle = { this.likeArticle }/>
      </div>
    );
  }
}
class GetSingleEmbedly extends Component{
  render(){
    if(this.props.embedlyUrl){
      return(<Embedly url={ this.props.embedlyUrl } apiKey={config.embedlyKey}/>);
    }else{
      return(<div/>);
    }
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
    let isOmit = item.url==="http://www.example.com"?true:false;
    function GetEmbedly(url, key){
      if(!isOmit)
       return (<Embedly url={ url } apiKey={key}/>);
      else return(<div/>);
    }
    if(item&&item.url&&(item.url!=="")&&item.title)
      return (
        <li key={ index } className="itemList">
          <div className="cmMargin">{this.getimage(item.createdAt)}
          <h3>{ item.title }</h3>
          </div>
          <div className="cmMargin">
            <span className="greyTxt"> - {moment(item.createdAt).fromNow() }</span>
            <span onClick={ this.props.removeItem.bind(null, item['.key']) }
                  style={{ color: 'red', marginRight: '15px', cursor: 'pointer',float:'right' }}>
                  <img src={trashcan} height="20px"  alt="trash"/>
            </span>
            <span onClick={ this.props.likeArticle.bind(null, item['.key']) }
                  style={{ color: 'red', marginRight: '15px', cursor: 'pointer',float:'right',fontSize:'23px' }}>
                  ♡
            </span>
          </div>
          <pre className="elegant_grey cmMargin">{ item.content }</pre>
          {GetEmbedly(item.url, config.embedlyKey)}
        </li>
      );
    else return null;
  }
  render() {
    return <ul>{ this.props.doodles.map(this.createItem) }</ul>;
  }
}
export default App;
