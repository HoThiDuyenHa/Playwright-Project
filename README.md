# OrangeHRM Playwright Automation Project

This repository contains the end-to-end automation testing suite for the **OrangeHRM** application. The project is built using **Playwright** with **TypeScript**, implementing the **Page Object Model (POM)** design pattern, custom fixtures, and **Allure Reporting** integration.

**GitHub Repository:** [HoThiDuyenHa/Playwright-Project](https://github.com/HoThiDuyenHa/Playwright-Project)

---

##  Folder Structure

The project follows a clean, modular structure separating page actions, fixtures, test scripts, and configurations:

```text
OrangeHRM-Automation/
├── .github/                  # GitHub Actions CI/CD workflows
├── allure-results/           # Directory where Allure test results are saved
├── fixtures/                 # Custom Playwright fixtures
│   └── test-fixtures.ts      # Extended test runner initializing Page Objects
├── pages/                    # Page Object Model (POM) Classes
│   ├── BasePage.ts           # Base class containing shared page properties & locators
│   ├── LoginPage.ts          # Page Object & verifications for Authentication
│   ├── PIMPage.ts            # Page Object & verifications for PIM (Employee Management)
│   ├── LeavePage.ts          # Page Object & verifications for Leave management
│   └── AttendancePage.ts     # Page Object & verifications for Attendance punch-in/out
├── tests/                    # Automation Test Spec files
│   ├── auth.spec.ts          # Tests for login, logout, and password reset
│   ├── pim.spec.ts           # Tests for employee CRUD operations and profile updates
│   ├── leave.spec.ts         # Tests for applying, approving, and rejecting leaves
│   └── attendance.spec.ts    # Tests for attendance punch records
├── utils/                    # Common helper utilities
│   ├── DateUtils.ts          # Date manipulation helper functions
│   ├── helper.ts             # Generic test helpers
│   └── logger.ts             # Logger utilities
├── .env                      # Environment configurations (ignored from git)
├── package.json              # Project dependencies and details
├── playwright.config.ts      # Playwright runner configuration
├── setup.ts                  # Playwright browser environment & test data initialization
└── tsconfig.json             # TypeScript configuration
```

---

##  Prerequisites

Before getting started, ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (Version 18 or higher is recommended)
*   [Git](https://git-scm.com/)

---

##  Installation & Setup

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/HoThiDuyenHa/Playwright-Project.git
cd Playwright-Project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Playwright Browsers
```bash
npx playwright install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory (based on `.env` settings):
```ini
ENV=development
BROWSER=chromium
BASE_URL=https://opensource-demo.orangehrmlive.com
```

---

##  Running Tests

Playwright allows running tests in various modes using the CLI:

### Run All Tests
```bash
npx playwright test
```

### Run a Specific Test File
```bash
npx playwright test tests/auth.spec.ts
```

### Run Tests in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run Tests in Headed Mode
```bash
npx playwright test --headed
```

### Run Tests by Tags (Smoke / Regression / Sanity / Bonus)
The test suite utilizes tags to categorize testing scenarios:
*   **Smoke tests:** `npx playwright test --grep @smoke`
*   **Regression tests:** `npx playwright test --grep @regression`
*   **Sanity tests:** `npx playwright test --grep @sanity`
*   **Bonus / Advanced scenarios:** `npx playwright test --grep @bonus`

---

##  Test Reporting & Analytics

This project is configured with both default Playwright HTML reporting and **Allure Reporting**.

### 1. Playwright HTML Report
After running the tests, view the built-in HTML report with:
```bash
npx playwright show-report
```

### 2. Allure Report
To generate and view beautiful, interactive reports using Allure:

1.  **Generate the Report:**
    ```bash
    npx allure generate allure-results --clean -o allure-report
    ```
2.  **Open the Report:**
    ```bash
    npx allure open allure-report
    ```

> [!NOTE]
> If you run tests in Jenkins, ensure that the **Allure Jenkins Plugin** is installed and configured in your global tool configuration to automatically parse test results from the `allure-results` folder.

---

##  Automation Rules & Best Practices

To maintain code quality and test stability, this project strictly adheres to the following rules:
1.  **POM Assertions:** All assertions (`expect`) are wrapped in custom `verify...` methods inside their respective Page Object classes. Spec test files do not contain inline assertions.
2.  **Selector Isolation:** Selectors are **never** hardcoded in the test body or in page execution functions. All selectors are managed at the top of Page classes as variables (defined in the `constructor`).
3.  **Custom Fixtures:** Page Object instantiation is managed automatically through custom Playwright fixtures in `fixtures/test-fixtures.ts` instead of repeating setup code inside spec hooks.
