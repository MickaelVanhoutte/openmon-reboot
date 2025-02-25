export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.B3IVea3R.js",app:"_app/immutable/entry/app.CbiqVwQy.js",imports:["_app/immutable/entry/start.B3IVea3R.js","_app/immutable/chunks/D3SfM6OY.js","_app/immutable/chunks/DHp78hdo.js","_app/immutable/chunks/oWA4u6-r.js","_app/immutable/entry/app.CbiqVwQy.js","_app/immutable/chunks/DHp78hdo.js","_app/immutable/chunks/DaDyqhuJ.js","_app/immutable/chunks/BIx0JD2N.js","_app/immutable/chunks/SH21_d4c.js","_app/immutable/chunks/oWA4u6-r.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			
		],
		routes: [
			
		],
		prerendered_routes: new Set(["/","/__data.json"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
