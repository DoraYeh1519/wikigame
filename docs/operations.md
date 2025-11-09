# 營運與監控指南

## 例行檢查

- **Vercel Logs**：登入 Vercel → Project → Deployments → Logs，過濾 `/api/start`、`/api/judge`，確認沒有大量 500 錯誤。
- **Upstash Metrics**：查看「Analytics」頁面監控每日指令數、流量峰值，避免超額。
- **Google AI 使用量**：於 Google AI Studio 檢查 Token 使用統計，若接近免費額度需提早準備付費方案或限流。

## 錯誤排除

| 錯誤碼 | 說明 | 處理方式 |
| ------ | ---- | -------- |
| `failed_to_start_session` | Wikipedia API 或 Upstash 寫入失敗 | 檢查 Wikipedia API 狀態、重試；確認 Upstash key 是否有效 |
| `judge_failed` | LLM 呼叫或資料檢索失敗 | 查看 Vercel 日誌中的錯誤堆疊，重試或通知維運 |
| `session_not_found` | Session 過期或不存在 | 提醒玩家重新開始；可調整 `SESSION_TTL` |
| `無法回答` 過多 | 代表 overlap 門檻過高或規則不足 | 調整 `TOP_K`、`OVERLAP_THRESHOLD`，或新增規則 |

## 調校建議

- **段落檢索**：`config.overlapThreshold` 預設 0.15，可視實際命中率調整。
- **規則擴充**：於 `rules/synonyms.js` 增補同義詞；在 `rules/engine.js` 增加新的規則邏輯。
- **LLM 模型**：如需更高品質，可改用 `gemini-1.5-pro`，但注意成本增加。

## 日誌策略

- Log 內容僅保留 `session_id`、`question`（可選遮蔽）與 `answer`、`evidence_index`。
- 若需更多追蹤資訊，可新增 `request_id` 或 Trace header，但避免記錄玩家個資。

## 安全與隱私

- 不在前端儲存完整條目；僅顯示回傳的單一段落。
- 請勿在 repo 或 commit 中洩漏 API 金鑰；所有秘密值存於 Vercel / GitHub Secrets。

## 災難復原

- 若 Upstash 資料遺失，影響僅為玩家當前 Session，可重新開始遊戲即可。
- 若 Gemini API 無法使用，可臨時 fallback 為規則式或返回 `無法回答`，並於前端顯示提示訊息。

---

> 建議每月檢視各服務的免費額度使用情況，必要時升級方案或增加限流。*** End Patch

