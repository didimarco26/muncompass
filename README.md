# MUN Compass · 模拟联合国 AI 指南针

面向模拟联合国（Model United Nations）代表的一站式 AI 工具：议题资料智能检索、立场文件（Position Paper）、决议草案（Draft Resolution）与会议讲稿（Speech）AI 写作，以及实时联网的 AI 学术教练对话。

- 在线地址：<https://www.muncompass.top>
- GitHub Pages：<https://didimarco26.github.io/muncompass/>

## 功能

- **议题材料检索**：9 大议题分类，AI 精选最贴切的权威信源（联合国官网、专门机构、基金署、数据平台等），并可实时联网抓取最新网页。
- **AI 学术教练**：后端实时检索 UN News 与全网，基于最新信息回答并附来源。
- **立场文件生成器**：会议主题/委员会/代表国等信息填齐后，各分区 AI 一键生成，并给出内容方向建议。
- **决议草案构建器**：标准抬头 + 序言性/执行性条款编辑器；支持把核心内容概括一键整理为规范草案。
- **讲稿生成器**：会议基本信息 + 时长（1/2/5/10 分钟）+ 语气（建议性/陈述性/谴责性/调解性/敦促性）+ AI 论点推荐。

## 技术栈

React 18 · TypeScript · Vite · Tailwind CSS · lucide-react；AI 能力由妙笔 FaaS（[faas/mun-ai.js](faas/mun-ai.js)）提供。

## 本地开发

```bash
pnpm install
pnpm run dev
pnpm run build
```

推送到 `main` 分支后，GitHub Actions 自动构建并发布到 GitHub Pages。

> AI 生成内容可能有误，关键文件号、数据与引述请对照联合国官方源核实。本项目非联合国官方产品。
