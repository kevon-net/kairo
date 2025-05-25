# Next.js Site Template

A lightweight and optimized Next.js template for building fast, SEO-friendly websites.

## Features

- **Next.js 14 (App Router)** – Modern, efficient, and optimized for site generation.
- **TypeScript Support** – Ensures type safety and better development experience.
- **CSS Modules** – Scoped styling for better maintainability.
- **ESLint & Prettier** – Enforced code quality and formatting.
- **Fast & SEO-Friendly** – Optimized for performance and search engine indexing.
- **Minimal Dependencies** – No unnecessary bloat; easy to customize.

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/devokrann/template-next.git
cd template-next
```

### 2. Install Dependencies

```sh
npm install
# or
yarn install
```

### 3. Run the Development Server

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the template in action.

### 4. Build for Production

```sh
npm run build
# or
yarn build
```

### 5. Export Static Files

```sh
npm run export
# or
yarn export
```

This generates a fully static version of the site inside the `out` directory.

## Folder Structure

```
template-next/
├── public/             # Static assets (images, favicon, etc.)
├── src/
│   ├── components/     # Reusable UI components
│   ├── app/            # Page routes
│   ├── styles/         # Global and module-based styles
│   ├── utils/          # Utility functions
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── next.config.js      # Next.js configuration
├── package.json        # Project metadata and scripts
└── README.md           # Project documentation
```

## Deployment

This template is optimized for deployment on platforms like:

- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages (via static export)**

### Deploying to Vercel

```sh
npx vercel
```

Follow the on-screen instructions to complete the deployment.

## Contributing

Feel free to submit issues or pull requests to improve this template.

## License

This project is licensed under the [MIT License](LICENSE).
