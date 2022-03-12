import React, { useCallback, useEffect, useState } from 'react';

import { render } from '@testing-library/react';

import App from '../app';

import * as CONSTANTS from '../constants';

import { SimpleHeader, SimpleButton } from '../components';

import { GrabContent } from '../services';

jest.mock('../constants');

jest.mock('../components');

jest.mock('../services');

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
  useCallback: jest.fn(),
}));

describe('App', () => {
  let sut;

  let state;
  let setState;

  let mockMergeState;
  let mockHandleChangeLanguage;
  let mockHandleChangeCounter;

  beforeEach(() => {
    state = {};
    setState = jest.fn();

    mockMergeState = jest.fn();
    mockHandleChangeLanguage = jest.fn();
    mockHandleChangeCounter = jest.fn();

    useState.mockReturnValue([state, setState]);

    useCallback
      .mockReturnValueOnce(mockMergeState)
      .mockReturnValueOnce(mockHandleChangeLanguage)
      .mockReturnValueOnce(mockHandleChangeCounter);

    SimpleHeader.mockReturnValue(null);
    SimpleButton.mockReturnValue(null);

    GrabContent.mockResolvedValue();
  });

  afterEach(() => {
    if (typeof sut?.unmount === 'function') {
      sut.unmount();
    }
  });

  it('should call useState hook 1 time', () => {
    render(<App />);

    expect(useState).toHaveBeenCalledTimes(1);
  });

  it('should call useState hook with correct arguments', () => {
    CONSTANTS.LANGUAGE_EN = 'mock en language';

    render(<App />);

    expect(useState).toHaveBeenCalledWith({
      language: 'mock en language',
      content: undefined,
      counter: 0,
    });
  });

  it('should call useCallback hook 3 times', () => {
    render(<App />);

    expect(useCallback).toHaveBeenCalledTimes(3);
  });

  it('should call useCallback hook for the 1st time with correct arguments', () => {
    render(<App />);

    expect(useCallback).toHaveBeenNthCalledWith(1, expect.any(Function), []);
  });

  it('should call useCallback hook for the 2nd time with correct arguments', () => {
    state.language = 'mock language';

    render(<App />);

    expect(useCallback).toHaveBeenNthCalledWith(2, expect.any(Function), [
      'mock language',
      mockMergeState,
    ]);
  });

  it('should call useCallback hook for the 3rd time with correct arguments', () => {
    state.counter = 537;

    render(<App />);

    expect(useCallback).toHaveBeenNthCalledWith(3, expect.any(Function), [
      537,
      mockMergeState,
    ]);
  });

  it('should call useEffect hook 1 time', () => {
    render(<App />);

    expect(useEffect).toHaveBeenCalledTimes(1);
  });

  it('should call useEffect hook with correct arguments', () => {
    state.language = 'other mock language';

    render(<App />);

    expect(useEffect).toHaveBeenCalledWith(expect.any(Function), [
      'other mock language',
    ]);
  });

  it('should render correct HTML', () => {
    const { container } = render(<App />);

    expect(container).toMatchSnapshot();
  });

  describe('if mergeState method is called', () => {
    it('should call setState 1 time', () => {
      render(<App />);

      useCallback.mock.calls[0][0]();

      expect(setState).toHaveBeenCalledTimes(1);
    });

    it('should call setState with correct arguments', () => {
      render(<App />);

      useCallback.mock.calls[0][0]();

      expect(setState).toHaveBeenCalledWith(expect.any(Function));
    });

    describe('if the function received by setState is called', () => {
      it('should return the correct value', () => {
        render(<App />);

        useCallback.mock.calls[0][0]({
          new: 'keys',
          keys: 'states',
        });

        const value = setState.mock.calls[0][0]({
          old: 'state',
          keys: 'mock',
        });

        expect(value).toStrictEqual({
          new: 'keys',
          old: 'state',
          keys: 'states',
        });
      });
    });
  });

  describe('if handleChangeLanguage method is called', () => {
    it('should call mergeState method 1 time', () => {
      render(<App />);

      useCallback.mock.calls[1][0]();

      expect(mockMergeState).toHaveBeenCalledTimes(1);
    });

    it('should call mergeState method with correct arguments', () => {
      CONSTANTS.LANGUAGE_EN = 'mock en language';
      CONSTANTS.LANGUAGE_PT = 'mock pt language';

      state.language = 'mock en language';

      render(<App />);

      useCallback.mock.calls[1][0]();

      expect(mockMergeState).toHaveBeenCalledWith({
        content: undefined,
        language: 'mock pt language',
      });
    });

    describe('if the selected language is PT', () => {
      it('should call mergeState method with correct arguments', () => {
        CONSTANTS.LANGUAGE_EN = 'mock en language';
        CONSTANTS.LANGUAGE_PT = 'mock pt language';

        state.language = 'mock pt language';

        render(<App />);

        useCallback.mock.calls[1][0]();

        expect(mockMergeState).toHaveBeenCalledWith({
          content: undefined,
          language: 'mock en language',
        });
      });
    });
  });

  describe('if handleChangeCounter method is called', () => {
    it('should not call mergeState method 1 time', () => {
      render(<App />);

      useCallback.mock.calls[2][0]({});

      expect(mockMergeState).not.toHaveBeenCalled();
    });

    describe('if received an argument type with value to increase', () => {
      it('should call mergeState method 1 time', () => {
        CONSTANTS.COUNTER_UPDATE_TYPE_INCREASE = 'increase';

        render(<App />);

        useCallback.mock.calls[2][0]({
          type: 'increase',
        });

        expect(mockMergeState).toHaveBeenCalledTimes(1);
      });

      it('should call mergeState method with correct arguments', () => {
        CONSTANTS.COUNTER_UPDATE_TYPE_INCREASE = 'increase';
        state.counter = 4;

        render(<App />);

        useCallback.mock.calls[2][0]({
          type: 'increase',
        });

        expect(mockMergeState).toHaveBeenCalledWith({
          counter: 5,
        });
      });

      describe('if received an argument quantity', () => {
        it('should call mergeState method with correct arguments', () => {
          CONSTANTS.COUNTER_UPDATE_TYPE_INCREASE = 'increase';
          state.counter = 15;

          render(<App />);

          useCallback.mock.calls[2][0]({
            type: 'increase',
            quantity: 10,
          });

          expect(mockMergeState).toHaveBeenCalledWith({
            counter: 25,
          });
        });
      });
    });

    describe('if received an argument type with value to decrease', () => {
      it('should call mergeState method 1 time', () => {
        CONSTANTS.COUNTER_UPDATE_TYPE_DECREASE = 'decrease';

        render(<App />);

        useCallback.mock.calls[2][0]({
          type: 'decrease',
        });

        expect(mockMergeState).toHaveBeenCalledTimes(1);
      });

      it('should call mergeState method with correct arguments', () => {
        CONSTANTS.COUNTER_UPDATE_TYPE_DECREASE = 'decrease';
        state.counter = 32;

        render(<App />);

        useCallback.mock.calls[2][0]({
          type: 'decrease',
        });

        expect(mockMergeState).toHaveBeenCalledWith({
          counter: 31,
        });
      });

      describe('if received an argument quantity', () => {
        it('should call mergeState method with correct arguments', () => {
          CONSTANTS.COUNTER_UPDATE_TYPE_DECREASE = 'decrease';
          state.counter = 652;

          render(<App />);

          useCallback.mock.calls[2][0]({
            type: 'decrease',
            quantity: 50,
          });

          expect(mockMergeState).toHaveBeenCalledWith({
            counter: 602,
          });
        });
      });
    });
  });

  describe('if the function received by the 1st useEffect is called', () => {
    it('should call GrabContent service 1 time', (done) => {
      render(<App />);

      useEffect.mock.calls[0][0]();

      setTimeout(() => {
        try {
          expect(GrabContent).toHaveBeenCalledTimes(1);

          done();
        } catch (error) {
          done(error);
        }
      }, 1);
    });

    it('should call GrabContent service with correct arguments', (done) => {
      state.language = 'any mocked language';

      render(<App />);

      useEffect.mock.calls[0][0]();

      setTimeout(() => {
        try {
          expect(GrabContent).toHaveBeenCalledWith({
            language: 'any mocked language',
          });

          done();
        } catch (error) {
          done(error);
        }
      }, 1);
    });

    it('should call mergeState method 1 time', (done) => {
      render(<App />);

      useEffect.mock.calls[0][0]();

      setTimeout(() => {
        try {
          expect(mockMergeState).toHaveBeenCalledTimes(1);

          done();
        } catch (error) {
          done(error);
        }
      }, 1);
    });

    it('should call mergeState method with correct arguments', (done) => {
      GrabContent.mockResolvedValue({
        any: 'key',
        mock: 'value',
      });

      render(<App />);

      useEffect.mock.calls[0][0]();

      setTimeout(() => {
        try {
          expect(mockMergeState).toHaveBeenCalledWith({
            content: {
              any: 'key',
              mock: 'value',
            },
          });

          done();
        } catch (error) {
          done(error);
        }
      }, 1);
    });
  });

  describe('if state content is defined', () => {
    beforeEach(() => {
      state.content = {};
    });

    it('should render correct HTML', () => {
      state.counter = 215;

      SimpleHeader.mockReturnValue(<div>Mock Simple Header</div>);
      SimpleButton.mockReturnValue(<div>Mock Simple Button</div>);

      const { container } = render(<App />);

      expect(container).toMatchSnapshot();
    });

    it('should call SimpleHeader component 1 time', () => {
      render(<App />);

      expect(SimpleHeader).toHaveBeenCalledTimes(1);
    });

    it('should call SimpleHeader component with correct props', () => {
      state.content.title = 'mock title';
      state.content.changeLanguage = 'mock change language';

      render(<App />);

      expect(SimpleHeader.mock.calls[0][0]).toStrictEqual({
        labels: {
          title: 'mock title',
          changeLanguage: 'mock change language',
        },
        onClickChangeLanguage: mockHandleChangeLanguage,
      });
    });

    it('should call SimpleButton component 4 times', () => {
      render(<App />);

      expect(SimpleButton).toHaveBeenCalledTimes(4);
    });

    describe('if SimpleButton is called by the 1st time', () => {
      it('should be called with correct props', () => {
        state.content.decrease = 'mock decrease';

        render(<App />);

        expect(SimpleButton.mock.calls[0][0]).toStrictEqual({
          label: 'mock decrease',
          onClick: expect.any(Function),
        });
      });

      describe('if the onClick function received by props is called', () => {
        it('should call handleChangeCounter method 1 time', () => {
          render(<App />);

          SimpleButton.mock.calls[0][0].onClick();

          expect(mockHandleChangeCounter).toHaveBeenCalledTimes(1);
        });

        it('should call handleChangeCounter method with correct arguments', () => {
          CONSTANTS.COUNTER_UPDATE_TYPE_DECREASE = 'mock decrease const';

          render(<App />);

          SimpleButton.mock.calls[0][0].onClick();

          expect(mockHandleChangeCounter).toHaveBeenCalledWith({
            type: 'mock decrease const',
          });
        });
      });
    });

    describe('if SimpleButton is called by the 2nd time', () => {
      it('should be called with correct props', () => {
        state.content.increment = 'mock increment';

        render(<App />);

        expect(SimpleButton.mock.calls[1][0]).toStrictEqual({
          label: 'mock increment',
          onClick: expect.any(Function),
        });
      });

      describe('if the onClick function received by props is called', () => {
        it('should call handleChangeCounter method 1 time', () => {
          render(<App />);

          SimpleButton.mock.calls[1][0].onClick();

          expect(mockHandleChangeCounter).toHaveBeenCalledTimes(1);
        });

        it('should call handleChangeCounter method with correct arguments', () => {
          CONSTANTS.COUNTER_UPDATE_TYPE_INCREASE = 'mock increase const';

          render(<App />);

          SimpleButton.mock.calls[1][0].onClick();

          expect(mockHandleChangeCounter).toHaveBeenCalledWith({
            type: 'mock increase const',
          });
        });
      });
    });

    describe('if SimpleButton is called by the 3rd time', () => {
      it('should be called with correct props', () => {
        render(<App />);

        expect(SimpleButton.mock.calls[2][0]).toStrictEqual({
          label: '+ 5',
          onClick: expect.any(Function),
        });
      });

      describe('if the onClick function received by props is called', () => {
        it('should call handleChangeCounter method 1 time', () => {
          render(<App />);

          SimpleButton.mock.calls[2][0].onClick();

          expect(mockHandleChangeCounter).toHaveBeenCalledTimes(1);
        });

        it('should call handleChangeCounter method with correct arguments', () => {
          CONSTANTS.COUNTER_UPDATE_TYPE_INCREASE = 'other mock increase const';

          render(<App />);

          SimpleButton.mock.calls[2][0].onClick();

          expect(mockHandleChangeCounter).toHaveBeenCalledWith({
            type: 'other mock increase const',
            quantity: 5,
          });
        });
      });
    });

    describe('if SimpleButton is called by the 3rd time', () => {
      it('should be called with correct props', () => {
        render(<App />);

        expect(SimpleButton.mock.calls[3][0]).toStrictEqual({
          label: '- 5',
          onClick: expect.any(Function),
        });
      });

      describe('if the onClick function received by props is called', () => {
        it('should call handleChangeCounter method 1 time', () => {
          render(<App />);

          SimpleButton.mock.calls[3][0].onClick();

          expect(mockHandleChangeCounter).toHaveBeenCalledTimes(1);
        });

        it('should call handleChangeCounter method with correct arguments', () => {
          CONSTANTS.COUNTER_UPDATE_TYPE_DECREASE = 'other mock decrease const';

          render(<App />);

          SimpleButton.mock.calls[3][0].onClick();

          expect(mockHandleChangeCounter).toHaveBeenCalledWith({
            type: 'other mock decrease const',
            quantity: 5,
          });
        });
      });
    });
  });
});
