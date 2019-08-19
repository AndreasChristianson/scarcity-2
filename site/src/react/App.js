import React from "react";
import styled from 'styled-components'

import Header from './Header';
import Content from './Content';
import Footer from './Footer';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;

const App = () =>
    <Container>
        <Header />
        <Content />
        <Footer />
    </Container>
;

export default App;