# 🌾 **TetraMan – AI-Powered Agri-Commerce Platform**

presentation drive link : 

> Empowering Nepali farmers through **AI voice recognition**, **smart product enhancement**, and a seamless **digital marketplace**.

---

## 🧭 **Overview**

**TetraMan** is a full-stack, AI-driven agri-commerce platform built for Nepali farmers.  
It enables farmers to **list agricultural products using voice input in Nepali**, which is automatically **transcribed, enhanced, and structured** using **Google Gemini AI**.  
Buyers can browse, purchase, and manage products while the system bridges the gap between **local farmers and consumers** through technology.

This project was developed for a **Hackathon submission**, showcasing innovation at the intersection of **AI, accessibility, and agriculture**.

---

## 📚 **Table of Contents**

1. [Features](#-features)
2. [System Architecture](#-system-architecture)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Installation & Setup](#-installation--setup)
6. [API Overview](#-api-overview)
7. [Usage Flow](#-usage-flow)
8. [Future Roadmap](#-future-roadmap)
9. [Contributors](#-contributors)
10. [License](#-license)

---

## 🚀 **Features**

### 👨‍🌾 For Farmers

- 🎙️ **Voice-to-Product Creation** — Farmers record their product info in Nepali.  
  → AI converts it to text and extracts name, price, quantity, lifespan, and description.
- 🧠 **AI Enhancement via Gemini** — Automatically generates structured and enhanced product details in Nepali.
- 📷 **Product Image Uploads** — Store photos securely using **Cloudinary**.
- 🪪 **KYC Verification** — Farmers upload citizenship front/back for verification.

### 🛒 For Buyers

- 🔍 **Search Products** — Browse and filter by product name.
- 💳 **Order & Checkout** — Purchase items via Cash on Delivery or eSewa.
- 📦 **Order Management** — View and track all your orders in one dashboard.

### ⚙️ Admin & Utility

- 🧾 **Farmer Dashboard** — View, verify, and manage farmer data and KYC status.
- 🧱 **Cold Storage & Inventory Tracking** — Manage perishable product lifecycle.

---

## 🧩 **System Architecture**

Frontend (React + Vite + Tailwind)
│
▼
Backend (Express + Prisma + Node.js)
│
├── Gemini AI (Text Enhancement)
├── ElevenLabs (Speech-to-Text)
├── Cloudinary (Image Upload)
└── PostgreSQL (via Prisma ORM)

---

## 🛠️ **Tech Stack**

**Frontend**

- ⚛️ React 19 + Vite
- 🎨 TailwindCSS 4
- 🧭 React Router 7
- 🧩 Radix UI components
- 📦 Axios for API integration
- 🌍 Maplibre for geo-location features

**Backend**

- 🟢 Node.js + Express
- 🧠 Google Gemini AI API
- 🗣️ ElevenLabs Speech-to-Text API
- 🧱 Prisma ORM + PostgreSQL
- ☁️ Cloudinary for image uploads
- 🔒 Geoapify API for reverse geocoding

---
# env 
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tetraman"
GEMINI_API="your_google_gemini_api_key"
EllevenLabs_API_KEy="your_elevenlabs_api_key"
CLOUDINARY_API_KEY="your_cloudinary_key"
CLOUDINARY_API_SECRET="your_cloudinary_secret"
CLOUDINARY_CLOUD_NAME="your_cloud_name"

| Method | Endpoint                      | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| `POST` | `/api/product/add-voice`      | Create a product from voice input  |
| `POST` | `/api/product/add`            | Create product manually            |
| `GET`  | `/api/product/get`            | Get all products                   |
| `GET`  | `/api/product/getproduct/:id` | Get product by ID                  |
| `POST` | `/api/product/order`          | Place an order                     |
| `GET`  | `/api/product/search`         | Search product by name             |
| `POST` | `/api/user/create`            | Register farmer or user            |
| `POST` | `/api/user/verify`            | Upload KYC for farmer verification |
| `GET`  | `/api/user/getorders/:userId` | Fetch user’s orders                |
| `GET`  | `/api/user/getFarmers`        | Fetch all registered farmers       |


