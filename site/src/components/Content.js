import React from "react";
import styled from 'styled-components'
import { Route, Switch} from "react-router-dom";

import Home from './Home';

const Container = styled.div`
    flex-grow: 1;
`;

const Content = () =>
    <Container>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/observe" component={Home} />
            <Route exact path="/login" component={Home} />
            <Route exact path="/play" component={Home} />
            <Route component={Home} />
        </Switch>
    </Container>
;

export default Content;