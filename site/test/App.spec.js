import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import Chance from 'chance';

import App from '../src/App';

describe('App', ()=>{
    const chance = new Chance();
    let result;

    const render = () => {
        const renderer = new ShallowRenderer();
        renderer.render(<App />);
        result = renderer.getRenderOutput();
    };
    
    beforeEach(()=>{
        global.__COMMIT_HASH__ = chance.guid();
        render();
    });

    it('should be a div', ()=>{
        expect(result.type).toBe('div');
    });
});