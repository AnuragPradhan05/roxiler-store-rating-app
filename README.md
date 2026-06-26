# 🏪 Store Rating System

A full-stack **Store Rating System** built using **React.js, Node.js, Express.js, PostgreSQL, and JWT Authentication**.

This application provides a secure role-based platform where **Administrators**, **Store Owners**, and **Users** have different permissions and functionalities.

---

# 🚀 Getting Started

The project includes two database files:

* **schema.sql** – Creates only the database schema (tables, constraints, indexes).
* **database.sql** – Creates the database along with sample data for testing.

### Default Administrator Account

After importing **database.sql**, a default Administrator account is already available.

**Email**

```text
admin@example.com
```

**Password**

```text
Admin@123
```

> **Note:** The administrator password is securely stored using **bcrypt hashing**.

### First Time Usage

1. Login using the default Administrator account.
2. Create one or more **Store Owner** accounts from the Admin Dashboard.
3. Create stores and assign them to the respective Store Owners.
4. Register new **User** accounts using the Registration page.
5. Login as a User to submit and update ratings.
6. Login as a Store Owner to view ratings and average rating for the assigned store.

---

# 📌 Features

## 👨‍💼 Administrator

* Secure Login
* Dashboard with application statistics
* Create Users (Admin / User / Store Owner)
* Create Stores
* View all registered users
* View all stores
* Search users
* Search stores

---

## 👤 Normal User

* Register
* Login
* View all stores
* Search stores
* Submit ratings (1–5)
* Update existing ratings
* Change password

---

## 🏬 Store Owner

* Secure Login
* View assigned store
* View average store rating
* View all users who rated the store
* Change password

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* SweetAlert2
* React Icons
* CSS

## Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* bcrypt

---

# 🔐 Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Role-Based Authorization
* Protected API Routes
* Input Validation
* Error Handling

---

# 📁 Project Structure

```text
store-rating-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── schema.sql
├── database.sql
├── .env.example
├── README.md
└── .gitignore
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/AnuragPradhan05/roxiler-store-rating-app.git
cd store-rating-system
```

---

## 2. Backend Setup

Move to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the **backend** folder.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_system
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_secret_key
```

---

## 3. Database Setup

Create the PostgreSQL database.

```sql
CREATE DATABASE store_rating_system;
```

### Option A — Import Schema Only

Imports only the database structure.

```bash
psql -U postgres -d store_rating_system -f schema.sql
```

### Option B — Import Sample Database (Recommended)

Imports:

* Database schema
* Default Administrator
* Sample Store Owners
* Sample Users
* Sample Stores
* Sample Ratings

```bash
psql -U postgres -d store_rating_system -f database.sql
```

---

## 4. Start Backend

```bash
npm install
npm run dev
```

or

```bash
npm start
```

depending on your project configuration.

---

## 5. Frontend Setup

Open another terminal.

```bash
cd frontend
npm install
npm run dev
```

---

# 🌐 Application URLs

Frontend

```text
http://localhost:5173
```

Backend

```text
http://localhost:5000
```

---

# 👥 User Roles

| Role            | Description                                    |
| --------------- | ---------------------------------------------- |
| **Admin**       | Manage users and stores                        |
| **Store Owner** | View assigned store ratings and average rating |
| **User**        | Browse stores and submit/update ratings        |

---

# 🗄️ Database Files

## schema.sql

Contains:

* Tables
* Constraints
* Primary Keys
* Foreign Keys
* Indexes

Use this if you want a clean database without sample data.

---

## database.sql

Contains:

* Complete database schema
* Default Administrator account
* Sample Store Owners
* Sample Users
* Sample Stores
* Sample Ratings

Recommended for quickly testing the application.

---

# 📦 Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_system
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_secret_key
```

---

# 🧪 Suggested Testing Flow

1. Import **database.sql**.
2. Login using the default Administrator account.
3. Create a Store Owner.
4. Create a Store and assign it to the Store Owner.
5. Register a new User.
6. Login as the User.
7. Submit ratings for available stores.
8. Update an existing rating.
9. Login as the Store Owner.
10. Verify the submitted ratings and average rating.
11. Test password update functionality.

---

# 🚀 API Highlights

### Authentication

* User Registration
* User Login
* Change Password

### Administrator

* Dashboard Statistics
* Create Users
* Create Stores
* View Users
* View Stores

### User

* View Stores
* Submit Rating
* Update Rating

### Store Owner

* View Assigned Store
* View Average Rating
* View Users Who Rated the Store

---

# 📝 Notes

* PostgreSQL must be installed locally.
* Configure the `.env` file before running the backend.
* Import either **schema.sql** or **database.sql** before starting the application.
* Passwords are securely hashed using **bcrypt**.
* JWT is used for authentication and authorization.
* `.env` and `node_modules` are intentionally excluded from the repository.

---

# 👨‍💻 Author

**Anurag Pradhan**

GitHub: https://github.com/AnuragPradhan05
