# 小工具集

> ## 🚀 在线体验
>
> ### **https://stools.surge.sh**
>
> 打开即用，免安装、免注册。

一组纯前端的网页小工具。**所有计算都在浏览器本地完成，数据不出机器**，随手打开就能处理文本和金额。

## 现有工具

| 工具 | 能做什么 | 直达 |
| --- | --- | --- |
| 📋 列表处理 | 拆开 → 清洗 → 拼回，一键生成 SQL IN、JS 数组、CSV、Markdown 列表 | [打开工具](https://stools.surge.sh/list_processing.html) |
| 💰 人民币大写转换 | 小写金额 ↔ 人民币大写，内置大小写规范与人民币常识 | [打开工具](https://stools.surge.sh/rmb_uppercase.html) |

## 特点

- **全局顶栏**：任何工具页都保留搜索框和入口，按 `/` 或 `Ctrl/⌘ + K` 可快速搜索、切换工具。
- **本地处理**：无后端、无上传，复制粘贴完关掉页面即可。
- **响应式**：桌面和手机都能用。
- **易于扩展**：新增工具只需在 `assets/tools.js` 加一条配置，再放一个同级 HTML 页面即可。

## 本地运行

直接双击 `index.html` 即可；如果想用本地服务器：

```bash
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 目录结构

```
index.html              首页 / 工具导航
list_processing.html    列表处理
rmb_uppercase.html      人民币大写转换
assets/
  tools.js              工具清单（唯一数据源）
  nav.js                全局顶栏注入与搜索
  nav.css               全局顶栏样式
deploy.sh               一键发布脚本（surge.sh）
```

## 发布

- **surge.sh**：`bash deploy.sh` → https://stools.surge.sh
- **源码仓库**：https://github.com/huasha0/stools
