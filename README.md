# SubFoxWatch 🦊

SubFoxWatch is a completely client-side Progressive Web App (PWA) designed to help you track your recurring subscriptions and expenses. It runs entirely in your browser and saves all data locally, ensuring your privacy.

## 🚀 Features

- **Client-Side Only**: No backend server required. All logic runs in the browser.
- **Local Data Persistence**: Your data is stored securely in your browser's `localStorage`.
- **Subscription Management**: Track Netflix, Spotify, Amazon, and more. Support for different currencies and billing cycles (monthly, yearly, etc.).
- **Dashboard Analytics**: Visualize your spending with monthly/yearly summaries and breakdown by tags.
- **PWA Ready**: Installable on your device for an app-like experience.
- **Dark Mode**: Sleek, premium dark-themed UI.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **PWA**: [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

## 🏁 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

- **Node.js**: You need Node.js installed (version 18 or higher recommended).
- **npm**: Comes bundled with Node.js.

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project folder:
    ```bash
    cd /path/to/SubFoxWatch
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Click the link shown in your terminal (usually `http://localhost:5173`).

## 🔐 Login Credentials

Since there is no backend, the app uses a hardcoded credential set for demonstration purposes:

- **Username**: `arioch1984`
- **Password**: `juzamdjin`

## 📱 Installing as PWA

1.  Open the app in Chrome or Edge.
2.  Look for the "Install" icon in the address bar (computer) or "Add to Home Screen" in the browser menu (mobile).
3.  Launch SubFoxWatch directly from your desktop or home screen!

## 📝 Notes

- **Data Safety**: Since data is stored in `localStorage`, clearing your browser cache/data will erase your subscriptions.
- **Currency**: The dashboard currently normalizes totals to EUR for the summary cards, but displays original currencies in the list.

---

*Built with ❤️ for personal finance tracking.*
