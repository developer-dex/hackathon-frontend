# Todo Application

A modern Todo application built with Next.js, TypeScript, and Tailwind CSS following clean architecture principles and atomic design.

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Prioritize tasks with high, medium, or low priority
- Set due dates for tasks
- Filter and sort tasks
- Responsive design

## Architecture

The application is built with a layered architecture:

### Domain Layer

- Contains business logic, entities, and interfaces
- Independent of any framework or external concerns

### Application Layer

- Use cases that orchestrate the flow of data between UI and domain
- Contexts for state management
- Custom hooks leveraging use cases

### Infrastructure Layer

- API implementations
- Repository implementations

### Presentation Layer (UI)

- Follows atomic design principles
- Atoms: Basic UI components (Button, Badge)
- Molecules: Composed components (TaskItem)
- Organisms: Complex components (TaskList, TaskForm)
- Templates: Page layouts (TasksTemplate)

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm 7.x or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Testing

Run the test suite with:

```bash
npm run test
```

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Jest](https://jestjs.io/) - Testing framework

## Project Structure

```
src/
├── pages/                      # Next.js page router
├── components/                 # UI components using Atomic Design
│   ├── atoms/                  # Basic UI elements
│   ├── molecules/              # Composite components
│   ├── organisms/              # Complex UI sections
│   └── templates/              # Page layouts
├── application/                # Application layer
│   ├── useCases/               # Business logic use cases
│   ├── services/               # Services orchestrating use cases
│   ├── contexts/               # React contexts for state
│   └── hooks/                  # Custom hooks
├── domain/                     # Domain layer
│   ├── entities/               # Business entities
│   ├── interfaces/             # Repository interfaces
│   ├── errors/                 # Domain-specific errors
│   └── validators/             # Validation logic
└── infrastructure/             # Infrastructure layer
    ├── repositories/           # Repository implementations
    └── api/                    # API service implementations
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
