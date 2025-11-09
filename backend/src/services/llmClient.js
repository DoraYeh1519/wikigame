import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config.js';

const SYSTEM_PROMPT =
  '你是遊戲裁判。僅根據下面提供的【唯一】段落文字做判斷；不得使用任何模型常識或網路知識。只輸出一個中文詞：是 / 否 / 無關 / 無法回答。若段落沒有足夠資訊，回「無法回答」。不要輸出其他文字或標點。';

const ALLOWED_ANSWERS = new Set(['是', '否', '無關', '無法回答']);

let client;
let modelFactoryOverride = null;

export function setModelFactory(factory) {
  modelFactoryOverride = factory;
  client = null;
}

function getModel() {
  if (modelFactoryOverride) {
    return modelFactoryOverride();
  }
  if (!client) {
    client = new GoogleGenerativeAI(config.geminiApiKey);
  }
  return client.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });
}

export async function askGemini({ paragraph, index, question }) {
  const model = getModel();

  const userPrompt = `段落 (段落編號: ${index}):\n"${paragraph}"\n\n玩家問題: "${question}"`;

  const response = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0,
      topP: 1.0,
      maxOutputTokens: 16,
    },
  });

  const text = response?.response?.text?.() ?? '';
  const normalized = text.trim();
  return ALLOWED_ANSWERS.has(normalized) ? normalized : '無法回答';
}

