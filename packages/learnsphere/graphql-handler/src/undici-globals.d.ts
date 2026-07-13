// @azure/functions v4 type definitions reference the WHATWG fetch primitives
// `BodyInit` and `HeadersInit` as globals. Under a Node `lib` (no DOM lib) these
// are not declared, so we surface them from `undici-types` (Node’s fetch impl).
import type { BodyInit as UndiciBodyInit, HeadersInit as UndiciHeadersInit } from 'undici-types';

declare global {
	type BodyInit = UndiciBodyInit;
	type HeadersInit = UndiciHeadersInit;
}

export {};
