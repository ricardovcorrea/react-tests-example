import './styles.scss';

import React, { useCallback, useEffect, useState } from 'react';

import * as CONSTANTS from './constants';

import { SimpleButton, SimpleHeader } from './components';

import { GrabContent } from './services';

export default function App() {
  const [state, setState] = useState({
    language: CONSTANTS.LANGUAGE_EN,
    content: undefined,
    counter: 0,
  });

  const mergeState = useCallback((newState) => {
    setState((lastState) => ({
      ...lastState,
      ...newState,
    }));
  }, []);

  const handleChangeLanguage = useCallback(() => {
    const language =
      state.language === CONSTANTS.LANGUAGE_EN
        ? CONSTANTS.LANGUAGE_PT
        : CONSTANTS.LANGUAGE_EN;

    mergeState({
      content: undefined,
      language,
    });
  }, [state.language, mergeState]);

  const handleChangeCounter = useCallback(
    (args) => {
      switch (args.type) {
        case CONSTANTS.COUNTER_UPDATE_TYPE_INCREASE: {
          mergeState({
            counter: state.counter + (args.quantity || 1),
          });
          break;
        }
        case CONSTANTS.COUNTER_UPDATE_TYPE_DECREASE: {
          mergeState({
            counter: state.counter - (args.quantity || 1),
          });
          break;
        }
        default: {
        }
      }
    },
    [state.counter, mergeState]
  );

  useEffect(() => {
    GrabContent({
      language: state.language,
    }).then((content) => {
      mergeState({
        content,
      });
    });
  }, [state.language]);

  let appContent = null;

  if (state.content === undefined) {
    appContent = <div>Loading...</div>;
  } else {
    appContent = (
      <>
        <SimpleHeader
          labels={{
            title: state.content.title,
            changeLanguage: state.content.changeLanguage,
          }}
          onClickChangeLanguage={handleChangeLanguage}
        />

        <div className={'app__counter'}>
          <SimpleButton
            label={state.content.decrease}
            onClick={() => {
              handleChangeCounter({
                type: CONSTANTS.COUNTER_UPDATE_TYPE_DECREASE,
              });
            }}
          />

          <input type={'text'} value={state.counter} readOnly />

          <SimpleButton
            label={state.content.increment}
            onClick={() => {
              handleChangeCounter({
                type: CONSTANTS.COUNTER_UPDATE_TYPE_INCREASE,
              });
            }}
          />
        </div>

        <div>
          <SimpleButton
            label={'+ 5'}
            onClick={() => {
              handleChangeCounter({
                type: CONSTANTS.COUNTER_UPDATE_TYPE_INCREASE,
                quantity: 5,
              });
            }}
          />

          <SimpleButton
            label={'- 5'}
            onClick={() => {
              handleChangeCounter({
                type: CONSTANTS.COUNTER_UPDATE_TYPE_DECREASE,
                quantity: 5,
              });
            }}
          />
        </div>
      </>
    );
  }

  return <div className='app'>{appContent}</div>;
}
