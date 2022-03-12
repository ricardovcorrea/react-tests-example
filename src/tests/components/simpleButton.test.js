import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { SimpleButton } from '../../components/simpleButton';

describe('SimpleButton', () => {
  let sut;
  let props;

  beforeEach(() => {
    props = {};
  });

  afterEach(() => {
    if (typeof sut?.unmount === 'function') {
      sut.unmount();
    }
  });

  it('should be a function', () => {
    expect(typeof SimpleButton).toBe('function');
  });

  it('should render correct html', () => {
    props.label = 'Mock button label';

    const { container } = render(<SimpleButton {...props} />);

    expect(container).toMatchSnapshot();
  });

  describe('if the button is clicked', () => {
    it('should call onClick callback 1 time', () => {
      props.onClick = jest.fn();

      render(<SimpleButton {...props} />);

      const button = document.getElementsByTagName('button')[0];

      fireEvent.click(button);

      expect(props.onClick).toHaveBeenCalledTimes(1);
    });
  });
});
