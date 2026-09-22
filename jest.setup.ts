/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'node:util';
import i18n from './src/i18n';

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}

beforeAll(async () => {
  await i18n.changeLanguage('en');
});