import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import Chance from 'chance';

import App from '../src/components/App';
import Footer from '../src/components/Footer';
import Content from '../src/components/Content';
import Header from '../src/components/Header';

jest.mock('../src/services/wss/get-wss-url');

describe('App', ()=>{
    const chance = new Chance();
    let result;

    const render = async () => {
        const renderer = new ShallowRenderer();
        renderer.render(<App />);
        result = await renderer.getRenderOutput();
    };
    
    beforeEach(async ()=>{
        global.__COMMIT_HASH__ = chance.guid();
        await render();
    });

    it('should contain the layout', ()=>{
        expect(result.props.children[0].type).toBe(Header);
        expect(result.props.children[1].type).toBe(Content);
        expect(result.props.children[2].type).toBe(Footer);
    });
});