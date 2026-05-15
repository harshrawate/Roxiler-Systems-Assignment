# Store Rating Platform

A full-stack web application that allows users to submit and manage ratings for stores. Built with **React (Vite), Node.js, Express, and PostgreSQL**, this platform features a robust Role-Based Access Control (RBAC) system for System Administrators, Store Owners, and Normal Users.

## 🚀 Features

### **System Administrator**
- **Dashboard:** Displays real-time statistics (Total Users, Total Stores, Total Ratings).
- **Manage Users:** Can add new Users, Admins, and Store Owners.
- **Manage Stores:** Can add new Stores and assign them to existing Store Owners.
- **Data Tables:** Complete view of all stores and users with built-in sorting and filtering/search capabilities.
- **Deep View:** View specific details of a user, including the average rating of their stores (if they are a Store Owner).

### **Store Owner**
- **Dashboard:** Instantly see the overall average rating of their specific store.
- **Ratings List:** View exactly which users have submitted ratings for their store and what score they gave.
- **Account Management:** Securely update their password.

### **Normal User**
- **Browse Stores:** Search and filter through all registered stores by Name and Address.
- **Rate Stores:** Submit 1 to 5-star ratings for any store. Can modify their existing ratings in real-time.
- **Account Management:** Can register a new account and update their password.

### **Security & Validation**
- **Authentication:** Handled via HTTP JWT Tokens and securely hashed passwords (`bcryptjs`).
- **Authorization:** Strict backend middlewares to protect specific routes based on user roles.
- **Data Integrity:** Strict form validations (Name: 20-60 chars, Address: max 400 chars, Password complexity: 8-16 chars, 1 uppercase, 1 special char).

---

## 💻 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios, Lucide React (Icons)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (with `pg` connection pool)
- **Validations:** Joi (Server-side)

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL running locally or remotely

### 1. Database Setup
Create an empty PostgreSQL database. For example:
```sql
CREATE DATABASE store_rating_db;
```

### 2. Backend Setup
1. Open a terminal and navigate to the `server` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` folder (you can copy `.env.example`) and configure your PostgreSQL connection:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your_actual_password_here
   JWT_SECRET=super_secret_key_here
   CLIENT_URL=http://localhost:5173
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   > **Note:** The server is configured to **automatically run migrations and seed test data** on startup! There is no need to run a manual migration command. If the tables don't exist, it will create them and populate the default users.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `client` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` folder with the following:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`.

---

## 🔑 Default Test Accounts

To make testing incredibly easy, the database automatically populates several test accounts on startup. 

**Every single test account uses the exact same password:** 
`Admin@1234`

### **Admin Account**
- `admin@platform.com`

### **Store Owners**
- `owner1@platform.com` (Owns "Awesome Tech Store Location 1")
- `owner2@platform.com` (Owns "Super Fresh Groceries Market")

### **Normal Users**
- `user1@platform.com`
- `user2@platform.com`
- `user3@platform.com`
