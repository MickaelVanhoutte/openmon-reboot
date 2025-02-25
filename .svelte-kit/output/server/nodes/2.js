import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.CFqm6Nby.js","_app/immutable/chunks/BIx0JD2N.js","_app/immutable/chunks/DHp78hdo.js","_app/immutable/chunks/Dvn9Mt5g.js","_app/immutable/chunks/DaDyqhuJ.js","_app/immutable/chunks/SH21_d4c.js","_app/immutable/chunks/oWA4u6-r.js"];
export const stylesheets = [];
export const fonts = [];
