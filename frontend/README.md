# Task 2: Mini E‑Commerce Storefront

This repository contains the code for **Task 2** of the Future Intern challenge: building a mini e‑commerce storefront with product listings, shopping cart, and checkout simulation.

---

## 🛠️ Technology Stack

- **Framework**: React.js  
- **Styling**: Tailwind CSS  
- **Routing**: React Router  
- **State Management**: React Context API  
- **Authentication & Database**: Firebase  
  - Firebase Authentication (email/password)  
  - Cloud Firestore (products, users, cart, orders, feedback)  
- **Email Integration**: EmailJS (contact form)  
- **Icons**: React Icons (Feather icons set)  
- **Notifications**: react-toastify  

---

## 🚀 Key Features

1. **Home Page**  
   - Hero banner with zoom/blur on hover  
   - “Top Picks” and “Featured Products” sections  
2. **Shop**  
   - Grid of football jerseys  
   - Category filters, price range slider, search bar  
   - Pagination & view toggles  
3. **Product Details**  
   - Full product info, size & quantity selector  
   - “Add to Cart” / “View Cart” buttons  
4. **Cart**  
   - User‑specific Firestore cart  
   - Remove single items, clear all  
   - Subtotal & proceed to checkout  
5. **Checkout**  
   - Pre‑filled address from profile  
   - Multiple payment methods (card, UPI, wallet, EMI)  
   - Order summary & Firestore order save  
6. **Authentication**  
   - Email/password signup & login via Firebase Auth  
   - Protected routes (Profile, Cart, Checkout, Orders)  
7. **Profile**  
   - View & edit name, email, address  
   - Firestore persistence & loading state  
8. **Orders**  
   - List past orders from Firestore  
   - Display items, total, payment & address  
9. **Contact**  
   - Feedback form saved to Firestore  
   - EmailJS integration for direct email  
10. **Responsive Design**  
    - Mobile‑friendly navbar with hamburger menu  
    - Fully responsive layouts

---

## 🔧 Getting Started

1. **Clone**  
   ```bash
   git clone https://github.com/your‑username/future-intern-task2.git
   cd future-intern-task2/frontend
