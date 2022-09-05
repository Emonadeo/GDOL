import { createClient } from '@urql/svelte';

export const client = createClient({
	url: import.meta.env.VITE_REST_URL,
});
