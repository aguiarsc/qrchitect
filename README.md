# QRCHITECT

Minimalist QR code generator web application that allows users to create beautifully styled QR codes with a nice design aesthetic.

![Image](https://github.com/user-attachments/assets/7f937c9b-4f1e-4e42-bee6-80e6f502bf18)

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
