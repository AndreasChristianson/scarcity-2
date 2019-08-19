import React from "react";
import styled from 'styled-components'
import { Route, Switch} from "react-router-dom";

import Home from './pages/Floor';
import Floor from './pages/Home';

const Container = styled.div`
    flex-grow: 1;
`;

const Content = () =>
    <Container>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/floor/:floorId" component={Floor} />
            <Route exact path="/login" component={Home} />
            <Route exact path="/play" component={Home} />
            <Route component={Home} />
        </Switch>
    </Container>
;

export default Content;
