# 部署指南（Vercel + Upstash）

## 前置準備

- Vercel Hobby 專案，綁定 GitHub 倉庫。
- Upstash Redis（Free Tier），取得 `REST URL` 與 `REST TOKEN`。
- Google Gemini API 金鑰（free tier 可用於低流量）。
- GitHub Secrets：`GEMINI_API_KEY`、`UPSTASH_REDIS_REST_URL`、`UPSTASH_REDIS_REST_TOKEN`、`VERCEL_TOKEN`（Personal Access Token）、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`。

## Vercel 設定

1. 於 Vercel 專案的 **Settings → Environment Variables** 新增：
   - `GEMINI_API_KEY`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `SESSION_TTL`（預設 `600` 秒）
   - `TOP_K`（預設 `1`）
2. 將 `frontend/` 當作靜態資源，`backend/api/index.js` 由 `@vercel/node` 執行。
3. 建立 `vercel.json`（範例如下）並提交到倉庫：
   ```json
   {
     "builds": [
       { "src": "backend/api/index.js", "use": "@vercel/node" },
       { "src": "frontend/**/*", "use": "@vercel/static" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "backend/api/index.js" },
       { "src": "/frontend/(.*)", "dest": "/frontend/$1" },
       { "src": "/", "dest": "/frontend/index.html" }
     ]
   }
   ```

## GitHub Actions（CI/CD）

`.github/workflows/ci.yml` 主要步驟：

1. 使用 `ubuntu-latest` runner。
2. `cd backend && npm ci` 安裝依賴。
3. `npm test` 執行單元測試。
4. `vercel pull --yes --environment=production` 取得 Vercel 設定（需 Token 與 Org/Project ID）。
5. `vercel build --prod` 建置專案。
6. `vercel deploy --prebuilt --prod` 佈署至 Production。

## Upstash Redis

- 在 Upstash 建立 Redis free instance，複製 REST URL / TOKEN。
- Redis 中僅儲存 session id 與段落列表，TTL 預設 10 分鐘。
- 可在 Upstash 儀表板監控指令數量與記憶體使用量，避免超出免費額度。

## 環境變數摘要

| 名稱 | 用途 | 範例 |
| ---- | ---- | ---- |
| `GEMINI_API_KEY` | Google Gemini 授權 | `AIza...` |
| `UPSTASH_REDIS_REST_URL` | Upstash REST URL | `https://...` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Token | `AYJ1...` |
| `SESSION_TTL` | Session 有效秒數 | `600` |
| `TOP_K` | 段落檢索返回筆數 | `1` |
| `VERCEL_ORG_ID` | Vercel 組織 ID | `team_xxx` |
| `VERCEL_PROJECT_ID` | Vercel 專案 ID | `prj_xxx` |

---

> 小技巧：專案 commit 後，Vercel 會自動觸發預設部署；若需 pipeline 控制，可在 Vercel 中停用「Automatic Deployments」，改由 GitHub Actions 透過 CLI 觸發。

