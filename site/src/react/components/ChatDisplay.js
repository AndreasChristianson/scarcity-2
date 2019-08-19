import React from 'react';
import {connect} from 'redux';

const ChatDisplay = ({chat}) =>
    <ul>
        { Array.from(chat, ([key, value]) => (
        <li key={key}>
            value.message
        </li>
        ))}
    </ul>
;

const mapStateToProps = ({scarcity}) => ({
    chat: scarcity.chat
  })

export default connect(
    mapStateToProps,
    null
)(ChatDisplay);
