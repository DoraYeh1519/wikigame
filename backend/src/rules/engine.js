const yearRegex = /\b(1[0-9]{3}|20[0-9]{2})\b/;
const yearQuestionKeywords = ['出生', '成立', '創立', '成立於', 'born', 'founded', 'established', 'died', '去世', '死亡'];

function extractYears(text) {
  const matches = text.match(yearRegex);
  if (!matches) return [];
  return [...new Set(matches.map((v) => Number.parseInt(v, 10)))];
}

function isYearQuestion(question) {
  return yearQuestionKeywords.some((keyword) => question.toLowerCase().includes(keyword));
}

export function tryRuleAnswer(question, paragraphs) {
  const years = extractYears(question);
  if (!years.length || !isYearQuestion(question)) return null;

  for (let index = 0; index < paragraphs.length; index += 1) {
    const paragraph = paragraphs[index];
    const paragraphYears = extractYears(paragraph);
    const match = paragraphYears.find((year) => years.includes(year));
    if (match) {
      return {
        answer: '是',
        evidenceIndex: index,
        reason: 'year-match',
      };
    }
  }

  return null;
}

