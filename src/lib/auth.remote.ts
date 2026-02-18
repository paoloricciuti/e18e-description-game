import { form, getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { auth } from './server/auth';

export const get_session = query(async () => {
	const { request } = getRequestEvent();
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) {
		redirect(302, '/login');
	}
	return session;
});

export const login = form(async () => {
	const result = await auth.api.signInSocial({
		body: {
			provider: 'github',
			callbackURL: '/'
		}
	});

	if (result.url) {
		return redirect(302, result.url);
	}
});

export const logout = form(async () => {
	await auth.api.signOut({
		headers: getRequestEvent().request.headers
	});
});
