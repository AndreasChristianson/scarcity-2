import React from 'react';
import { connect } from 'react-redux'

class WebSocket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            websocket: null
        };
    }

    componentDidMount() {
        const websocket = new WebSocket(this.props.url);

        this.setState({websocket});
    }

    componentWillUnmount() {
        this.state.websocket.close();
    }

    render() {
        return null;
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WebSocket);