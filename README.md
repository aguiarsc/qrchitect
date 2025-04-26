# QRCHITECT

Minimalist QR code generator web application that allows users to create beautifully styled QR codes with a nice design aesthetic.

## ✨ Features

- **Multiple Content Types**:
  - URLs with automatic protocol prefixing
  - Email addresses with mailto: formatting
  - Phone numbers with tel: formatting
  - Plain text content with multiline support

- **Advanced Customization**:
  - Precise color selection for foreground and background
  - Multiple dot style options (square, dots, rounded)
  - Eye frame customization (square, circle, rounded)
  - Eye ball customization (square, circle, diamond)

- **Premium Experience**:
  - Logo upload to embed in your QR code
  - Live preview of changes
  - Export in PNG or SVG format
  - Dark and light mode support
  - Responsive design for all screen sizes including ultrawide displays

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS v4 with JIT
- **UI Components**: Shadcn UI for clean, customizable components
- **Form Management**: React Hook Form with Zod validation
- **QR Code Generation**: qr-code-styling library for flexible QR styling

## 🖥️ Screenshots

<div align="center">
  <i>Light and dark mode versions of QRCHITECT</i>
</div>

## 🛠️ Development

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/qrchitect.git
cd qrchitect

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

## 🎨 Design Philosophy

QRCHITECT follows a luxury, minimalist design approach with these principles:

- **Simplicity**: Clean, uncluttered interfaces with generous whitespace
- **Premium Feel**: Subtle animations, soft shadows, and elegant typography
- **Performance**: Lightweight, fast loading, minimal dependencies
- **Accessibility**: Support for keyboard navigation, proper contrast, and semantic HTML
