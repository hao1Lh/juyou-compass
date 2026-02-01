import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载当前目录下的环境变量（读取 .env 文件或 Cloudflare 注入的变量）
  // 第二个参数是 process.cwd()，第三个参数 '' 表示加载所有变量，不仅限于 VITE_ 开头
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // 关键配置：将代码中的 process.env.API_KEY 替换为构建时的环境变量 VITE_API_KEY
      // 这样既符合 Google SDK 的规范，又能让 Vite 在浏览器中正确运行
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
    },
    // 由于项目文件都在根目录，不需要复杂的 alias 配置
    resolve: {
      alias: {
        '@': '/', 
      },
    },
  };
});