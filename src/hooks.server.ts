
import { ADMIN_PASSWORD_HASH } from '$env/static/private';
import { createHash } from 'crypto';
import { redirect } from '@sveltejs/kit';

const AUTH_COOKIE_NAME = 'auth_token';

export async function handle({ event, resolve }) {
    const password = event.url.searchParams.get('password');
    const authToken = event.cookies.get(AUTH_COOKIE_NAME);

    let isAdmin = false;
    if (authToken && authToken === ADMIN_PASSWORD_HASH) {
        isAdmin = true;
    }

    if (password) {
        const passwordHash = createHash('sha256').update(password).digest('hex');
        if (passwordHash === ADMIN_PASSWORD_HASH) {
            event.cookies.set(AUTH_COOKIE_NAME, ADMIN_PASSWORD_HASH, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
            isAdmin = true;
            // Redirect to remove the password from the URL
            const redirectUrl = new URL(event.url);
            redirectUrl.searchParams.delete('password');
            throw redirect(302, redirectUrl.toString());
        }
    }

    event.locals.isAdmin = isAdmin;

    return resolve(event);
}
