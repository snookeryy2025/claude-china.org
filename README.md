# Claude 中文文档

基于 Next.js、MDX 和定制文档组件的 Claude Platform 简体中文文档镜像。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

开发启动脚本会为每个进程分配独立的 `.next-dev/session-*` 编译目录，避免同时启动多个开发服务时相互覆盖 HTML、RSC 数据和客户端脚本而引发 hydration 错误。请通过 `npm run dev` 启动；指定端口可用 `npm run dev -- --port 3001`。生产构建仍使用 `.next`，可与开发服务同时运行。

## 同步官方中文文档

```bash
npm run sync:docs
```

同步脚本读取 `https://platform.claude.com/docs/zh-CN/` 的官方 Markdown 页面，并写入 `docs/`。页面中的 `source` 元字段会被移除，站内链接会转换为本地 `/docs/` 路径。

## Vercel

项目使用 Next.js App Router，可直接导入 Vercel。构建命令为 `npm run build`。
