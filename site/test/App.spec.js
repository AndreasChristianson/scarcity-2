import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import Chance from 'chance';

import App from '../src/App';

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

    it('should be a div', ()=>{
        expect(result.type).toBe('div');
    });
});