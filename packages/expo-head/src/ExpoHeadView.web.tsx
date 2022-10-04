import * as React from 'react';

import { ExpoHeadViewProps } from './ExpoHead.types';

function ExpoHeadWebView(props: ExpoHeadViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}

export default ExpoHeadWebView;
