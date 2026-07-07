# Votion - Fullstack Notion Clone

![Votion Logo](./public/logo.svg?theme=light)
![Votion Logo](./public/logo-dark.svg?theme=dark)

Votion is a Notion-style workspace built with Next.js, React, Convex, and Tailwind. Create, organize, and publish notes with real-time sync, rich editing, and authentication.

**Maintained by:** [vedjr02](https://github.com/vedjr02)

## Key Features

- **Real-time Database:** Keep your data synchronized across users in real-time.
- **Notion-style Editor:** A powerful editor inspired by Notion's user interface.
- **Light and Dark Mode:** Toggle between light and dark modes for a comfortable reading experience.
- **Infinite Children Documents:** Organize your content hierarchically with infinite children documents.
- **Trash Can & Soft Delete:** Safely delete documents with the ability to recover them from the trash can.
- **Authentication:** Secure your application with user authentication.
- **File Management:** Upload, delete, and replace files within your documents.
- **Live Icons:** Enjoy real-time updates to icons for each document.
- **Expandable Sidebar:** Easily navigate through your documents with an expandable sidebar.
- **Full Mobile Responsiveness:** Access Votion seamlessly on various devices.
- **Web Publishing:** Share your notes with the world by publishing them to the web.
- **Collapsible Sidebar:** Maximize your workspace with a fully collapsible sidebar.
- **Landing Page:** Welcome users with an engaging landing page.
- **Cover Image:** Customize each document with a cover image.
- **Recover Deleted Files:** Restore accidentally deleted files.

## Getting Started

### Prerequisites

**Node version 18.x.x or later**

### Cloning the repository

```shell
git clone git@github.com:vedjr02/Votion.git
cd Votion
```

### Install packages

```shell
npm i
```

### Setup .env file

```js
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=
```

### Setup Convex

```shell
npx convex dev
```

### Start the app

```shell
npm run dev
```

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Convex](https://www.convex.dev/)
- [Clerk](https://clerk.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [BlockNote](https://www.blocknotejs.org/)

## License

This project is open source. See the repository for license details.
