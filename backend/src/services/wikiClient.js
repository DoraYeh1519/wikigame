import { fetch } from 'undici';

const ENDPOINT = 'https://en.wikipedia.org/w/api.php';

function buildUrl(params) {
  const url = new URL(ENDPOINT);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

function extractPageData(data) {
  if (!data?.query?.pages) {
    throw new Error('Invalid response from Wikipedia');
  }

  const pages = Object.values(data.query.pages);
  if (!pages.length || pages[0].missing === '') {
    throw new Error('Article not found');
  }

  const [page] = pages;
  const title = page.title;
  const extract = page.extract ?? '';
  return { title, extract, pageId: page.pageid };
}

export async function fetchRandomArticle() {
  const url = buildUrl({
    action: 'query',
    format: 'json',
    prop: 'extracts',
    explaintext: 'true',
    redirects: '1',
    generator: 'random',
    grnnamespace: '0',
    grnlimit: '1',
  });

  const response = await fetch(url, { headers: { 'User-Agent': 'wikigame/1.0 (https://wikigame-two.vercel.app/)' } });
  if (!response.ok) {
    throw new Error(`Wikipedia request failed: ${response.status}`);
  }
  const json = await response.json();
  return extractPageData(json);
}

