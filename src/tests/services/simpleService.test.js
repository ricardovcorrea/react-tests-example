import { GrabContent } from '../../services/simpleService';

import * as CONSTANTS from '../../constants';

jest.mock('../../constants');

describe('GrabContent', () => {
  let args;

  beforeEach(() => {
    jest.useFakeTimers();

    args = {};
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be a function', () => {
    expect(typeof GrabContent).toBe('function');
  });

  it('should return a promise', () => {
    const promise = GrabContent(args);

    expect(typeof promise.then).toBe('function');
  });

  it('should return a promise that resolves to correct value', () => {
    args.language = 'mocked language';

    CONSTANTS.MOCK_CONTENT = {
      'mocked language': {
        any: 'mock',
        key: 'value',
      },
    };

    const promise = GrabContent(args);

    jest.advanceTimersByTime(1000);

    return promise.then((value) => {
      expect(value).toStrictEqual({
        any: 'mock',
        key: 'value',
      });
    });
  });
});
