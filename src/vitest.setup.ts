// jest-dom adds custom matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import 'whatwg-fetch';
import { beforeAll } from 'vitest';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  (<any>window.SVGElement).prototype.getComputedTextLength = (): number => {
    return 0;
  };
});
