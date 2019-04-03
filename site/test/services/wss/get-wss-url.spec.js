import Chance from 'chance';

import {getWssUrl} from '../../../src/services/wss/get-wss-url'

describe('get wss url', () => {
  const chance = new Chance();
  let wssUrl;

  beforeEach(() => {
    wssUrl = chance.url();
    window.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(wssUrl)
    });
    jest.resetModules();
  });

  it('should call fetch', async () => {
    await getWssUrl();

    expect(window.fetch).toHaveBeenCalledWith('/wss-url')
  });
});
