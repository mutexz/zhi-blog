---
title: Tailwind 与「设计 token」
description: 把颜色与间距收敛到有限集合，后期换肤或深色模式成本更低。
pubDate: 2026-03-15
noteType: 工具
---

在 `tailwind.config` 或 CSS 主题里统一语义色（如 `primary`、`muted`），页面类名只引用语义，而不是散落的十六进制值。
