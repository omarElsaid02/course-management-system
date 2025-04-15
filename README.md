# 📚 Course Management System

This is a full-stack web application for managing student requests and department head processing queues.

Built with:
- Node.js + Express.js
- MongoDB (Mongoose)
- CoreUI (HTML frontend)
- Role-based access (Student & Department Head)

---

## 🚀 How to Run This Project Locally

### 🔧 1. Clone the Repository

```bash
git clone https://github.com/your-username/course-management-system.git
cd course-management-system
```

### 📦 2. Install Dependencies

```bash
npm install
```

### 🔐 3. Configure .env File
Create a .env file in the root directory with the following:

```bash
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<your-database>?retryWrites=true&w=majority
JWT_SECRET=yourSuperSecretKey
```
Replace <username>, <password>, and <your-database> with your actual MongoDB Atlas credentials.
Be sure to encode special characters in the password if needed (e.g. @ → %40).

### ✅ 4. Start the Server

```bash
npm run dev
```

You should see:
```bash
✅ MongoDB connected
🚀 Server running on http://localhost:3000
```
