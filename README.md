# Pure Node.js CRUD Operation

A simple CRUD (Create, Read, Update, Delete) application built using **Node.js**, **Express.js**, and **MongoDB**. This project demonstrates the basic backend operations for managing data without any frontend framework.

---

## 🚀 Features

- Create new records
- Read all records
- Read a single record
- Update existing records
- Delete records
- MongoDB database integration
- Express.js REST API
- Clean project structure

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML
- CSS

---

## 📁 Project Structure

```
PureNodeJSCrudOperation/
│── views/
│   ├── index.html
│   ├── index.css
│   ├── user-details.html
│   └── user-details.css
│
│── node_modules/
│── db.js
│── server.js
│── package.json
│── package-lock.json
│── .gitignore
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/SDIPTIRANJAN/node-crud.git
```

### 2. Go to the project folder

```bash
cd node-crud
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
npm start
```

or

```bash
node server.js
```

---

## 🌐 Server

The application runs on:

```
http://localhost:3000
```

*(Change the port if your project uses a different one.)*

---

## 📌 CRUD Operations

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Display all users |
| POST | `/create` | Create a new user |
| GET | `/edit/:id` | Get user details |
| POST | `/update/:id` | Update user |
| GET | `/delete/:id` | Delete user |

---

## 📸 Screenshots

Add screenshots of your application here.

Example:

```
screenshots/
    home.png
    create-user.png
```

---

## 🎯 Learning Objectives

This project helps understand:

- Express.js routing
- CRUD operations
- MongoDB integration
- Database connection
- Request and response handling
- HTML form submission
- Project structure in Node.js

---

## 👨‍💻 Author

**Diptiranjan Sahoo**

GitHub: https://github.com/SDIPTIRANJAN

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
