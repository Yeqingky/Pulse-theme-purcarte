# Pulse-theme-purcarte

一个适用于 [Pulse](https://github.com/xhhcn/Pulse) 的磨砂玻璃风格静态监控主题。

## 功能

- 通过 Pulse SSE `update` 事件接收完整节点快照.
- 展示 CPU, 内存, SWAP, 磁盘, 网络速率, 累计流量和在线时长.
- 支持网格, 紧凑和表格三种首页视图.
- 使用 Pulse `tags` 字段进行标签筛选.
- 支持搜索, 排序, 深色模式和响应式布局.
- 无实例详情页, 管理面板或服务端配置写入逻辑.

## 配置数据源

默认 SSE 地址为:

```text
https://idc-tz.yeqing.dev/api/events
```

复制 `.env.example` 为 `.env`, 然后按需修改 `VITE_*` 变量. Vite 会在构建时注入这些变量, 因此不要将私密 token 写入公开仓库.

常用变量:

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_PULSE_EVENTS_URL` | `https://idc-tz.yeqing.dev/api/events` | Pulse SSE 地址 |
| `VITE_PULSE_SHARE_TOKEN` | 空 | 可选共享 token, 会作为 `token` 查询参数附加 |
| `VITE_PULSE_WITH_CREDENTIALS` | `false` | 是否携带跨域凭据 |
| `VITE_PULSE_RECONNECT_DELAY` | `3000` | SSE 重连初始延迟, 单位为毫秒 |
| `VITE_SITE_TITLE` | `Pulse-theme-purcarte` | 页面标题 |
| `VITE_SITE_DESCRIPTION` | `Pulse server monitoring dashboard.` | 页面描述 |
| `VITE_DEFAULT_VIEW` | `grid` | 默认视图: `grid`, `compact`, `table` |
| `VITE_DEFAULT_APPEARANCE` | `system` | 默认外观: `system`, `light`, `dark` |
| `VITE_ENABLE_TAGS_BAR` | `true` | 是否显示标签筛选 |
| `VITE_DEFAULT_TAG` | 空 | 默认标签, 空值表示所有节点 |

其他界面变量可直接参考 `src/config/default.ts`.

## 本地开发

```bash
cp .env.example .env
yarn install
yarn dev
```

生产构建与预览:

```bash
yarn build
yarn preview
```

## Cloudflare Pages

创建 Pages 项目并使用以下设置:

- 构建命令: `yarn build`
- 输出目录: `dist`
- Node.js: 使用 Cloudflare Pages 当前支持的 Node.js 版本
- 在 Pages 项目的环境变量中配置 `VITE_PULSE_EVENTS_URL` 等变量, 然后重新部署

SSE 服务必须允许部署域名的跨域请求. Pulse 端点应返回 `text/event-stream` 并发送名为 `update` 的事件.

## 项目来源

本项目沿用了 [Montia37/komari-theme-purcarte](https://github.com/Montia37/komari-theme-purcarte) 的 PurCarte 视觉设计, 并适配为 Pulse 数据源. 原作者的提交历史和署名保持不变.

## 许可证

本项目采用 [MIT License](LICENSE) 授权.
