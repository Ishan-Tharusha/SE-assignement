# Book Management System

A modern SaaS-style web application for managing library records. Built with an **ASP.NET Core** backend and an **Angular** frontend.

## 🚀 Features
- **Dashboard Overview**: Real-time stats (Total Books, Authors, Categories) and Genre Distribution doughnut chart.
- **Manage Records**: Full CRUD operations with ISBN tracking and Category tagging.
- **Modern UI**: Clean, responsive layout with glassmorphism effects and smooth animations.
- **Inline Actions**: Fast delete confirmation and streamlined edit flows.

## 🛠️ Project Structure
- **/Backend**: ASP.NET Core 9 Web API (BookManagement.Api)
- **/Frontend**: Angular 19+ (BookManagementUI)

## 🏗️ Getting Started

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### 1. Run the Backend
```bash
cd Backend/BookManagement.Api
dotnet run
```
*API will be available at: http://localhost:5011*

### 2. Run the Frontend
```bash
cd Frontend/BookManagementUI
npm install
npm start
```
*Application will be available at: http://localhost:4200*

## 🧪 Tech Stack
- **Frontend**: Angular, Tailwind CSS, Lucide Icons, Chart.js.
- **Backend**: ASP.NET Core, In-memory Repository (Singleton).
- **Styling**: Scoped Vanilla CSS + Tailwind utilities.
