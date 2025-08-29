# Overview

This is a 3D city simulation game built with React Three Fiber, featuring real-time city building, resource management, and citizen happiness tracking. Players can place different zones (residential, commercial, industrial) and buildings (power plants, hospitals, schools, etc.) on a grid-based city layout. The application uses a modern full-stack architecture with TypeScript, Express.js backend, and a React frontend with 3D graphics powered by Three.js.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for the main UI framework
- **React Three Fiber** for 3D rendering and scene management
- **@react-three/drei** for additional 3D utilities and helpers
- **Zustand** for state management with subscribeWithSelector middleware
- **Tailwind CSS** with **Radix UI** components for styling and UI primitives
- **Vite** as the build tool and development server
- **TanStack Query** for server state management and API calls

## Backend Architecture
- **Express.js** server with TypeScript
- **Drizzle ORM** configured for PostgreSQL database interactions
- RESTful API structure with `/api` prefix for all endpoints
- In-memory storage implementation as fallback/development option
- Session-based request logging middleware

## Database Design
- **PostgreSQL** as the primary database (configured via Drizzle)
- **Neon Database** serverless PostgreSQL integration
- Simple user schema with username/password authentication
- Drizzle migrations system for schema management

## 3D Graphics System
- **Three.js** scene management with custom camera controls
- **WASD + QE** keyboard controls for camera movement
- Grid-based city layout with interactive building placement
- **GLSL shader** support for advanced visual effects
- Texture loading for roads, grass, and building materials

## State Management
- **City simulation state** managed through Zustand store
- Real-time resource tracking (budget, power, water, population)
- Grid-based building placement system with collision detection
- Save/load functionality using localStorage
- Simulation speed controls and pause/resume functionality

## Game Logic
- **Zone types**: Empty, Residential, Commercial, Industrial
- **Building types**: Roads, Power Plants, Water Facilities, Schools, Hospitals, Police Stations, Fire Stations
- **Resource management**: Budget, power generation/consumption, water supply
- **Happiness system**: Citizen satisfaction based on services and infrastructure
- **Infrastructure connectivity**: Roads, power, and water propagation algorithms

## Development Features
- **Hot Module Replacement** (HMR) in development
- **Runtime error overlay** for debugging
- **TypeScript** strict mode with path aliases
- **ESBuild** for production bundling
- **PostCSS** with Autoprefixer for CSS processing

# External Dependencies

## Database Services
- **Neon Database** - Serverless PostgreSQL hosting
- **Drizzle ORM** - Type-safe database operations and migrations

## 3D Graphics Libraries
- **Three.js** ecosystem (@react-three/fiber, @react-three/drei, @react-three/postprocessing)
- **GLSL shader** support via vite-plugin-glsl

## UI Components
- **Radix UI** - Comprehensive set of accessible React components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variant management

## Development Tools
- **Vite** - Build tool and development server
- **TypeScript** - Type safety and developer experience
- **ESBuild** - Fast JavaScript bundler
- **TSX** - TypeScript execution engine for development

## State & Data Management
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state synchronization
- **React Hook Form** - Form state management
- **Zod** - Runtime type validation

## Audio System
- **HTML5 Audio API** - Background music and sound effects
- Audio state management through Zustand store
- Mute/unmute functionality

## Utility Libraries
- **date-fns** - Date manipulation utilities
- **clsx** - Conditional className utility
- **nanoid** - Unique ID generation
- **cmdk** - Command palette component