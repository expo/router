import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoHeadViewProps } from './ExpoHead.types';

const NativeView: React.ComponentType<ExpoHeadViewProps> =
  requireNativeViewManager('ExpoHead');

export default function ExpoHeadView(props: ExpoHeadViewProps) {
  return <NativeView name={props.name} />;
}
