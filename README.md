# 🎨 NFT Generator - 以太坊 NFT 生成器# React + TypeScript + Vite

基于以太坊测试网的简易 NFT 生成器，支持图片上传、IPFS 存储和 NFT 铸造功能。This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## ✨ 功能特性 Currently, two official plugins are available:

- 🦊 **MetaMask 钱包连接** - 支持 MetaMask 钱包登录- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- 🖼️ **图片上传** - 支持拖拽上传 NFT 图片- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- 📦 **IPFS 存储** - 通过 Pinata 将图片和元数据存储到 IPFS

- ⛓️ **智能合约铸造** - 基于 ERC-721 标准的 NFT 合约## React Compiler

- 🎯 **NFT 画廊** - 查看已铸造的 NFT 收藏

- 🌐 **测试网支持** - Sepolia/Goerli 测试网 The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## 🛠️ 技术栈## Expanding the ESLint configuration

### 前端 If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- ⚛️ **React 18** - UI 框架

- ⚡ **Vite** - 构建工具```js

- 🎨 **TailwindCSS** - 样式框架 export default defineConfig([

- 📘 **TypeScript** - 类型安全 globalIgnores(['dist']),

  {

### Web3 files: ['**/*.{ts,tsx}'],

- 🔗 **ethers.js v6** - 以太坊交互 extends: [

- 🔨 **Hardhat** - 智能合约开发 // Other configs...

- 🛡️ **OpenZeppelin** - 安全的合约库

- 📍 **Pinata** - IPFS 存储服务 // Remove tseslint.configs.recommended and replace with this

      tseslint.configs.recommendedTypeChecked,

## 📋 前置要求 // Alternatively, use this for stricter rules

      tseslint.configs.strictTypeChecked,

1. **Node.js** >= 18.0.0 // Optionally, add this for stylistic rules

2. **MetaMask** 浏览器扩展 tseslint.configs.stylisticTypeChecked,

3. **测试网 ETH** - 从水龙头获取

   - Sepolia: https://sepoliafaucet.com/ // Other configs...

   - Goerli: https://goerlifaucet.com/ ],

4. **Pinata 账户** - 用于 IPFS 存储 languageOptions: {

   - 注册: https://pinata.cloud/ parserOptions: {

     project: ['./tsconfig.node.json', './tsconfig.app.json'],

## 🚀 快速开始 tsconfigRootDir: import.meta.dirname,

      },

### 1. 安装依赖 // other options...

    },

```bash },

npm install])

```

### 2. 配置环境变量 You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

复制 `.env.example` 到 `.env` 并填写配置：```js

// eslint.config.js

```bashimport reactX from 'eslint-plugin-react-x'

cp .env.example .envimport reactDom from 'eslint-plugin-react-dom'

```

export default defineConfig([

编辑 `.env` 文件： globalIgnores(['dist']),

{

````env files: ['**/*.{ts,tsx}'],

# 以太坊 RPC URL (从 Infura 或 Alchemy 获取)    extends: [

SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID      // Other configs...

      // Enable lint rules for React

# 部署钱包私钥      reactX.configs['recommended-typescript'],

PRIVATE_KEY=你的私钥      // Enable lint rules for React DOM

      reactDom.configs.recommended,

# Pinata API 密钥    ],

VITE_PINATA_API_KEY=你的Pinata_API_Key    languageOptions: {

VITE_PINATA_SECRET_KEY=你的Pinata_Secret_Key      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

# 合约地址 (部署后填写)        tsconfigRootDir: import.meta.dirname,

VITE_CONTRACT_ADDRESS=      },

```      // other options...

    },

### 3. 编译智能合约  },

])

```bash```

npm run hardhat:compile
````

### 4. 部署智能合约

部署到 Sepolia 测试网：

```bash
npm run hardhat:deploy
```

部署成功后，将合约地址添加到 `.env` 的 `VITE_CONTRACT_ADDRESS`。

### 5. 启动前端应用

```bash
npm run dev
```

访问 http://localhost:5173

## 📱 使用指南

### 铸造 NFT

1. **连接钱包** - 点击 "连接 MetaMask" 按钮
2. **切换网络** - 确保在 Sepolia 测试网
3. **上传图片** - 点击上传区域选择图片
4. **填写信息** - 输入 NFT 名称和描述
5. **确认铸造** - 点击 "铸造 NFT" 并确认交易
6. **等待确认** - 等待交易上链（约 15-30 秒）

### 查看 NFT

铸造成功后，您的 NFT 会自动显示在 "我的 NFT 收藏" 区域。

## 🔧 开发命令

```bash
# 前端开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run preview          # 预览生产构建

# 智能合约
npm run hardhat:compile  # 编译合约
npm run hardhat:test     # 运行测试
npm run hardhat:deploy   # 部署到 Sepolia
npm run hardhat:node     # 启动本地节点
```

## 📁 项目结构

```
nft-generator/
├── contracts/              # 智能合约
│   └── NFTGenerator.sol   # NFT 合约
├── scripts/               # 部署脚本
│   └── deploy.ts         # 部署脚本
├── src/
│   ├── components/       # React 组件
│   │   ├── WalletConnect.tsx   # 钱包连接
│   │   ├── NFTMinter.tsx       # NFT 铸造器
│   │   └── NFTGallery.tsx      # NFT 画廊
│   ├── utils/           # 工具函数
│   │   ├── web3.ts      # Web3 服务
│   │   └── ipfs.ts      # IPFS 服务
│   ├── types/           # TypeScript 类型
│   ├── App.tsx          # 主应用
│   └── main.tsx         # 入口文件
├── hardhat.config.ts    # Hardhat 配置
├── tailwind.config.js   # TailwindCSS 配置
└── package.json
```

## 🔐 安全提示

⚠️ **重要安全事项：**

1. **永远不要提交 `.env` 文件到 Git**
2. **不要使用包含真实资产的钱包私钥**
3. **仅在测试网使用**
4. **定期更新依赖包以修复安全漏洞**

## 🐛 常见问题

### MetaMask 连接失败

- 确保已安装 MetaMask 扩展
- 检查是否已登录 MetaMask
- 尝试刷新页面

### 交易失败

- 检查钱包是否有足够的测试 ETH
- 确认在正确的网络（Sepolia）
- 检查 Gas 费用设置

### IPFS 上传失败

- 验证 Pinata API 密钥是否正确
- 检查图片大小（建议 < 10MB）
- 确保网络连接正常

### 合约部署失败

- 检查 RPC URL 是否正确
- 确保私钥有足够的测试 ETH
- 验证 Hardhat 配置

## 📖 参考资源

- [Hardhat 文档](https://hardhat.org/docs)
- [ethers.js 文档](https://docs.ethers.org/v6/)
- [OpenZeppelin 合约](https://docs.openzeppelin.com/contracts/)
- [Pinata 文档](https://docs.pinata.cloud/)
- [MetaMask 文档](https://docs.metamask.io/)

## 📄 License

MIT

---

**开始您的 NFT 创作之旅！** 🚀
