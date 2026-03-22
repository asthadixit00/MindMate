const natural = require('natural');
const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const tokenizer = new natural.WordTokenizer();

const analyzer = new Analyzer('English', stemmer, 'afinn');

// Tag keyword mappings
const TAG_KEYWORDS = {
  burnout: ['burnout', 'exhausted', 'drained', 'overwhelmed', 'tired', 'overworked', 'burnt out', 'depleted'],
  anxiety: ['anxious', 'anxiety', 'nervous', 'panic', 'worried', 'stress', 'stressed', 'fear', 'scared'],
  focus: ['focus', 'concentrate', 'distracted', 'attention', 'productive', 'productivity', 'procrastinate'],
  sadness: ['sad', 'depressed', 'lonely', 'hopeless', 'unhappy', 'miserable', 'down', 'low'],
  motivation: ['motivated', 'inspired', 'energetic', 'excited', 'pumped', 'driven', 'goal'],
  sleep: ['sleep', 'tired', 'insomnia', 'rest', 'fatigue', 'nap', 'awake'],
};

/**
 * Analyze sentiment of a given text
 * @param {string} text - Input text
 * @returns {{ sentiment: string, score: number, tags: string[] }}
 */
function analyzeSentiment(text) {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const score = analyzer.getSentiment(tokens);

  let sentiment;
  if (score > 0.1) {
    sentiment = 'positive';
  } else if (score < -0.1) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }

  const tags = detectTags(text.toLowerCase());

  return { sentiment, score: parseFloat(score.toFixed(3)), tags };
}

/**
 * Detect emotional/behavioral tags from text
 * @param {string} text - Lowercased input text
 * @returns {string[]}
 */
function detectTags(text) {
  const detectedTags = [];
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      detectedTags.push(tag);
    }
  }
  return detectedTags;
}

module.exports = { analyzeSentiment };
