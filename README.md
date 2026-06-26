# Money Tracker

A simple mobile-first app for personal expense tracking and IOU management. All data stays on your device — no login, no cloud.

Works as a **web PWA**, or as an **Android APK** via Capacitor.

## Features

- Log income and expenses with categories
- Track money lent to and borrowed from people
- Settle up partial or full repayments
- Dashboard with cash balance and IOU summaries
- Searchable transaction history with filters
- Export/import JSON backups
- Works offline

## Web (browser / PWA)

```bash
npm install
npm run dev
```

Open the URL in your browser. On mobile: **Share → Add to Home Screen**.

## Android APK (Capacitor)

### One-time setup

1. Install [Android Studio](https://developer.android.com/studio) (includes Java JDK and Android SDK).
2. Open Android Studio once and complete the setup wizard.
3. In this project:

```bash
npm install
npm run android
```

This builds the web app, syncs it into the Android project, and opens Android Studio.

### Build the APK

In Android Studio:

1. Wait for **Gradle sync** to finish (first time can take several minutes).
2. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. When done, click **locate** in the notification. The debug APK is at:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Install on your phone

1. Copy `app-debug.apk` to your phone (AirDrop, USB, Google Drive, etc.).
2. On Android: enable **Install unknown apps** for your file manager or browser.
3. Tap the APK to install.

### After code changes

Whenever you change the app:

```bash
npm run cap:sync
```

Then rebuild the APK in Android Studio (or run on a connected device with the green ▶ button).

### Useful scripts

| Script | What it does |
|--------|----------------|
| `npm run dev` | Web dev server |
| `npm run build` | Production web build |
| `npm run cap:sync` | Build web app + copy into `android/` |
| `npm run android` | `cap:sync` + open Android Studio |
| `npm run android:open` | Open Android Studio without rebuilding |

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS
- Dexie (IndexedDB)
- Capacitor (Android)
- vite-plugin-pwa (web install)
