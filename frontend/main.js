const startForm = document.getElementById('start-form');
const questionForm = document.getElementById('question-form');
const sessionInfo = document.getElementById('session-info');
const answerBox = document.getElementById('answer');

let sessionId = null;

function renderSessionInfo() {
  if (!sessionId) {
    sessionInfo.textContent = '尚未開始遊戲。';
    return;
  }
  sessionInfo.textContent = '已建立新遊戲，開始提問吧！';
}

function renderAnswer(result) {
  if (!result) {
    answerBox.textContent = '';
    return;
  }
  const { answer } = result;
  answerBox.textContent = `回答：${answer ?? '無法判斷'}`;
}

startForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  answerBox.textContent = '建立遊戲中...';

  try {
    const response = await fetch('/api/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error(`start failed with status ${response.status}`);
    }
    const data = await response.json();
    sessionId = data.session_id;
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

