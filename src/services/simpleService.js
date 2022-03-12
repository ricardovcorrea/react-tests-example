import * as CONSTANTS from '../constants';

export const GrabContent = (args) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(CONSTANTS.MOCK_CONTENT[args.language]);
    }, 1000);
  });
};
