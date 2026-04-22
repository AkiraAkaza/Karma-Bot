<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1307371181829259294/1496518453731922021/1776867958053.png?ex=69ea2ceb&is=69e8db6b&hm=8c518408330da149b597b55c5c2d6b8f462982b2165e4eb7227726c11189a1f7" alt="Karma Bot Banner" width="100%">
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
</p>

---

<h1 align="center">KARMA BOT</h1>
<h2 align="center">Discord Selfbot tự động trả lời tin nhắn với khả năng học và phản hồi thông minh</h2>

## 📋 Mô tả

Karma Bot là một Discord selfbot được viết bằng Node.js, sử dụng thư viện discord.js-selfbot-v13. Bot có khả năng:

- **Tự động trả lời** tin nhắn trong channel được cấu hình
- **Học từ cuộc hội thoại** - lưu trữ câu hỏi và câu trả lời để sử dụng sau
- **So khớp thông minh** - sử dụng thuật toán Levenshtein để tìm câu trả lời phù hợp nhất
- **Phản hồi ngẫu nhiên** - đa dạng câu trả lời với tỷ lệ ngẫu nhiên

## 🛠️ Công nghệ

| Công nghệ | Mô tả |
|-----------|-------|
| Node.js | Môi trường runtime |
| discord.js-selfbot-v13 | Thư viện Discord API |
| dotenv | Quản lý biến môi trường |

## 📁 Cấu trúc dự án

```
karma-bot/
├── src/
│   ├── index.js         # Entry point - khởi tạo bot
│   ├── config.js        # Cấu hình bot
│   ├── discord/
│   │   └── messageHandler.js   # Xử lý tin nhắn
│   ├── core/
│   │   └── sim.js      # Engine xử lý hội thoại & học
│   ├── utils/
│   │   └── text.js    # Tiện ích xử lý text
│   └── data/
│       ├── question.json     # Brain - câu hỏi & câu trả lời
│       ├── trollReplies.json  # Câu trả lời troll
│       └── learnReplies.json  # Câu khi chưa học được
├── .env               # Biến môi trường
├── package.json       # Dependencies và scripts
└── README.md          # Documentation
```

## ⚡ Cài đặt

```bash
# Clone repository
git clone https://github.com/AkiraAkaza/karma-bot.git
cd karma-bot

# Install dependencies
npm install

# Chạy bot
npm start
```

## ⚙️ Cấu hình (.env)

Tạo file `.env` với các biến sau:

```env
# Token Discord của bạn
TOKEN=your_discord_token

# Channel ID để bot reply
CHANNEL_ID=your_target_channel_id
```

## 🔑 Hướng dẫn lấy Discord SelfBot Token

Run code (Discord Console - [Ctrl + Shift + I])

```javascript
window.webpackChunkdiscord_app.push([
  [Symbol()],
  {},
  req => {
    if (!req.c) return;
    for (let m of Object.values(req.c)) {
      try {
        if (!m.exports || m.exports === window) continue;
        if (m.exports?.getToken) return copy(m.exports.getToken());
        for (let ex in m.exports) {
          if (m.exports?.[ex]?.getToken && m.exports[ex][Symbol.toStringTag] !== 'IntlMessagesProxy') return copy(m.exports[ex].getToken());
        }
      } catch {}
    }
  },
]);

window.webpackChunkdiscord_app.pop();
console.log('%cWorked!', 'font-size: 50px');
console.log(`%cYou now have your token in the clipboard!`, 'font-size: 16px');
```

> ⚠️ **Lưu ý**: Không chia sẻ token công khai hoặc bất kỳ ai khác.

## 🔧 Cấu hình nâng cao (src/config.js)

```javascript
module.exports = {
  TOXIC_LEVEL: 3,           // Mức độ toxic (1-10)
  MAX_REPLY_PER_KEY: 10,    // Số câu trả lời tối đa cho mỗi key
  MIN_LEARN_LENGTH: 3,        // Độ dài tối thiểu để học
  MAX_LEARN_LENGTH: 100,      // Độ dài tối đa để học
  RANDOM_TROLL_RATE: 0.25,   // Tỷ lệ reply ngẫu nhiên (25%)
  AUTO_REPLY: true,         // Bật/tắt auto reply
  CHANNEL_ID: process.env.CHANNEL_ID
};
```

## 🎯 Tính năng chi tiết

### 1. Học từ cuộc hội thoại
Bot lưu cặp câu hỏi - câu trả lời khi người dùng nhập liên tiếp trong vòng 120 giây:

```
User: Xin chào
Bot: chào cc, server này đéo tiếp...
User: Hi there!
Bot: Reply đã học -> "chào cc, server này đéo tiếp..."
```

### 2. Tìm kiếm câu trả lời
| Phương thức | Mô tả |
|-------------|-------|
| Exact match | So khớp chính xác với key đã học |
| Word match | Tìm theo từng từ riêng lẻ (length > 2) |
| Fuzzy match | Levenshtein distance với threshold 0.6 |

### 3. Xử lý text
- Clean mention `@user`, `@!123456`
- Loại bỏ ký tự đặc biệt
- Chuẩn hóa Unicode tiếng Việt (à-ự)

## 📊 Demo

```
┌─────────────────────────────────────────┐
│  User: Xin chào bot ơi                   │
│  Bot: Chào cc, server này đéo tiếp...   │
├─────────────────────────────────────────┤
│  User: bot ngu qua                       │
│  Bot: ngu mà bạn vẫn nói chuyện à 😏   │
├─────────────────────────────────────────┤
│  User: hỏi thật mà                    │
│  Bot: Tao không biết 😏 dạy tao đi!     │
└─────────────────────────────────────────┘
```

## 📝 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<div align="center">

Made with ❤️ AkiraAkaza

![Discord](https://img.shields.io/badge/Chat-Discord-7289DA?style=for-the-badge&logo=discord)

</div>
