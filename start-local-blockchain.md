# 启动本地区块链和部署合约

## 步骤 1: 启动 Hardhat 节点

**在 VS Code 中打开第一个终端**，运行：

```powershell
cd D:\Desktop\1\nft-generator
npx hardhat node
```

✅ **保持这个终端打开！** 你会看到：

```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

---

## 步骤 2: 部署合约

**打开第二个新终端**（Terminal > New Terminal），运行：

```powershell
cd D:\Desktop\1\nft-generator
npx hardhat run scripts/deploy.cjs --network localhost
```

✅ 你会看到：

```
✅ NFT Generator 合约已部署到: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

## 步骤 3: 刷新浏览器

在浏览器中刷新 http://localhost:5173/

现在可以铸造 NFT 了！🎉

---

## ⚠️ 重要提示

- **第一个终端（Hardhat 节点）必须一直保持运行！**
- 如果关闭了 Hardhat 节点，所有部署的合约都会消失
- 重启 Hardhat 节点后，需要重新执行步骤 2 部署合约
