const fs = require("fs");
const path = require("path");
const config = require("../config");

const QUESTION_PATH = path.join(__dirname, "../data/question.json");
const TROLL_PATH = path.join(__dirname, "../data/trollReplies.json");
const LEARN_PATH = path.join(__dirname, "../data/learnReplies.json");

function loadTrollReplies() {
  try {
    if (fs.existsSync(TROLL_PATH)) {
      return JSON.parse(fs.readFileSync(TROLL_PATH, "utf8"));
    }
  } catch (e) {}
  return [
    "tao không biết 😏",
    "hỏi google đi 🤡",
    "tao nghe mà không hiểu gì hết",
    "uhmmm... cho tao suy nghĩ lại xem",
    "kệ đi 😁",
    "tao lười trả lời lắm rồi"
  ];
}

function loadLearnReplies() {
  try {
    if (fs.existsSync(LEARN_PATH)) {
      return JSON.parse(fs.readFileSync(LEARN_PATH, "utf8"));
    }
  } catch (e) {}
  return ["tao chưa biết 😏 dạy tao đi!"];
}

let trollReplies = loadTrollReplies();
let learnReplies = loadLearnReplies();

function loadQuestionBrain() {
  try {
    if (fs.existsSync(QUESTION_PATH)) {
      return JSON.parse(fs.readFileSync(QUESTION_PATH, "utf8"));
    }
  } catch (e) {}
  return {};
}

let questionBrain = loadQuestionBrain();

const conversationHistory = new Map();

function saveQuestionBrain() {
  const currentData = fs.existsSync(QUESTION_PATH) 
    ? JSON.parse(fs.readFileSync(QUESTION_PATH, "utf8")) 
    : {};
  
  const merged = { ...currentData, ...questionBrain };
  
  for (const key of Object.keys(questionBrain)) {
    if (currentData[key]) {
      const existingAnswers = currentData[key];
      const newAnswers = questionBrain[key];
      const uniqueAnswers = [...new Set([...existingAnswers, ...newAnswers])];
      merged[key] = uniqueAnswers;
    } else {
      merged[key] = questionBrain[key];
    }
  }
  
  fs.writeFileSync(QUESTION_PATH, JSON.stringify(merged, null, 2));
  
  questionBrain = loadQuestionBrain();
}

function extractKey(text) {
  return text
    .replace(/<@!?\d+>/g, "")
    .replace(/[^\w\s\u00C0-\u024F\u1EA0-\u1EF9]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function cleanText(text) {
  return text.replace(/<@!?\d+>/g, "").replace(/\s+/g, " ").trim();
}

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

function findBestMatch(cleaned, threshold = 0.5) {
  let bestMatch = null;
  let bestScore = 0;

  const searchKeys = [
    cleaned,
    ...cleaned.split(/\s+/).filter(w => w.length > 2)
  ];

  for (const key of Object.keys(questionBrain)) {
    for (const searchKey of searchKeys) {
      const score = similarity(searchKey, key);
      if (score > bestScore && score >= threshold) {
        bestScore = score;
        bestMatch = key;
      }
    }
  }

  return bestMatch;
}

function getRandomTrollReply() {
  return trollReplies[Math.floor(Math.random() * trollReplies.length)];
}

function getRandomLearnReply() {
  return learnReplies[Math.floor(Math.random() * learnReplies.length)];
}

function learnFromConversation(userId, content) {
  if (!content || content.length < config.MIN_LEARN_LENGTH) return;

  const cleaned = cleanText(content);
  if (cleaned.length < 3) return;

  const pending = pendingQuestions.get(userId);
  if (pending && (Date.now() - pending.time) < 120000) {
    const qKey = extractKey(pending.question);
    const aKey = extractKey(cleaned);

    if (qKey.length >= 2 && aKey.length >= 2) {
      if (!questionBrain[qKey]) {
        questionBrain[qKey] = [];
      }
      if (!questionBrain[qKey].includes(aKey)) {
        questionBrain[qKey].push(aKey);
        saveQuestionBrain();
      }
    }
    pendingQuestions.delete(userId);
    return;
  }

  const cleanedKey = extractKey(cleaned);
  if (questionBrain[cleanedKey]) {
    return;
  }

  pendingQuestions.set(userId, {
    question: cleaned,
    time: Date.now()
  });
}

let pendingQuestions = new Map();

function generateReply(content) {
  const cleaned = extractKey(content);
  
  if (questionBrain[cleaned]) {
    return questionBrain[cleaned][Math.floor(Math.random() * questionBrain[cleaned].length)];
  }
  
  const words = cleaned.split(/\s+/).filter(w => w.length > 2);
  for (const word of words) {
    if (questionBrain[word]) {
      return questionBrain[word][Math.floor(Math.random() * questionBrain[word].length)];
    }
  }
  
  const bestMatch = findBestMatch(cleaned, 0.6);
  if (bestMatch) {
    return questionBrain[bestMatch][Math.floor(Math.random() * questionBrain[bestMatch].length)];
  }
  
  return null;
}

function handleMessage(userId, content) {
  const reply = generateReply(content);
  
  if (reply) {
    if (Math.random() < config.RANDOM_TROLL_RATE) {
      return getRandomTrollReply();
    }
    return reply;
  }
  
  const cleaned = cleanText(content);
  if (cleaned.length >= 3) {
    pendingQuestions.set(userId, {
      question: cleaned,
      time: Date.now()
    });
  }
  
  return getRandomLearnReply();
}

module.exports = {
  questionBrain,
  handleMessage,
  learnFromUser: learnFromConversation,
  saveQuestionBrain
};