<div align="center">

# 🛠️ AnyTools

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[![GitHub stars](https://img.shields.io/github/stars/xuantruongg03/anytools?style=social)](https://github.com/xuantruongg03/anytools/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/xuantruongg03/anytools?style=social)](https://github.com/xuantruongg03/anytools/network/members)
[![GitHub issues](https://img.shields.io/github/issues/xuantruongg03/anytools?style=flat-square)](https://github.com/xuantruongg03/anytools/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/xuantruongg03/anytools?style=flat-square)](https://github.com/xuantruongg03/anytools/pulls)

**Free, fast, and privacy-friendly online utilities for developers, designers, and content creators.**

[🌐 Live Demo](https://anytools.online) • [📖 Documentation](#-getting-started) • [🐛 Report Bug](https://github.com/xuantruongg03/anytools/issues) • [💡 Request Feature](https://github.com/xuantruongg03/anytools/discussions)

</div>

---

## 📋 About

AnyTools is a **100% free and open-source** collection of web-based tools that run entirely in your browser. No data is sent to any server - everything happens locally on your device.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🌍 **Bilingual** | Full support for English and Vietnamese |
| 🌓 **Dark Mode** | Beautiful UI with automatic dark mode |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |
| 🔒 **Privacy First** | All processing happens in your browser |
| 🆓 **100% Free** | No subscriptions, no ads, no tracking |
| 🔓 **Open Source** | MIT Licensed - fork & customize freely |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Quick Start

```bash
# Clone the repository
git clone https://github.com/xuantruongg03/anytools.git
cd anytools

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## 🏗️ Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
<br>Next.js 16
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br>TypeScript 5
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br>Tailwind v4
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br>React 19
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=vercel" width="48" height="48" alt="Vercel" />
<br>Vercel
</td>
</tr>
</table>

---

## 📂 Project Structure

```
anytools/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Internationalized routes
│   │   ├── tools/           # Tool pages
│   │   │   └── [tool-name]/
│   │   │       ├── page.tsx           # Server component (SEO)
│   │   │       ├── [Tool]Content.tsx  # i18n wrapper
│   │   │       └── [Tool]Client.tsx   # Tool logic
│   │   ├── about/           # About page
│   │   └── page.tsx         # Homepage
│   └── api/                 # API routes
├── src/
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities & helpers
│   │   ├── i18n/           # Internationalization
│   │   └── utils/          # Helper functions
│   ├── constants/          # App constants
│   └── types/              # TypeScript types
├── public/                  # Static assets
└── README.md
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Quick Contribution Guide

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-tool`
3. **Commit** your changes: `git commit -m "Add: amazing tool"`
4. **Push** to branch: `git push origin feature/amazing-tool`
5. **Open** a Pull Request

### Adding a New Tool

```bash
# 1. Create tool folder
mkdir -p app/[locale]/tools/my-tool

# 2. Create required files
# - page.tsx (Server component with SEO)
# - MyToolContent.tsx (i18n wrapper)
# - MyToolClient.tsx (Tool logic)

# 3. Add translations to src/lib/i18n/

# 4. Add to tools config in src/config/tools.ts
```

See existing tools in `app/[locale]/tools/` for reference.

---

## 🌐 Internationalization

```typescript
import { useLanguage } from "@/lib/hooks/useLanguage";

export default function MyComponent() {
    const { locale, t } = useLanguage();
    return <h1>{t.myTool.title}</h1>;
}
```

---

## ⚡ Instant Indexing (IndexNow / Bing Search)

AnyTools uses the **[IndexNow](https://www.indexnow.org/)** protocol to instantly notify search engines (**Bing**, **Yandex**, **Seznam**, **Naver**) whenever new tools or pages are added or updated.

### 🔑 IndexNow Key Configuration

1. **Where to get or generate an IndexNow key:**
   - **IndexNow.org:** Visit [IndexNow.org](https://www.indexnow.org/) and click **"Generate Key"** to get a 32-character key and download the key `.txt` file.
   - **Bing Webmaster Tools:** Log in to [Bing Webmaster Tools](https://www.bing.com/webmasters) > click the **Settings (⚙️)** icon in the top right > **API access** > **API Key**.

2. **Where the key is configured in this project:**
   - **Verification file:** `public/<KEY>.txt` (e.g. [public/key.txt](public/key.txt)) - contains only the key string.
   - **Environment variable:** `INDEXNOW_KEY` in `.env` (and Vercel Environment Variables).
   - **Code references:** 
     - [src/lib/indexnow.ts](src/lib/indexnow.ts) (API helper & `generateToolUrls()`)
     - [scripts/submit-indexnow.mjs](scripts/submit-indexnow.mjs) (CLI submission script)

### 🚀 Submitting URLs to Bing / IndexNow

You can submit newly added tools or all pages directly from the command line:

```bash
# 1. Submit a specific tool (submits /en, /vi, and root URLs)
npm run indexnow auto-bing-search

# 2. Submit all tools (all 62 tools in EN & VI + home & tools pages)
npm run indexnow

# 3. Submit custom URLs
node scripts/submit-indexnow.mjs https://anytools.online/custom-page
```

Submitted URLs will immediately appear in your **Bing Webmaster Tools** > **IndexNow** dashboard.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## ☕ Support the Project

If you find AnyTools useful, consider supporting its development:

<div align="center">

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/lexuantruoa)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/lexuantruong098)

</div>

**Other ways to support:**
- ⭐ **Star** this repository
- 🐛 **Report bugs** via [Issues](https://github.com/xuantruongg03/anytools/issues)
- 💡 **Suggest features** via [Discussions](https://github.com/xuantruongg03/anytools/discussions)
- 🤝 **Contribute** code or documentation

---

## 📞 Contact

<div align="center">

[![Website](https://img.shields.io/badge/Website-anytools.online-blue?style=for-the-badge&logo=google-chrome&logoColor=white)](https://anytools.online)
[![GitHub](https://img.shields.io/badge/GitHub-xuantruongg03-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/xuantruongg03)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail&logoColor=white)](mailto:xuantruongg03@gmail.com)

</div>

---

## 🌟 Star History

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=xuantruongg03/anytools&type=Date)](https://star-history.com/#xuantruongg03/anytools&Date)

</div>

---

<div align="center">

**Made with ❤️ by [Xuan Truong](https://github.com/xuantruongg03) and the open-source community**

<sub>© 2024-2026 AnyTools. All rights reserved.</sub>

</div>
