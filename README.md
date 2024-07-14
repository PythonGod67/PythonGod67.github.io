# MEDELEN - Democratizing Access to Physical Therapy Equipment

## Table of Contents
1. [About Medelen](#about-medelen)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Environment Variables](#environment-variables)
7. [Running the Application](#running-the-application)
8. [Development](#development)
9. [Deployment](#deployment)
10. [Security](#security)
11. [Contributing](#contributing)
12. [License](#license)

## About Medelen

Medelen is an innovative platform designed to revolutionize access to physical therapy equipment. Our mission is to create a sharing economy for medical devices, connecting those who need physical therapy equipment with those who have equipment to rent. By doing so, we aim to:

- Make physical therapy more accessible and affordable
- Reduce waste by maximizing the use of existing equipment
- Create economic opportunities for equipment owners
- Support the recovery and rehabilitation journey of patients

Through our platform, users can easily list their unused equipment, while those in need can find and rent the necessary tools for their recovery, all within a secure and user-friendly environment.

## Project Structure

```
medelen-website/
├── .next/
├── app/
├── components/
├── hooks/
├── lib/
├── node_modules/
├── public/
├── utils/
├── .env.example
├── .env.local
├── .eslintrc.json
├── .gitattributes
├── .gitignore
├── components.json
├── database.rules.json
├── firebase-config.js
├── firestore.rules
├── LICENSE
├── next-env.d.ts
├── next.config.js
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later) or yarn (v1.22.0 or later)
- Git

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/medelen-website.git
   cd medelen-website
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Additional installations:
   - Tailwind CSS:
     ```
     npm install -D tailwindcss postcss autoprefixer
     npx tailwindcss init -p
     ```
   - Firebase:
     ```
     npm install firebase
     ```
   - React Query:
     ```
     npm install @tanstack/react-query
     ```
   - Other dependencies (adjust as needed):
     ```
     npm install @radix-ui/react-switch lucide-react class-variance-authority clsx tailwind-merge
     ```

## Configuration

1. Firebase Setup:
   - Create a brand new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage services
   - Set up your Firebase configuration (see [Environment Variables](#environment-variables) section)

2. Tailwind CSS:
   - Ensure `tailwind.config.ts` is properly configured for your project

## Environment Variables

1. Create a `.env.local` file in the root directory of your project.

2. Add the following environment variables to your `.env.local` file:

   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   REACT_APP_FIREBASE_DATABASE_URL=your_database_url
   ```

3. Replace `your_*` with your actual Firebase configuration values.

4. Create a `.env.example` file with the same structure but without actual values:

   ```
   REACT_APP_FIREBASE_API_KEY=
   REACT_APP_FIREBASE_AUTH_DOMAIN=
   REACT_APP_FIREBASE_PROJECT_ID=
   REACT_APP_FIREBASE_STORAGE_BUCKET=
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
   REACT_APP_FIREBASE_APP_ID=
   REACT_APP_FIREBASE_MEASUREMENT_ID=
   REACT_APP_FIREBASE_DATABASE_URL=
   ```

5. Add `.env.local` to your `.gitignore` file to prevent committing sensitive information.

## Running the Application

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

- The `app/` directory contains the main pages and routing of the application
- React components are stored in the `components/` directory
- Custom hooks can be found in the `hooks/` directory
- Utility functions are in the `utils/` directory
- The `lib/` directory contains shared code and configurations

## Deployment

1. Build the application:
   ```
   npm run build
   ```

2. Deploy to your preferred hosting platform (e.g., Vercel, Netlify)

For Vercel deployment:
- Connect your GitHub repository to Vercel
- Configure environment variables in the Vercel dashboard
- Vercel will automatically deploy on pushes to the main branch

## Security

To maintain the security of your application:

1. Never commit sensitive information like API keys directly in your code.
2. Use environment variables for all sensitive information.
3. Keep your `.env.local` file secure and never share it publicly.
4. Regularly rotate your API keys and update them in your local `.env.local` file and deployment environment.
5. Use Firebase Security Rules to secure your Firestore and Realtime Database.
6. Implement proper authentication and authorization in your application.

## Contributing

We welcome contributions to Medelen! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For support or inquiries, please contact us at support@medelen.org or visit [www.medelen.org](https://www.medelen.org).