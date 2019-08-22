import React from "react";
import {connect} from 'react-redux'

const Home = (props) =>
    <>
        {'Home'}
        <button onClick={() => props.echo('testing!')}>Echo!</button>
    </>
;

const mapDispatchToProps = dispatch => {
    return {
      echo: (message) => dispatch({
          meta:{
              scarcity: true
          },
          action: 'echo',
          echo: message
      }),
    }
  }

export default connect(null, mapDispatchToProps)(Home);
