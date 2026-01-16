# selfintro

一个基于 Markdown 的个人静态博客站点，通过 `generate.js` 将文章与模板组合生成静态页面。

## 开发与构建

```bash
npm run build
```

生成静态页面（`index.html`、`articles.html`、`posts/*.html`）。

```bash
npm run dev
```

生成页面并启动本地预览服务器（默认端口 8000）。

## 文章格式

文章放在 `posts/` 目录下，使用带 Front Matter 的 Markdown：

```markdown
---
title: "标题"
date: 2024-01-01
type: "分类"
excerpt: "摘要..."
coverImage: "/images/cover.jpg"
---

正文内容...
```
