import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';

import App from '../src/App';

describe('App', ()=>{
    let result;

    const render = () => {
        const renderer = new ShallowRenderer();
        renderer.render(<App />);
        result = renderer.getRenderOutput();
    };
    
    beforeEach(()=>{
        render();
    });

    it('should be a div', ()=>{
        expect(result.type).toBe('div');
    });
});