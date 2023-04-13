import { SunEditor as RNSunEditor } from './suneditor/index';

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

export const SunEditor = RNSunEditor;
