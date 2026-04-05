# 知行小站（可上线版本）

基于 [Astro](https://astro.build/) 的**静态**个人知识站：长文在 `src/content/articles/`，笔记在 `src/content/notes/`。内置 **RSS**、**sitemap**、**深浅色**、文章页**标签筛选**（列表页）。

**完整部署步骤（Vercel / GitHub Pages）与新增长文、笔记的 frontmatter 模板，见 [部署与写作指南.md](./部署与写作指南.md)。**

## 本地开发

需要 **Node.js ≥ 20.3**。

```bash
cd zhi-blog
npm install
npm run dev
```

浏览器打开终端里提示的地址（一般为 `http://127.0.0.1:4321`）。

## 生产构建

1. 复制环境变量示例并按你的域名修改：

   ```bash
   cp .env.example .env
   ```

   将 `SITE` 设为你的线上地址，例如 `https://blog.example.com`。

2. 构建：

   ```bash
   npm run build
   ```

3. 产物在 `dist/`，为纯静态文件，可上传到任意静态托管。

### GitHub Pages（项目仓库，地址为 `https://<user>.github.io/<repo>/`）

在 `.env` 中同时设置：

- `SITE=https://<user>.github.io/<repo>`
- `BASE_PATH=/<repo>/`

然后再执行 `npm run build`。将 `dist/` 部署到 Pages（见下方 GitHub Actions）。

### Vercel

1. 新建项目，**Root Directory** 选 `zhi-blog`。
2. Build Command：`npm run build`
3. Output Directory：`dist`
4. Environment Variables：添加 `SITE` = 你的生产 URL（如 Vercel 分配的 `https://xxx.vercel.app`）。

### Netlify

与 Vercel 类似：发布目录 `zhi-blog`，构建命令 `npm run build`，发布目录 `dist`，环境变量 `SITE`。

## 写作

- 新增文章：在 `src/content/articles/` 新建 `.md`，参考现有 frontmatter（`title`、`description`、`pubDate`、`tags`、`readTime`、`featured` 等）。
- 新增笔记：在 `src/content/notes/` 新建 `.md`，需包含 `noteType`：`摘录` | `链接` | `短想法` | `工具`。
- 首页「精选长文」取 `featured: true` 的前若干篇（当前模板为前 3 篇）。

## 与旧版 HTML MVP 的关系

仓库中 `personal-knowledge-hub/` 为早期纯 HTML 原型；**线上博客请以本目录 `zhi-blog` 为准**。
