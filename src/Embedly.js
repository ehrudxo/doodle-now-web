//This source is from Embedly
//
import React, { Component } from 'react';
import request from 'superagent';

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
    let aStyle = {
      color: "#222",
      textDecoration: "none",
      position: "relative",
      border: "solid 1px #E1E8ED",
      display: "block",
      borderRadius: "5px",
      overflow: "hidden"
    };
    let imageStyle = {
      width: "80px",
      height: "80px",
      overflow: "hidden",
      position: "absolute",
      left: 0,
      top: 0
    };
    let imgStyle = {
      height: "100%",
      width: "auto",
      transform: "translateX(-50%)",
      position: "relative",
      left: "50%"
    };
    let textStyle = {
      marginLeft: "85px",
      minHeight: "80px",
      padding: "5px",
      boxSizing: "border-box"
    };
    let titleStyle = {
      margin: 0,
      fontSize: "15px",
      fontWeight: "bold"
    };
    let descStyle = {
      margin: "5px 0 0",
      fontSize: "11px"
    };
    let providerStyle = {
      margin: "5px 0 0",
      fontSize: "11px"
    };
    return(
      <a className="embedly" href={this.state.url} style={aStyle}>
        <div className="embedly__image" style={imageStyle}>
          <img src={this.state.thumbnail_url} alt={this.state.title} style={imgStyle}/>
        </div>
        <div className="embedly__text" style={textStyle}>
          <p className="embedly__title" style={titleStyle}>{this.state.title}</p>
          <p className="embedly__desc" style={descStyle}>{this.state.description}</p>
          <p className="embedly__provider" style={providerStyle}>{this.state.provider_url}</p>
        </div>
      </a>
    )
  }
}
export default Embedly;
