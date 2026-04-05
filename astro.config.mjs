// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const site = process.env.SITE?.replace(/\/$/, '') || 'https://example.com';
/** GitHub Pages 等项目子路径部署时设置，如 /repo-name/ */
const base = process.env.BASE_PATH || '/';

// https://astro.build/config
export default defineConfig({
	site,
	base,
	trailingSlash: 'always',
	redirects: {
		'/blog': '/articles/',
	},
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
