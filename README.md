# Wikipedia 猜詞遊戲（Vercel 版）

基於 Wikipedia 條目建立的 `是 / 否 / 無關 / 無法判斷` 猜詞遊戲。後端採 Node.js + Vercel Serverless Functions，資料暫存使用 Upstash Redis，LLM 判斷僅根據段落文本給出答案。

## 功能摘要

- `/api/start`：隨機挑選 Wikipedia 條目、切成段落並建立遊戲 Session。
- `/api/judge`：接收玩家問題，執行段落檢索 → Gemini 判斷 → 答案正規化，最後回傳唯一答案。
- 前端靜態頁面提供最小互動介面，不顯示完整段落，僅接受簡答結果。

## 專案結構

```
backend/           # Node.js 後端程式碼
  ├─ api/          # Vercel 入口
  ├─ src/          # 核心邏輯（services, storage, utils）
  └─ tests/        # Jest 單元測試
frontend/          # 靜態單頁前端
docs/              # 部署與營運文件
.github/workflows/ # CI 配置（GitHub Actions）
```

## 開發流程

1. `cd backend`
2. `npm install`
3. 建立 `backend/.env`（參考環境變數章節）
4. `npm run dev` 本地啟動（僅供簡單測試；正式環境建議走雲端 Runner）
5. `npm test` 執行單元測試

> ⚠️ 開發者機器若無法穩定運行，可直接提交程式碼到 GitHub，透過 GitHub Actions / Vercel 完成 CI/CD 與雲端測試。

## 必要環境變數

| 變數 | 說明 |
| ---- | ---- |
| `GEMINI_API_KEY` | Google Gemini API 金鑰 |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST API URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis Token |
| `SESSION_TTL` | Session 有效時間（秒，預設 600） |
| `TOP_K` | 檢索返回段落數（預設 1） |

## 部署

- **Vercel**：使用 `backend/api/index.js` 作為 serverless 入口，`frontend/` 作為靜態資源。細節參考 `docs/deployment.md`。
- **CI/CD**：`ci.yml` 會安裝依賴、執行測試、透過 Vercel CLI 觸發部署。

## 授權

MIT License。詳見 `LICENSE`。（若尚未建立，可依需求新增）