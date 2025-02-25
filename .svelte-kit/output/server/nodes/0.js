

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0._IqAIXw9.js","_app/immutable/chunks/BIx0JD2N.js","_app/immutable/chunks/DHp78hdo.js"];
export const stylesheets = ["_app/immutable/assets/0.dRXQdM85.css"];
export const fonts = [];
