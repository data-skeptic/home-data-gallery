import React from "react"
import ReactDOM from "react-dom"
import rd3 from 'react-d3'

export default class ResponsiveComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {parentWidth: 0};
    }

    handleResize(e) {
        let elem = ReactDOM.findDOMNode(this);
        let width = elem.parentNode.offsetWidth;
        if (this.state.parentWidth != width) {
            this.setState({
                parentWidth: width
            });
        }
    }

    componentDidMount() {
        window.addEventListener('resize', ::this.handleResize);
        setTimeout(::this.handleResize, 10);
    }

    componentWillReceiveProps() {
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', ::this.handleResize);
    }

    render() {}
}
