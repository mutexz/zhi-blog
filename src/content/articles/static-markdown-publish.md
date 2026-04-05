---
title: 静态站点与 Markdown：最小可行发布
description: 不引入复杂后台也能持续写作：结构、模板与一条命令部署。
pubDate: 2026-01-10
tags: ['技术', '写作']
readTime: 约 15 分钟
featured: true
---

用 **Astro / Eleventy** 这类静态站点生成器，你可以把文章当作仓库里的 Markdown 文件来管理：版本控制、Review、回滚都沿用开发流程。

部署到 **Vercel、Netlify 或 GitHub Pages** 时，通常只需连接仓库并指定构建命令（如 `npm run build`）与输出目录（如 `dist`）。把域名指向平台后，即可获得 HTTPS 与全球 CDN。
