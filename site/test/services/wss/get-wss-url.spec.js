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

  it('should prepend wss', async () => {
    const url = getWssUrl();

    expect(url).toEqual(`wss://wss.${window.location.host}`)
  });
});
