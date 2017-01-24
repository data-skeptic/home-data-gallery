import React from "react";
import ReactDOM from "react-dom";

export default class Header extends React.Component {

	render() {
		return (
<div className="header">
	<nav className="navbar navbar-dark bg-inverse">
		<a className="navbar-brand" href="#">
			<img src="/img/dshs.png" width="30" height="30" alt="OpenHouse Project Logo" />
			OpenHouse Project (Alpha Release)
		</a>
		<span class="field-tip">
		    About
		    <span class="tip-content">OpenHouse accepts user submissions of data.  We do our best to validate, but no guarentee about the accuracy of the data is made.  If you find a correction, please let us know!</span>
		</span>    
	</nav>
</div>
		)
	}
}