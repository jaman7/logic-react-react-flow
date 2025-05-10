import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { TextDecoder, TextEncoder } from 'util';

fetchMock.enableMocks();

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder as any;
}
