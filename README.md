<h1 align="center">👟 ImtiazKicks</h1>

<p align="center">
  <strong>A Full-Stack MERN E-Commerce Platform for Premium Footwear</strong>
  <br />
  <em>Developed by Imtiaz Ahmed Adar</em>
  <br />
  <br />
  <a href="[Deployed Link](https://tinyurl.com/imtiazkicks-imtiaz)"><strong>View Demo »</strong></a>
  ·
  <a href="https://www.linkedin.com/in/imtiaz-ahmed-adar"><strong>Connect on LinkedIn »</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version 1.0.0" />
  <img src="https://img.shields.io/badge/license-By Imtiaz-green.svg" alt="Imtiaz Licensed" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/MERN-Stack-purple" alt="MERN Stack" />
</p>

<hr />

## ✨ Project Overview

**ImtiazKicks** is a modern, full-featured e-commerce platform built to provide a seamless online shopping experience for footwear enthusiasts. It leverages the power of the MERN stack to deliver robust performance, secure authentication, and an intuitive user interface.

Whether you're a customer looking for the latest sneakers or an administrator managing the store, ImtiazKicks provides all the necessary tools in a clean, responsive package.

### 🎯 Purpose
This project was developed to demonstrate advanced full-stack development skills, including complex state management, secure API design, role-based access control, and creating pixel-perfect, responsive UIs without external CSS frameworks.

---

## 🚀 Features at a Glance

### 👤 For Customers
*   **Secure Authentication:** Register and log in with JWT-based authentication.
*   **Product Discovery:** Browse products with powerful filtering by category, brand, and price range.
*   **Detailed Product Views:** Examine products with multiple images, size/color selection, and stock information.
*   **Shopping Cart:** Add items to a persistent cart that saves your selections locally.
*   **Virtual Wallet:** Start with a 1000 BDT welcome bonus and deposit more using the demo payment system.
*   **Streamlined Checkout:** Place orders easily by providing a shipping address.
*   **Order Tracking:** View your complete order history and track the status of each order.
*   **Personal Profile:** Update your personal information and view your account statistics (total orders, total spent).

### 👑 For Administrators
*   **Dedicated Admin Dashboard:** A central hub for managing the entire platform.
*   **User Management:** View all registered users and adjust their account balances (with protection against self-adjustment).
*   **Order Management:** See all orders placed on the platform and update their status (processing, shipped, delivered, etc.). **Automatic refunds** are processed when an order is cancelled.
*   **Product Management:** Add new products, update existing ones, or remove them from the catalog.
*   **Exclusive Admin Login:** A separate, secure login portal for administrators.

### 🛠️ Technical Highlights
*   **RESTful API:** Well-defined API endpoints with comprehensive Swagger documentation.
*   **Role-Based Access:** Middleware that protects routes based on user roles (`user` or `admin`).
*   **Virtual Payments:** A demo balance system that simulates real transactions without actual money.
*   **Refund Logic:** Automatic balance refund upon order cancellation, demonstrating complex business logic.
*   **Responsive Design:** A mobile-first CSS approach ensures the site looks great on phones, tablets, and desktops, complete with a custom hamburger menu.
*   **State Management:** Utilizes React Context API for efficient global state management (Auth, Cart).

---

## 🛠️ Technology Stack

This project is built using the following powerful technologies:

**Frontend**  
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**Backend**  
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)

---

## 📁 Project Structure

The repository is organized for clarity and maintainability.  
imtiazkicks/  
├── backend/ # Node.js & Express server  
│ ├── models/ # Mongoose data models (User, Product, Order, Transaction)  
│ ├── routes/ # API route handlers (auth, products, orders, users)  
│ ├── middleware/ # Custom middleware (auth, adminAuth)  
│ ├── tests/ # Manual API test scripts  
│ ├── swagger.js # Swagger configuration  
│ └── server.js # Main server entry point  
│  
├── frontend/ # React client application  
│ ├── public/  
│ └── src/  
│ ├── components/ # Reusable UI components (Navbar, ProductCard, CartSidebar)  
│ ├── pages/ # Main application views (Home, Products, Checkout, Admin)  
│ ├── context/ # React Context providers (Auth, Cart)  
│ ├── styles/ # Global CSS styles  
│ ├── App.js # Main app component with routing  
│ └── index.js # Application entry point  
│  
├── .gitignore  
└── README.md # You are here!  

---

## 🚀 Getting Started

Follow these simple steps to get a copy of ImtiazKicks up and running on your local machine.

### Prerequisites
*   **Node.js** (v14 or higher) installed on your system.
*   **npm** (usually comes with Node.js) or **yarn**.
*   A **MongoDB Atlas** account (or a local MongoDB installation).

### Installation & Setup

**1. Clone the Repository**
```bash
git clone https://github.com/your-username/imtiazkicks.git
cd imtiazkicks
```
Create a .env file in the backend directory and add your database connection string and a secret key:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/imtiazkicks
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

4. Seed the Database (Optional)
You can add sample products to your database using MongoDB Compass or the provided sample data in the documentation.

5. Run the Application
You'll need to run both the backend and frontend servers, preferably in two separate terminals.

Terminal 1 (Backend):
```
cd backend
npm start
```
The API server will start on http://localhost:5000.

