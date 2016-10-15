//This source is from Embedly
//
import React, { Component } from 'react';
import request from 'superagent';
import embedlycss from './Embedly.css'

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
      this.requestEmbedly(nextProps);
    }
  }
  render() {
    // oEmbed 값에 따른 이미지 처리. 캬캬캬.
    let tw = this.state.thumbnail_width;
    let iw = window.innerWidth-63;
    let fixHeight = 300;
    let fixWidth  = 300;
    let isMini = false;
    let classTextName = "embedly__text";
    let classImageName = "embedly__image";
    let desc = this.state.description;
    if(tw<600){
      isMini=true;
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
      fixHeight = this.state.thumbnail_width/imgRatio;
    }
    return(
      <a className="embedly" href={this.state.url}>
        <div className={classImageName} >
          <img src={this.state.thumbnail_url} alt={this.state.title} className="embedly__img" style={{width:fixWidth,height:fixHeight}}/>
        </div>
        <div>
        <div className={classTextName}>
          <p className="embedly__title">{this.state.title}</p>
          <p className="embedly__desc">{desc}</p>
          <p className="embedly__provider">{this.state.provider_url}</p>
        </div>
        </div>
      </a>
    )
  }
}
export default Embedly;
