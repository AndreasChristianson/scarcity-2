import React from "react";
import styled from 'styled-components'

const Container = styled.div`
`;

const Footer = () =>
    <Container>
        {`Build: ${__COMMIT_HASH__}`}
    </Container>
;

export default Footer;