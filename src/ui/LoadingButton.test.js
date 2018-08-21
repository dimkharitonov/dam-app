import React from 'react';
import ReactDOM from 'react-dom';
import LoadingButton from './LoadingButton';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const f = () => false;
  ReactDOM.render(
    <LoadingButton
      isLoading={true}
      text="test button"
      loadingText="loading"
      className="ownclass"
      disabled={f()}
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
