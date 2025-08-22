# Resume Builder

A simple, modern, and user-friendly web application for creating, customizing, and downloading professional resumes. Build your perfect resume in minutes with a real-time preview and a variety of professional template options.

---

## Features ✨

* **Real-Time Preview**: See your resume update instantly as you type.
* **Multiple Professional Templates**: Choose from several pre-designed styles, including **Classic**, **Modern**, **Minimal**, and **Elegant**, to find the perfect look.
* **Download as PDF**: Easily export your finished resume as a print-ready PDF file.
* **Data Persistence**: Your data is automatically saved, so you can close the tab and continue editing later.
* **Customizable Sections**: Add and remove sections for education, experience, and projects as needed.
* **Photo Upload**: Include a professional headshot on your resume.

---

## Technologies Used (Frontend) 🛠️

* **Frontend**: React.js
* **Styling**: Custom CSS for a clean and professional design, with specific styles for each of the four resume templates.
* **PDF Generation**: `jspdf` library for client-side PDF creation.
* **State Management**: React's `useState` and `useEffect` hooks.

---

## Installation and Setup 🚀

To get this project up and running on your local machine, follow these steps:

### Prerequisites

* Node.js (LTS version recommended)
* npm or yarn

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/itzjagat4u/Portfolio-Creator.git](https://github.com/itzjagat4u/Portfolio-Creator.git)
    cd Portfolio-Creator
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
4.  **Open in your browser:**
    The application will automatically open in your default browser at `http://localhost:3000`.

---

## Backend

This is the backend for the Resume Builder application, built with Spring Boot. It provides a RESTful API to manage resume data, including creating, retrieving, and updating user resumes.

---

## Technologies Used (Backend) 🛠️

* **Framework**: Spring Boot
* **Database**: MySQL
* **ORM**: Spring Data JPA & Hibernate
* **Build Tool**: Gradle
* **API**: RESTful API endpoints for data management
* **Security**: CORS configuration for secure communication with the frontend

---

## API Endpoints

The API is accessible at `http://localhost:8080/api/resumes`.

### `POST /api/resumes`

* **Description**: Creates a new resume or updates an existing one.
* **Request Body**: A JSON object representing the resume data. The backend will save this data to the MySQL database.

### `GET /api/resumes`

* **Description**: Retrieves a list of all saved resumes.
* **Response**: Returns a JSON array of `Resume` objects.

---

## Local Development 💻

### Prerequisites

* Java 17 or higher
* MySQL Server
* A Java IDE (like IntelliJ or VS Code with Java extensions)

### Setup Instructions

1.  **Configure the Database**:
    * Ensure your MySQL server is running.
    * Create a database named `resume_db`.
    * Update the `src/main/resources/application.properties` file with your MySQL username and password.
2.  **Run the Application**:
    * Navigate to the `backend` directory in your terminal.
    * Run the application using Gradle:
        ```bash
        ./gradlew bootRun
        ```
    * Alternatively, you can run the `ResumeBackendApplication.java` file directly from your IDE.

---

## About the Creator

* **Name**: Jagat Singh
* **Education**: IIT Patna, Computer Science and Data Analytics (3rd Year Student)
* **Internship**: Currently a intern at GUVI
* **Email**: jagatsingh62045@gmail.com
* **GitHub**: [itzjagat4u](https://github.com/itzjagat4u)

This project was a great learning experience.

---

## License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).