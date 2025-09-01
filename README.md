# 📂 ShareSphere – Smart Resource Sharing App

ShareSphere is a modern resource-sharing app that allows users to **send and receive large files seamlessly**.  
It combines **local storage sharing** for nearby transfers with **Google Drive cloud integration** for longer distances.  
The app compresses files before transfer for faster delivery and automatically decompresses them at the destination.  

---

## 🚀 Features

- 🔑 **Secure Authentication** – Firebase Authentication (Email/Password, Google Sign-In).
- 💾 **Smart File Sharing**  
  - Local storage sharing with device permission.  
  - Cloud sharing using Google Drive + Firebase Storage.  
  - Automatic file compression & decompression.
- 📡 **Offline & Online Transfers**  
  - Nearby transfers via **QR codes**.  
  - Remote transfers via cloud.
- 💬 **In-App Chat** – Communicate with friends before/during file sharing.
- 🖼️ **Supports All File Types** – Documents, images, videos, music, and more.
- 🎨 **Modern UI** – Clean, responsive, and intuitive design.
- 🔒 **Privacy First** – User controls their data; no unnecessary tracking.

---

## 🛠️ Tech Stack

- **Frontend**: Flutter / React Native (cross-platform mobile app)  
- **Backend**: Firebase (Authentication, Firestore, Cloud Storage, Hosting)  
- **Cloud Integration**: Google Drive API for extended storage  
- **Utilities**: Compression & Decompression libraries, QR code generation, Socket connections  

---

## 📂 Project Structure (Firebase + App)

/sharesphere
├── src
│ ├── auth/ # Authentication logic
│ ├── chat/ # Chat feature
│ ├── file-sharing/ # Upload, compress, transfer, download
│ ├── qr-code/ # QR generation & scanning
│ └── ui/ # Screens & components
├── firebase.json # Firebase hosting config
├── firestore.rules # Firestore security rules
├── storage.rules # Storage security rules
└── README.md # This file
