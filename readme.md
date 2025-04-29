# Project Overview

## Frontend Design Decisions 🎨

### UI/UX

- Adopted Founder's arm's green and black color scheme for brand consistency
- Utilized shadcn UI components for a clean, modern interface
- managed client side state with zustand
- manages server side state(data fetching) on the client with react-query
- Loading skeleton for user experience
- Added toast notifications for user feedback

### Features

- signup and login with email and password powered by supabase
- protected the dashboard with supabase session token
- Built a Kanban board with drag-and-drop functionality (inspired by Trello/Jira)
- Implemented drag-and-drop with dndkit for smoother user experience
- Implemented optimistic updates to api calls for smooth UX with appropriate fallbacks

### Technical Stack

- **State Management**: Zustand (with localStorage persistence where necessary)
- **Data Fetching**: TanStack Query + Axios
- **Routing**: React Router with protected routes
- **Auth**: Supabase
- **Styling**: TailwindCSS
- **UI Components**: Shadcn UI

## Backend Design Decisions 🛠️

### Architecture

- route - controller - service - architecture

  - route: handles incoming requests and delegates to controller
  - controller: handles business logic and calls service to interact with the database
  - service: interacts with the database and performs necessary operations

- Custom error handling with extended Error classes
- Protected endpoints with custom middleware extending supabase auth
- Request validation for body and params using zod
- Environment-based logic handling (development/production)

### Technical Stack

- **Database**: PostreSQL through supabase
- **ORm**: Prisma (Supabase db triggers for consistency)
- **Routing**: Express
- **Validation**: Zod
- **LOGGING**: Pino

## Getting Started 🚀

## ai assisntant use

- initial scaffolding
- working with unfamiliar libraries (dndkit)
- generating db trigger scripts

### Client Setup

```bash
cd client
create .env file and add thevariables
npm install
npm run dev
```

### Server Setup

```bash
cd server
yarn install
npm run dev
```

or

'after setting env variables'

```bash
docker compose up
```
