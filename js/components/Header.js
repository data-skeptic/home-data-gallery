import React from "react";
import ReactDOM from "react-dom";

export default class Header extends React.Component {

  render() {
    return (<div id="header">
		        <div id="logo">
		        	<img id="logo-img" src="http://dataskeptic.com/home-sales/dshs.png" />
		        </div>
		        <div id="title">OpenHouse Project</div>
		      </div>)
  }
}
