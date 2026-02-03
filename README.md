# Alpha Squad Backend API

A robust, production-ready Node.js/Express backend featuring multi-role authentication, RBAC (Role-Based Access Control), and comprehensive workflows for an educational platform (LMS).

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Technologies & Frameworks](#-technologies--frameworks)
- [Project Architecture](#-project-architecture)
- [Folder Structure](#-folder-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing Guidelines](#-contributing-guidelines)
- [License](#-license)

## 🔭 Project Overview

The **Alpha Squad Backend** serves as the core API for an e-learning platform. It manages user identities across different roles (Admin, Teacher, Student), handles course creation and approval workflows, processes secure transactions, and manages a review system.

**Key Features:**
- **Secure Authentication**: JWT-based auth with secure password hashing.
- **RBAC**: Strict role enforcement for Admins, Teachers, and Students.
- **Approval Workflows**: Admins must approve new Teacher/Student profiles and Courses before they go live.
- **Data Validation**: Comprehensive input validation using `express-validator`.
- **Security First**: Implements Helmet for headers, CORS configuration, and strict environment validation.

## 🛠 Technologies & Frameworks

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Runtime** | Node.js | >= 18.x | JavaScript runtime environment |
| **Framework** | Express.js | ^4.18.2 | Web application framework |
| **Database** | MongoDB | ^7.0 | NoSQL database |
| **ODM** | Mongoose | ^8.0.3 | Object Data Modeling for MongoDB |
| **Auth** | JWT | ^9.0.2 | Stateless authentication tokens |
| **Security** | Helmet | ^7.1.0 | Secure HTTP headers |
| **Security** | BCrypt.js | ^2.4.3 | Password hashing |
| **Validation** | Express Validator | ^7.0.1 | Request data validation |
| **Logging** | Morgan | ^1.10.0 | HTTP request logger |

## 🏗 Project Architecture

This project follows the **MVC (Model-View-Controller)** pattern, adapted for a JSON API (Views are JSON responses).

- **Controllers**: Handle business logic and request processing.
- **Models**: Define database schemas and data relationships.
- **Routes**: Map URL endpoints to controller functions.
- **Middleware**: Intercept requests for authentication, validation, and error handling.
- **Utils**: Helper functions (JWT generation, Hashing).

## 📂 Folder Structure

```
Alpha-squad-back-end/
├── src/
│   ├── config/             # (Deprecated - moved to .env handling)
│   ├── controllers/        # Route handlers (Business Logic)
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   └── ...
│   ├── database/           # Database layer
│   │   ├── models/         # Mongoose Schemas (User, Course, etc.)
│   │   ├── seeders/        # Initial data scripts (Admin seeder)
│   │   └── connection.js   # Database connection logic
│   ├── middleware/         # Custom Middleware
│   │   ├── auth.middleware.js
│   │   ├── auth.lenient.js
│   │   └── rbac.middleware.js
│   ├── routes/             # API Route Definitions
│   │   ├── index.js        # Main router pivot
│   │   └── *.routes.js     # Feature-specific routes
│   ├── utils/              # Utilities
│   │   ├── jwt.js
│   │   └── validation.js
│   └── app.js              # Express App setup (Middleware, Routes)
├── server.js               # Entry point (Server startup)
├── .env                    # Environment variables (Gitignored)
├── package.json            # Dependencies and Scripts
└── README.md               # Documentation
```

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local service or Atlas URI)

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/Alpha-squad-back-end.git
    cd Alpha-squad-back-end
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory. Copy the keys from `Environment Variables` section below.

4.  **Seed the Database** (Optional)
    Creates an initial Admin account.
    ```bash
    npm run seed
    ```

## 🔐 Environment Variables

The application **will not start** if required variables are missing.

| Variable | Description | Required | Default |
|----------|-------------|:--------:|---------|
| `PORT` | Server port number | No | `5000` |
| `NODE_ENV` | Environment mode (`development`/`production`) | No | `development` |
| `MONGODB_URI` | Connection string for MongoDB | **Yes** | - |
| `JWT_SECRET` | Secret key for signing tokens | **Yes** | - |
| `JWT_EXPIRES_IN` | Token validity duration | **Yes** | - |
| `ADMIN_EMAIL` | Email for the seed admin user | **Yes** | - |
| `ADMIN_PASSWORD` | Password for the seed admin user | **Yes** | - |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma separated) | No | `http://localhost:3000` |

**Example `.env` file:**
```properties
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/alpha_squad_db
JWT_SECRET=super_secure_random_secret_key_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecureAdminPass123!
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 🏃‍♂️ Running the Project

**Development Mode** (with hot-reload via Nodemon):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

**Database Seeding**:
```bash
npm run seed
```

## 📡 API Endpoints

All routes are prefixed with `/api`.

### **Authentication**
| Method | Endpoint | Description | Auth |
|:------:|----------|-------------|:----:|
| POST | `/auth/register/student` | Register as a Student | Public |
| POST | `/auth/register/teacher` | Register as a Teacher | Public |
| POST | `/auth/register/review` | Register as a Reviewer | Public |
| POST | `/auth/login` | Login and receive JWT | Public |
| GET | `/auth/me` | Get current user profile | Token |

### **Admin Operations**
| Method | Endpoint | Description | Auth |
|:------:|----------|-------------|:----:|
| GET | `/admin/pending` | Get all pending approvals | Admin |
| GET | `/admin/users` | List all users | Admin |
| PATCH | `/admin/students/:id/approve` | Approve a student | Admin |
| PATCH | `/admin/teachers/:id/approve` | Approve a teacher | Admin |
| PATCH | `/admin/users/:id/deactivate` | Deactivate a user | Admin |

### **Courses**
| Method | Endpoint | Description | Auth |
|:------:|----------|-------------|:----:|
| GET | `/courses` | Get all approved courses | Public |
| GET | `/courses/:id` | Get course details | Public |
| POST | `/courses` | Create a new course | Teacher |
| PATCH | `/courses/:id` | Update a course | Teacher/Admin |
| DELETE| `/courses/:id` | Delete a course | Teacher/Admin |

### **Transactions**
| Method | Endpoint | Description | Auth |
|:------:|----------|-------------|:----:|
| POST | `/transactions` | Create a transaction | User |
| GET | `/transactions/:id` | Get transaction details | Owner/Admin |

### **Feature & Role Matrix**
- **Public**: Login, Register, View Courses (Basic).
- **Student**: View Courses, Create Transactions, Create Reviews.
- **Teacher**: Create/Manage Courses, View Students.
- **Admin**: Approve/Reject Users & Content, Manage System.

## 🧪 Testing

Currently, manual testing via Postman is recommended.
A `postman_collection.json` is included in the root directory for importing into Postman.

## 🔧 Troubleshooting

**1. `Error connecting to MongoDB: connect ECONNREFUSED`**
- **Cause**: MongoDB service is not running locally.
- **Fix**: Start the service via `sudo systemctl start mongod` or check your Docker container.

**2. `Missing required environment variables`**
- **Cause**: `.env` file is missing or incomplete.
- **Fix**: Ensure all variables listed in the Environment Variables section are defined.

**3. `Access denied. Insufficient permissions.`**
- **Cause**: You are trying to access a route (e.g., `/admin`) with a non-admin token.
- **Fix**: Login as an admin or seed the database to get the default admin credentials.

## 🤝 Contributing Guidelines

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

Please ensure your code follows the existing style (ES Modules, Async/Await) and passes all linting/validation checks.

## 📄 License

This project is licensed under the **ISC License**.
