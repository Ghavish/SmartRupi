# SmartRupi

SmartRupi is a mobile application developed for the UOM Auto Forge Hackathon 2026. Built by Team Cipher, it aims to bring secure, intelligent, and seamless financial management directly to users in Mauritius. By leveraging an enterprise-grade Multi-Agent System, the app connects to inboxes and bank accounts to act as a shield against fraud while serving as a personalized financial advisor.

## Team Cipher

*   **Team Leader:** Ghavish Subratty
*   **Team Members:** Dhruv Govind, Teesha Niharika Jummaheer, Yashmeeta Mohonee, Khushi Doongoor
  
## Features

*   **Scam Shield:** Scans connected emails and flags potential financial scams in real-time to address rising cybersecurity and phishing threats.
*   **Finance Tracker & Deal Finder:** Reviews transactions, suggests budgeting improvements, and compares prices for planned retail purchases to improve financial literacy.
*   **Tailored Stock Insight Engine:** Suggests investments, ranging from low-risk bonds to growth stocks, based on the user's remaining budget and risk tolerance.
*   **Loan Matchmaker:** Evaluates financial health to recommend the best local bank plans and enables a 1-click mock online application.

## Multi-Agent System (BAND AI)

SmartRupi utilizes the BAND AI platform to deploy a coordinated Multi-Agent System using an Agent-to-Agent (A2A) protocol. The orchestration consists of four specialized agents:

*   **Agent 1 (The Scam Analyst):** Scans email text for phishing keywords and anomalies using LLM APIs, such as Gemini
*   **Agent 2 (The Financial Auditor):** Queries the SQL database records to calculate income, expenses, and leftover budget.
*   **Agent 3 (The Investment Strategist):** Receives contextual budget data from the Financial Auditor, pulls live data via the Alpha Vantage API, and generates tailored portfolio recommendations.
*   **Agent 4 (The Loan Officer):** Evaluates the persistent financial context to calculate approval odds for local bank loans.

## Tech Stack

*   **Frontend:** React Native and Expo Go for rapid UI development, hot reloading, and seamless mobile testing.
*   **Backend:** A hybrid approach using Node.js—utilizing the `mssql` package for primary app routing—interfacing with a lightweight Python microservice to run the `band-sdk` and execute the AI agents.
*   **Database:** Microsoft SQL Server 2020, managed via SQL Server Management Studio (SSMS), to securely store user profiles, structured mock banking transactions, and loan application records locally.

## Local Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/Ghavish/SmartRupi.git
    ```
2.  Navigate to the directory:
    ```bash
    cd SmartRupi
    ```
3.  Install frontend dependencies and start Expo:
    ```bash
    npm install
    npx expo start
    ```
4.  Configure your environment variables for your database and API keys, utilizing the included `.env.example` and `.env.local` files for reference.
5.  Set up your local database using Microsoft SQL Server and SSMS.
6.  Start your Node.js backend and the Python microservice to initialize the BAND AI orchestration.
