import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import graphql from '@rollup/plugin-graphql';

import alias from './alias.js';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte(), graphql()],
	resolve: {
		alias,
	},
	optimizeDeps: {
		exclude: ['tinro', '@urql/svelte'],
	},
});
