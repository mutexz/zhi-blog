/**
 * 为内部路径加上 Vite `base`（GitHub Pages 项目站等子路径部署）。
 * @param path 以 / 开头的站内路径，如 `/articles/`、`/rss.xml`
 */
export function sitePath(path: string): string {
	const p = path.startsWith('/') ? path : `/${path}`;
	const base = import.meta.env.BASE_URL;
	if (base === '/') return p;
	const baseTrim = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${baseTrim}${p}`.replace(/\/+/g, '/');
}

/** 站点根绝对 URL（无末尾斜杠），用于 RSS、部分 meta */
export function siteRootAbsolute(site: URL | undefined): string {
	const origin = site?.origin ?? 'https://example.com';
	const base = import.meta.env.BASE_URL;
	if (base === '/') return origin;
	const baseTrim = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${origin}${baseTrim}`.replace(/([^:]\/)\/+/g, '$1');
}

/** 绝对 URL（用于 RSS item、canonical 辅助等） */
export function absoluteUrl(path: string, site: URL | undefined): string {
	const p = sitePath(path);
	return new URL(p, site?.origin ?? 'https://example.com').href;
}
