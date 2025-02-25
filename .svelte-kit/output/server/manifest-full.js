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
		client: {start:"_app/immutable/entry/start.BDybINFF.js",app:"_app/immutable/entry/app.C5hQLko9.js",imports:["_app/immutable/entry/start.BDybINFF.js","_app/immutable/chunks/RztZXJLp.js","_app/immutable/chunks/DPX2zYGg.js","_app/immutable/chunks/CkAdXMHw.js","_app/immutable/entry/app.C5hQLko9.js","_app/immutable/chunks/DPX2zYGg.js","_app/immutable/chunks/ZBIiUHMm.js","_app/immutable/chunks/adO3e7o8.js","_app/immutable/chunks/CkAdXMHw.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
