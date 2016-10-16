//This source is from Embedly
//
import React, { Component } from 'react';
import request from 'superagent';
import './Embedly.css'

class Embedly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provider_url: '',
      description: '',
      title: '',
      thumbnail_width: 1,
      url: '',
      thumbnailUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=',
      version: '',
      provider_name: '',
      type: '',
      thumbnail_height: 1
    };
    this.apiUrl = 'https://api.embedly.com/1/oembed';
    this.requestEmbedly = this.requestEmbedly.bind(this);
  }
  requestEmbedly(nextProps){
    let params = {}
    if(nextProps){
      params.url = nextProps.url;
      params.key = nextProps.apiKey;
    }else{
      params.url = this.props.url;
      params.key = this.props.apiKey;
    }
    request.get(this.apiUrl)
           .query(params)
           .end((err, res) => {
             if(!err)
              this.setState(res.body);
           });
  }
  componentWillMount() {
    this.requestEmbedly();
  }
  //This is where I update.
  componentWillUpdate(nextProps) {
    if(this.props.url!==nextProps.url){
      // if(nextProps.url!=="http://www.example.com"){
        this.requestEmbedly(nextProps);
      // }
    }
  }
  render() {
    let ocl = calculateClass({
      thumbnail_width : this.state.thumbnail_width,
      windows_innerWidth : window.innerWidth-63,
      description :this.state.description,
      url : this.state.url
    });
    // console.log(ocl, this.state.url);
    if(!ocl.hasImage) return (<div/>);
    else return(
      <a className="embedly" href={this.state.url}>
        <div className={ocl.classImageName} >
          <img src={this.state.thumbnail_url} alt={this.state.title} className="embedly__img" style={{width:ocl.fixWidth,height:ocl.fixHeight}}/>
        </div>
        <div>
        <div className={ocl.classTextName}>
          <p className="embedly__title">{this.state.title}</p>
          <p className="embedly__desc">{ocl.desc}</p>
          <p className="embedly__provider">{this.state.provider_url}</p>
        </div>
        </div>
      </a>
    )
  }
}
/*
* input = {
*   thumbnail_width: thumbnail_width
*   windows_innerWidth : windows size
*   description : description
*   url : url
* }
*/
function calculateClass(options){
  // oEmbed 값에 따른   Card CSS 처리.
  let tw = options.thumbnail_width;
  let iw = options.windows_innerWidth;
  let desc = options.description;
  let hasImage = (!options.url||options.url==="http://www.example.com")?false:true;
  // console.log(hasImage, options.url);
  /*
  * default width, height
  */
  let fixHeight = 300;
  let fixWidth  = 300;
  /*
  * default Class Name
  */
  let classTextName = "embedly__text";
  let classImageName = "embedly__image";
  /*
  * thumbnail size가 600 보다 작을 경우 153x153픽셀 카드
  *                         클 경우 윈도우 넓이에 맞춘 카드
  * url이 없을 경우 이미지가 없는 카드
  */
  if(tw<600){
    fixHeight = 153;
    fixWidth = 153;
    classTextName = "embedly__text_small";
    classImageName = "embedly__image_small";
    let suffix="";
    if(desc.length>85) suffix="..(중략)"
    desc = desc.substring(0,85)+suffix;
  }else{
    fixWidth = iw;
    let imgRatio = tw/iw;
    fixHeight = tw/imgRatio;
  }
  if(!hasImage){
    classTextName = "embedly__text_noneImage";
    classImageName = "embedly__image_noneImage";
  }
  return {
    fixWidth : fixWidth,
    fixHeight : fixHeight,
    hasImage : hasImage,
    classTextName : classTextName,
    classImageName : classImageName,
    desc :desc
  }
}
export default Embedly;
