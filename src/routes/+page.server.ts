// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

import { decodeJwtResponse } from "$lib";

export function load({ cookies }) {
	const auth = cookies.get('auth');
    let user = null;
    if(auth){
        user = decodeJwtResponse(auth);
    }

	
	return {
		user
	};
}