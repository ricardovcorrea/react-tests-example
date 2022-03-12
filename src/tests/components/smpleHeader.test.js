import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { SimpleHeader } from '../../components/simpleHeader';

describe('SimpleHeader', () => {
  let sut;
  let props;

  beforeEach(() => {
    props = {
      labels: {},
    };
  });

  afterEach(() => {
    if (typeof sut?.unmount === 'function') {
      sut.unmount();
    }
  });

  it('should be a function', () => {
    expect(typeof SimpleHeader).toBe('function');
  });

  it('should render correct html', () => {
    props.labels.title = 'mock title';
    props.labels.changeLanguage = 'mock change language';

    const { container } = render(<SimpleHeader {...props} />);

    expect(container).toMatchSnapshot();
  });

  describe('if the change language span is clicked', () => {
    it('should call onClick callback 1 time', () => {
      props.onClickChangeLanguage = jest.fn();

      render(<SimpleHeader {...props} />);

      const span = document.getElementById('change-language-button');

      fireEvent.click(span);

      expect(props.onClickChangeLanguage).toHaveBeenCalledTimes(1);
    });
  });
});
