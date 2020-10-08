import React, { useState } from 'react';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiCode,
  EuiIcon,
  EuiResizeObserver,
  EuiPanel,
  EuiSpacer,
  EuiText,
} from '../../../../src/components';

export const ResizeObserverExample = () => {
  const hasResizeObserver = typeof ResizeObserver !== 'undefined';
  const [paddingSize, setPaddingSize] = useState('s');
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const togglePaddingSize = () => {
    setPaddingSize((paddingSize) => (paddingSize === 's' ? 'l' : 's'));
  };

  const addItem = () => {
    setItems((items) => [...items, `Item ${items.length + 1}`]);
  };

  const onResize = ({ height, width }) => {
    setHeight(height);
    setWidth(width);
  };

  return (
    <div>
      <EuiText>
        {hasResizeObserver ? (
          <p>
            <EuiIcon type="checkInCircleFilled" color="secondary" /> Browser
            supports ResizeObserver API.
          </p>
        ) : (
          <p>
            <EuiIcon type="crossInACircleFilled" color="danger" /> Browser does
            not support ResizeObserver API. Using MutationObserver.
          </p>
        )}
        <p>
          <EuiCode>{`height: ${height}; width: ${width}`}</EuiCode>
        </p>
      </EuiText>

      <EuiSpacer />

      <EuiButton fill={true} onClick={togglePaddingSize}>
        Toggle container padding
      </EuiButton>

      <EuiSpacer />

      <EuiResizeObserver onResize={onResize}>
        {(resizeRef) => (
          <div className="eui-displayInlineBlock" ref={resizeRef}>
            <EuiPanel
              className="eui-displayInlineBlock"
              paddingSize={paddingSize}>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <EuiSpacer size="s" />
              <EuiButtonEmpty onClick={addItem}>add item</EuiButtonEmpty>
            </EuiPanel>
          </div>
        )}
      </EuiResizeObserver>
    </div>
  );
};
