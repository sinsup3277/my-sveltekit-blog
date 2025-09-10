
import { json } from '@sveltejs/kit';

const AUTH_COOKIE_NAME = 'auth_token';

/**
 * Handles user logout by clearing the authentication cookie.
 */
export async function POST({ cookies }) {
    cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
    return json({ message: 'Logged out successfully' });
}
