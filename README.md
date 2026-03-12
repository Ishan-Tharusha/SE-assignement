# 📚 Book Management System

A high-performance, SaaS-style web application for managing library collections. Built with a robust **ASP.NET Core** backend and a reactive **Angular** frontend, this system demonstrates modern architectural patterns, clean code principles, and professional UI/UX standards.

---

## 🌟 Key Features

- **📊 Dynamic Dashboard**: Real-time analytical overview including total books, unique authors, and library categories with interactive Genre Distribution charts.
- **🛡️ ISBN Data Integrity**: 
  - **Duplicate Prevention**: Backend-level check ensuring ISBN uniqueness across the entire library.
  - **Multi-Format Support**: Validates both **ISBN-10** and **ISBN-13** formats with strict regex enforcement.
- **🔔 Professional Feedback**: Real-time **Toast notifications** for all CRUD operations (Add, Update, Delete) and intelligent error handling for network or validation failures.
- **💎 Premium UI/UX**:
  - Sleek **Glassmorphism** design with a dark/light harmonious palette.
  - **Micro-animations** for smooth transitions and interactive states.
  - **Safety-First Deletion**: Multi-step confirmation modal requiring title validation to prevent accidental data loss.
- **📁 Organized Architecture**: Separated concern layers following the Repository and Service patterns.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: .NET 9.0 Web API
- **Architecture**: Repository & Service Pattern
- **Logic**: In-memory Singleton Repository (Thread-safe logic)
- **Validation**: Custom validation layers for ISBN and model integrity.

### Frontend
- **Framework**: Angular 19+ (Standalone Components)
- **Styling**: Vanilla CSS + Tailwind CSS utilities
- **Icons**: Lucide Angular
- **Visualization**: Chart.js (Interactive analytical charts)

---

## 📂 Project Structure

```text
├── Backend/
│   └── BookManagement.Api/         # ASP.NET Core Web API
│       ├── Controllers/            # API Endpoints
│       ├── Services/               # Business Logic Layer
│       ├── Repositories/           # Data Access Layer
│       ├── Models/                 # Core Entities
│       └── DTOs/                   # Data Transfer Objects
└── Frontend/
    └── BookManagementUI/           # Angular 19 Application
        ├── src/app/
        │   ├── components/         # Reusable UI Components (Toast, Modal, Sidebar)
        │   ├── pages/              # Main Page Components (Dashboard, List, Form)
        │   └── services/           # API and State Management Services
```

---

## 🚀 Getting Started

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### 1. Backend Setup
```bash
cd Backend/BookManagement.Api
dotnet run
```
> [!NOTE]
> The backend will be hosted at `http://localhost:5011` (or the configured HTTPS port).

### 2. Frontend Setup
```bash
cd Frontend/BookManagementUI
npm install
npm start
```
> [!TIP]
> Access the dashboard at `http://localhost:4200`.

---


## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
