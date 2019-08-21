import React from "react";
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Floor from './pages/Floor';
import Home from './pages/Home';

const Container = styled.div`
    flex-grow: 1;
`;

const Content = () =>
    <Container>
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/floor/:floorId" component={Floor} />
                <Route exact path="/login" component={Home} />
                <Route exact path="/play" component={Home} />
                <Route component={Home} />
            </Switch>
        </Router>
    </Container>
;

export default Content;