Terminal 2 (Frontend):
```
cd frontend
npm run dev
```
The React app will open on http://localhost:5173.

### 📚 API Documentation
Explore the complete API interactively using Swagger UI. Once your backend server is running, visit:

👉 http://localhost:5000/api-docs

Here you can test all endpoints, see request/response schemas, and understand the authentication requirements.
```
Key API Endpoints
```
**Authentication**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Create a new user account | Public |
| POST | /api/auth/login | Log in as a regular user | Public |
| POST | /api/auth/admin/login | Log in as an administrator | Public | 

**Products**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|			
| GET | /api/products | Get all products (with optional filters) | public |
| GET | /api/products/:id | Get details of a specific product | Public |
| POST | /api/products | Add a new product | Admin |
| PUT | /api/products/:id | Update an existing product | Admin |
| DELETE | /api/products/:id | Delete a product | Admin |

**Orders**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/orders	| Place a new order | User |
| GET | /api/orders/my-orders | Get order history for the logged-in user | User |

**Users**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|			
| GET | /api/users/profile | Get the profile of the logged-in user | User |
| PUT | /api/users/profile | Update user profile (name) | User |
| POST | /api/users/deposit | Add funds to the user's balance | User |
| GET | /api/users/stats | Get user order statistics (total orders, spent) | User |

**Admin**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|			
| GET | /api/users/admin/users | Retrieve a list of all users | Admin |
| PUT | /api/users/admin/users/:id/balance | Modify any user's balance | Admin |
| GET | /api/users/admin/orders | Retrieve a list of all orders | Admin |
| PUT | /api/users/admin/orders/:id | Update the status of an order (triggers refunds) | Admin |

### 🧪 Testing the API
The project includes a suite of manual test scripts to verify API functionality. These are located in the backend/tests folder.

1. Navigate to the tests folder:
```
cd backend/tests
npm install
```
2. Run individual tests:
```
node test-db.js          # Test database connection
node test-register.js    # Test user registration
node test-login.js       # Test user login
node test-admin-login.js # Test admin login
node test-products.js    # Test fetching products
node test-profile.js     # Test fetching user profile
```

3. Or run all tests at once:
```
node run-all-tests.js
```
### 👥 Default User Accounts
You can use these credentials to test the application immediately after seeding the database.

Regular User

Email: (Create your own via registration)

Password: (Set during registration)

Initial Balance: 1000 BDT

Administrator

Email: admin.imtiaz@gmail.com

Password: imtiazadar1234

Note: To promote an existing user to admin, you can run the following command in MongoDB Compass:
db.users.updateOne({ email: "user@example.com" }, { $set: { role: "admin" } })

### 💻 Key Implementation Details
Authentication Flow
User registers with name, email, and password.

Password is securely hashed using bcryptjs before being stored.

Upon successful login, the server generates a JWT token containing the user's ID and role.

The client stores this token in localStorage and attaches it to the Authorization header for subsequent requests.

Middleware functions (auth, adminAuth) verify the token and grant access to protected routes.

Shopping Cart Logic
Cart state is managed globally using the React Context API.

The cart's contents are persisted in the browser's localStorage, ensuring the cart survives page refreshes.

Users can add, remove, and update item quantities, with real-time calculation of the total price.

Virtual Balance & Ordering
New users receive a 1000 BDT welcome bonus added to their balance.

During checkout, the server checks if the user's balance is sufficient to cover the order total.

If sufficient, the order is created, the balance is deducted, and a transaction record is saved.

If an admin cancels a confirmed or processing order, the full amount is automatically refunded to the user's balance, and a refund transaction is logged.

Role-Based UI
The frontend conditionally renders navigation links and UI elements based on the logged-in user's role.

For example, "My Orders" and "Deposit" links are hidden for admin users, while an "Admin Dashboard" link appears.

### 📱 Responsive Design
ImtiazKicks is built to be fully responsive, providing an optimal experience on any device.

Desktop & Tablet: A full navigation menu is displayed horizontally.

Mobile Devices: The navigation menu collapses into a clean, animated hamburger menu, saving screen space.

All Pages: CSS Grid and Flexbox are used extensively to create layouts that adapt gracefully to different screen sizes, from multi-column product grids on desktops to single-column lists on phones.

### 🗺️ Roadmap / Future Enhancements
Product Reviews & Ratings: Allow users to leave reviews and ratings on products.

Wishlist Feature: Enable users to save products to a personal wishlist.

Advanced Search: Implement full-text search for products.

Email Notifications: Send order confirmation and status update emails.

Image Upload: Allow admins to upload product images directly through the dashboard.

### 📄 License
Licensed by Imtiaz Adar. See LICENSE file for more information.

### 📬 Contact
Imtiaz Ahmed Adar - MERN Stack Developer

Email: imtiazadarofficial@gmail.com

LinkedIn: https://www.linkedin.com/in/imtiaz-ahmed-adar

GitHub: https://github.com/ImtiazAdar7

Project Link: [Github](https://github.com/ImtiazAdar7/ImtiazKicks-E-commerce-Project---Imtiaz-Adar)

<p align="center"> <br /> <br /> <strong>Made with ❤️ by Imtiaz Ahmed Adar</strong> <br /> <sub>© 2026 ImtiazKicks. All rights reserved.</sub> </p>
