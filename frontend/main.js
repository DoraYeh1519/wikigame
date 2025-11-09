const startForm = document.getElementById('start-form');
const questionForm = document.getElementById('question-form');
const sessionInfo = document.getElementById('session-info');
const answerBox = document.getElementById('answer');

let sessionId = null;
let currentTitle = null;

function renderSessionInfo() {
  if (!sessionId) {
    sessionInfo.textContent = '尚未開始遊戲。';
    return;
  }
  sessionInfo.textContent = `Session: ${sessionId}\n條目：${currentTitle}`;
}

function renderAnswer(result) {
  if (!result) {
    answerBox.textContent = '';
    return;
  }
  const { answer, evidence, evidence_index: evidenceIndex } = result;
  const lines = [
    `回答：${answer ?? '無法回答'}`,
  ];
  if (typeof evidenceIndex === 'number') {
    lines.push(`證據段落 #${evidenceIndex}`);
  }
  if (evidence) {
    lines.push('---');
    lines.push(evidence);
  }
  answerBox.textContent = lines.join('\n');
}

startForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  answerBox.textContent = '建立遊戲中...';
  const formData = new FormData(startForm);
  const title = formData.get('title');

  try {
    const response = await fetch('/api/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title || undefined }),
    });
    if (!response.ok) {
      throw new Error(`start failed with status ${response.status}`);
    }
    const data = await response.json();
    sessionId = data.session_id;
    currentTitle = data.title;
    renderSessionInfo();
    renderAnswer(null);
  } catch (error) {
    answerBox.textContent = `建立遊戲失敗：${error.message}`;
  }
});

questionForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!sessionId) {
    answerBox.textContent = '請先開始新遊戲。';
    return;
  }

  const formData = new FormData(questionForm);
  const question = formData.get('question');
  if (!question) {
    answerBox.textContent = '請輸入問題。';
    return;
  }

  answerBox.textContent = '判斷中...';
  try {
    const response = await fetch('/api/judge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, question }),
    });
    if (!response.ok) {
      throw new Error(`judge failed with status ${response.status}`);
    }
    const data = await response.json();
    renderAnswer(data);
  } catch (error) {
    answerBox.textContent = `判斷失敗：${error.message}`;
  }
});

renderSessionInfo();

