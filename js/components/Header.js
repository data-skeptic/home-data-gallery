import React from "react";
import ReactDOM from "react-dom";

export default class Header extends React.Component {

	render() {
		return (
<div id="header">
	<nav class="navbar navbar-dark bg-inverse">
		<a class="navbar-brand" href="#">
			<img src="/img/dshs.png" width="30" height="30" alt="OpenHouse Project Logo" />
			OpenHouse Project (Alpha Release)
		</a>
	</nav>
</div>
		)
	}
}