import React from "react";
import ReactDOM from "react-dom";

export default class Header extends React.Component {

	render() {
		return (<div id="header">
					<div id="logo">
					<img id="logo-img" src="/img/dshs.png" />
					</div>
					<div id="title">OpenHouse Project</div>
					<img id="info-img" src="/img/info.png" />
				</div>
		)
	}
}