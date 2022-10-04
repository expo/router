import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoHead.web.ts
// and on native platforms to ExpoHead.ts
import ExpoHead from './ExpoHeadModule';
import ExpoHeadView from './ExpoHeadView';
import { ChangeEventPayload, ExpoHeadViewProps } from './ExpoHead.types';

// Get the native constant value.
export const PI = ExpoHead.PI;

export function hello(): string {
  return ExpoHead.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoHead.setValueAsync(value);
}

// For now the events are not going through the JSI, so we have to use its bridge equivalent.
// This will be fixed in the stable release and built into the module object.
// Note: On web, NativeModulesProxy.ExpoHead is undefined, so we fall back to the directly imported implementation
const emitter = new EventEmitter(NativeModulesProxy.ExpoHead ?? ExpoHead);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoHeadView, ExpoHeadViewProps, ChangeEventPayload };
