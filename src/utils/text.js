function cleanText(text) {
  return text
    .replace(/<@!?\d+>/g, "")
    .replace(/[^\w\s\u00C0-\u024F]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isValidLength(text, min, max) {
  return text.length >= min && text.length <= max;
}

function normalize(text) {
  return text.toLowerCase().trim();
}

function containsQuestion(text) {
  return /[?？]/.test(text);
}

function containsInsult(text) {
  const insults = [
    "đmm", "dm", "dmm", "đm", "đm m", "đ m",
    "cc", "cl", "vl", "vcl", "vkl",
    "lol", "lồn", "lon", "l0n",
    "cặc", "cak", "c4k",
    "đéo", "deo", "đếch",
    "ngu", "ngu lol", "óc chó", "oc cho",
    "con chó", "chó", "cho",
    "con lợn", "lợn", "lon",
    "đĩ", "di~", "d*i",
    "đần", "đần độn",
    "khùng", "điên", "ngáo",
    "cút", "biến mẹ", "biến đi",
    "rác", "phế vật",
    "não tàn", "thiểu năng"
  ];
  return insults.some(insult => text.toLowerCase().includes(insult));
}

module.exports = {
  cleanText,
  isValidLength,
  normalize,
  containsQuestion,
  containsInsult
};