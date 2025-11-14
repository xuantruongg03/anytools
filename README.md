# 🛠️ AnyTools

**Free, fast, and privacy-friendly online utilities for developers, designers, and content creators.**

AnyTools is a 100% free and open-source collection of web-based tools that run entirely in your browser. No data is sent to any server - everything happens locally on your device.

---

## ✨ Features
- **🌍 Bilingual Support**: Full support for English and Vietnamese (Tiếng Việt).
- **🌓 Dark Mode**: Beautiful UI with automatic dark mode support.
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile devices.
- **🆓 100% Free**: No subscriptions, no ads, no tracking.
- **🔓 Open Source**: Contribute, fork, and customize as you need.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/xuantruongg03/anytools.git
cd anytools

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev

# Open http://localhost:3000 in your browser
```

The page auto-updates as you edit files. Start by modifying `app/page.tsx`.

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

---

## 🏗️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **UI Library**: [React 19](https://react.dev)
- **Internationalization**: Custom i18n implementation with server/client components
- **Font**: [Geist Font Family](https://vercel.com/font) optimized with `next/font`

---

## 📂 Project Structure

```
anytools/
├── app/                      # Next.js App Router
│   ├── tools/               # Tool pages
│   │   ├── [tool-name]/
│   │   │   ├── page.tsx           # Server component (SEO metadata)
│   │   │   ├── [Tool]Content.tsx  # Client component (i18n content)
│   │   │   └── [Tool]Client.tsx   # Tool logic component
│   ├── about/               # About page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── lib/
│   │   └── i18n/           # Internationalization
│   │       ├── translations.ts
│   │       └── LanguageContext.tsx
│   └── contexts/            # React contexts
├── public/                  # Static assets
└── README.md
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/xuantruongg03/anytools.git
   cd anytools
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-new-tool
   ```
4. **Make your changes**:
   - Add new tools in `app/tools/[tool-name]/`
   - Update translations in `src/lib/i18n/translations.ts`
   - Add tool to homepage in `app/page.tsx`
5. **Test your changes**:
   - Test in both light and dark modes
   - Test in both English and Vietnamese
   - Ensure responsive design works
6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: [Brief description of your changes]"
   ```
7. **Push to your fork**:
   ```bash
   git push origin feature/your-new-tool
   ```
8. **Create a Pull Request** on GitHub

### Adding a New Tool

Each tool follows a consistent architecture:

1. Create folder: `app/tools/[tool-name]/`
2. Create three files:
   - `page.tsx` - Server component with SEO metadata
   - `[Tool]Content.tsx` - Client component with i18n content wrapper
   - `[Tool]Client.tsx` - Interactive tool logic
3. Add translations to `src/lib/i18n/translations.ts`
4. Add tool card to homepage `app/page.tsx`

See existing tools for reference (e.g., `app/tools/base64/`).

---

## 🌐 Internationalization

AnyTools supports multiple languages through a custom i18n implementation:

- **Server Components**: Use `generateMetadata()` for SEO with bilingual keywords
- **Client Components**: Use `useLanguage()` hook to access current locale
- **Translations**: Centralized in `src/lib/i18n/translations.ts`

Example:
```typescript
import { useLanguage } from "@/src/contexts/LanguageContext";
import { getTranslation } from "@/src/lib/i18n/translations";

export default function MyComponent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    
    return <h1>{t.tools.myTool.title}</h1>;
}
```

---

## 🎨 Dark Mode

Dark mode is implemented using Tailwind CSS with the `dark:` variant:

```tsx
<div className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">
    {/* Your content */}
</div>
```

The theme is automatically detected from system preferences and can be toggled by users.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Support

If you find AnyTools useful:

- ⭐ **Star this repository** on GitHub
- 🐛 **Report bugs** via [GitHub Issues](https://github.com/xuantruongg03/anytools/issues)
- 💡 **Suggest features** via [GitHub Discussions](https://github.com/xuantruongg03/anytools/discussions)
- 🤝 **Contribute** by submitting pull requests

---

## 📞 Contact

- **Website**: [anytools.vercel.app](https://anytools.vercel.app)
- **GitHub**: [github.com/xuantruongg03/anytools](https://github.com/xuantruongg03/anytools)
- **Issues**: [GitHub Issues](https://github.com/xuantruongg03/anytools/issues)

---

<div align="center">
Made with ❤️ by the open-source community
</div>
