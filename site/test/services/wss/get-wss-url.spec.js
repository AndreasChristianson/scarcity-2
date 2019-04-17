import Chance from 'chance';

import getWssUrl from '../../../src/services/wss/get-wss-url'

describe('get wss url', () => {
  const chance = new Chance();

  beforeEach(() => {
    delete window.location;
    window.location = {
      host: chance.domain()
    };
  });

  it('should set dev wss', async () => {
    const url = getWssUrl();

    expect(url).toEqual('wss://wss.dev.scarcity.pessimistic-it.com')
  });

  it('should set prod wss', async () => {
    window.location = {
      host: `scarcity.${chance.domain()}`
    };

    const url = getWssUrl();

    expect(url).toEqual('wss://wss.scarcity.pessimistic-it.com')
  });
});
