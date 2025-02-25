import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.DMLSzdFT.js","_app/immutable/chunks/adO3e7o8.js","_app/immutable/chunks/DPX2zYGg.js","_app/immutable/chunks/CQuDEXO6.js"];
export const stylesheets = [];
export const fonts = [];
