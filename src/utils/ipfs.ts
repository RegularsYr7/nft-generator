import axios from "axios";
import type { NFTMetadata } from "../types/index.js";

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

export class IPFSService {
  /**
   * 检查是否配置了 Pinata API 密钥
   */
  private hasPinataConfig(): boolean {
    return !!(PINATA_API_KEY && PINATA_SECRET_KEY);
  }

  /**
   * 将文件转换为 Base64 Data URI
   */
  private async fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 上传图片到 IPFS（如果没有配置 Pinata，则使用 Base64）
   */
  async uploadImage(file: File): Promise<string> {
    // 如果没有配置 Pinata，使用本地 Base64 数据
    if (!this.hasPinataConfig()) {
      console.warn(
        "未配置 Pinata API 密钥，使用本地 Base64 数据（仅用于测试）"
      );
      const dataUri = await this.fileToDataUri(file);
      return dataUri;
    }

    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": `multipart/form-data`,
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
          },
        }
      );

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error("上传图片到 IPFS 失败:", error);
      throw new Error("图片上传失败");
    }
  }

  /**
   * 上传 JSON 元数据到 IPFS（如果没有配置 Pinata，则使用 Base64）
   */
  async uploadMetadata(metadata: NFTMetadata): Promise<string> {
    // 如果没有配置 Pinata，使用本地 Base64 数据
    if (!this.hasPinataConfig()) {
      console.warn("未配置 Pinata API 密钥，使用本地 JSON 数据（仅用于测试）");
      const jsonString = JSON.stringify(metadata);
      const dataUri = `data:application/json;base64,${btoa(jsonString)}`;
      return dataUri;
    }

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
          },
        }
      );

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error("上传元数据到 IPFS 失败:", error);
      throw new Error("元数据上传失败");
    }
  }

  /**
   * 将 IPFS URI 转换为 HTTP URL
   */
  ipfsToHttp(ipfsUri: string): string {
    // 如果是 data URI，直接返回
    if (ipfsUri.startsWith("data:")) {
      return ipfsUri;
    }

    if (ipfsUri.startsWith("ipfs://")) {
      return ipfsUri.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return ipfsUri;
  }
}

export const ipfsService = new IPFSService();
