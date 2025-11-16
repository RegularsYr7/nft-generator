# 本地测试网络部署指南

## 📋 准备工作

您的 Hardhat 本地节点已经在运行！可以看到 20 个测试账户，每个都有 10000 ETH。

## 🚀 部署步骤

### 方法 1：使用已运行的节点

由于节点已在终端 ID `c0e63e44-fbfa-48b8-af08-e2391c80d3b1` 运行，请**打开新的 PowerShell 终端**：

```powershell
# 1. 进入项目目录
cd d:\Desktop\1\nft-generator

# 2. 部署合约
npx hardhat run scripts/deploy.cjs --network localhost
```

### 方法 2：如果上述方法失败，重启节点

1. **停止当前节点**（在运行 hardhat node 的终端按 `Ctrl+C`）

2. **重新启动**：

```powershell
cd d:\Desktop\1\nft-generator
npx hardhat node
```

3. **打开新终端部署**：

```powershell
cd d:\Desktop\1\nft-generator
npx hardhat run scripts/deploy.cjs --network localhost
```

## ✅ 部署成功后

您会看到类似输出：

```
✅ NFT Generator 合约已部署到: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**复制这个合约地址！**

## 📝 配置前端

1. 创建 `.env` 文件（如果不存在）：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，添加合约地址：

```env
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

（替换为您实际的合约地址）

## 🦊 配置 MetaMask

### 1. 添加本地网络

打开 MetaMask，点击网络下拉菜单 → 添加网络 → 手动添加：

```
网络名称: Localhost 8545
RPC URL: http://127.0.0.1:8545
链 ID: 31337
货币符号: ETH
```

### 2. 导入测试账户

使用 Hardhat 提供的任意一个账户：

**推荐账户 #0:**

- 地址: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- 私钥: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

在 MetaMask 中：

1. 点击右上角圆形图标
2. 选择"导入账户"
3. 粘贴私钥
4. 完成！

### 3. 切换到本地网络

MetaMask 顶部选择 "Localhost 8545"

## 🎨 开始使用

1. 刷新 NFT Generator 页面 (http://localhost:5173)
2. 连接 MetaMask 钱包
3. 上传图片并填写信息
4. 点击"铸造 NFT"按钮
5. MetaMask 会弹出确认（gas 费几乎为 0）
6. 确认交易
7. 几秒钟后就能看到您的 NFT！

## ⚠️ 注意事项

- 本地节点需要保持运行
- 关闭节点后所有数据会丢失
- 这些私钥是公开的，**绝不要**在主网使用
- 本地网络仅用于开发测试

## 🔧 常见问题

### Q: 无法连接到 localhost?

A: 确保 Hardhat 节点正在运行，检查终端输出

### Q: MetaMask 显示 "Nonce too high"?

A: MetaMask → 设置 → 高级 → 清除活动标签数据

### Q: 交易失败?

A: 检查合约地址是否正确配置在 .env 文件中

## 📚 测试账户列表

可用的所有测试账户（每个 10000 ETH）：

| 账户 | 地址                                       | 私钥            |
| ---- | ------------------------------------------ | --------------- |
| #0   | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 0xac097...2ff80 |
| #1   | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 0x59c69...8690d |
| ...  | (见 hardhat node 输出)                     | ...             |

---

**祝您 NFT 铸造愉快！** 🎉
