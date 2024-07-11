# MEDELEN - Democratizing Access to Physical Therapy Equipment

## Table of Contents
1. [About Medelen](#about-medelen)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Development](#development)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)

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
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage services
   - Copy your Firebase configuration to `firebase-config.js`

2. Environment Variables:
   - Create a `.env.local` file in the root directory
   - Add necessary environment variables (e.g., Firebase config, API keys)

3. Tailwind CSS:
   - Ensure `tailwind.config.ts` is properly configured for your project

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

For support or inquiries, please contact us at support@medelen.com or visit [www.medelen.com](https://www.medelen.com).