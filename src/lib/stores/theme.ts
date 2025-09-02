import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// The key for storing the theme in localStorage
const storageKey = 'theme';

// Get the initial value from localStorage if it exists, otherwise default to 'light'
const storedTheme = browser ? localStorage.getItem(storageKey) : 'light';

// Create a writable store
const theme = writable(storedTheme);

// Subscribe to the store and update localStorage whenever the value changes
if (browser) {
    theme.subscribe(value => {
        localStorage.setItem(storageKey, value);
    });
}

export default theme;
