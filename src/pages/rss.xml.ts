import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { siteRootAbsolute } from '../utils/sitePath';

export async function GET(context: APIContext) {
	const articles = (await getCollection('articles')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
	const root = siteRootAbsolute(context.site);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: root,
		items: articles.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `${root}/articles/${post.id}/`.replace(/([^:]\/)\/+/g, '$1'),
		})),
	});
}
