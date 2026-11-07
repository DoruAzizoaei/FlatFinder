# Real Estate App

A modern real estate web application built with React, TypeScript, Material UI and Firebase. The platform allows users to browse properties, manage listings, communicate with other users and save their favorite properties.

## Features

- User authentication and account management
- User profiles
- Browse available properties
- Create and manage property listings
- Add properties to favorites
- Real-time messaging between users
- Unread message notifications
- Role-based access control (Admin / User)
- Responsive user interface

## Tech Stack

**Frontend**

- React
- TypeScript
- Material UI (MUI)
- React Router
- CSS Modules

**Backend & Database**

- Firebase Authentication
- Cloud Firestore

**Development Tools**

- Vite
- Git & GitHub
- ESLint

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd YOUR_PROJECT_FOLDER
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

## Environment Configuration

Create a `.env.local` file in the root directory and configure your Firebase environment variables.

Example:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Never commit private credentials, service account keys or secrets to the repository.

## Project Purpose

This project was developed as a personal portfolio project to practice and demonstrate frontend development, TypeScript, component-based architecture, Firebase integration and real-world application features.

## Author

Doru Azizoaei

[GitHub](https://github.com/DoruAzizoaei?tab=repositories) · [LinkedIn](https://www.linkedin.com/in/doru-azizoaei-5a7726273/)
