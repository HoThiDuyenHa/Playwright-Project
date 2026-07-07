# OrangeHRM E2E Test Automation Framework

A modern, robust, and highly reliable End-to-End (E2E) test automation framework built using **Playwright**, **TypeScript**, and the **Page Object Model (POM)** design pattern. This suite automates critical workflows for the OrangeHRM Demo application.

---

##  Technology Stack

* **Language**: TypeScript
* **Testing Framework**: Playwright Test
* **Design Pattern**: Page Object Model (POM)
* **Runner**: Playwright Test Runner

---

##  Project Structure

```text
D:\OrangeHRM-Automation\
├── pages/                  # Page Object Model classes (Locators and Page actions)
│   ├── BasePage.ts         # Base class for common page interactions
│   ├── login-page.ts       # Authentication module actions
│   ├── pim-page.ts          # Personal Information Management (PIM) actions
│   ├── LeavePage.ts        # Leave application and approval actions
│   ├── AttendancePage.ts   # Punch in/out and duration tracking actions
│   ├── RecruitmentPage.ts  # Job vacancy, candidate management and interview scheduling
│   └── AdminPage.ts        # User creation and status management actions
├── tests/                  # Test specifications (Spec files containing assertions)
│   ├── base-test.ts        # Test fixture setup
│   ├── auth.spec.ts        # Authentication module tests (TC-AUTH-01 to 07)
│   ├── pim.spec.ts         # PIM module tests (TC-PIM-01 to 10)
│   ├── leave.spec.ts       # Leave module tests (TC-LV-01 to 05)
│   ├── attendance.spec.ts  # Attendance module tests (TC-ATT-01 to 03)
│   ├── recruitment.spec.ts # Recruitment module tests (TC-RC-01 to 03)
│   └── admin.spec.ts       # Admin module tests (TC-ADM-01 to 03)
├── utils/                  # Helper utilities (Date formats, mathematical helpers, etc.)
│   └── DateUtils.ts
├── playwright.config.ts    # Playwright configuration file
├── package.json            # Node.js project configuration and dependencies
└── README.md               # Framework documentation
```

---

##  Prerequisites & Setup

### 1. Installation
Ensure you have **Node.js** (v16 or higher) installed on your system.

```powershell
# Clone the repository
git clone https://github.com/HoThiDuyenHa/Playwright-Project.git
cd Playwright-Project

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### 2. Configuration
The application base URL and test options are configured in `playwright.config.ts`. The default URL points to the public OrangeHRM demo instance:
`https://opensource-demo.orangehrmlive.com`

---

##  Running the Tests

You can run the entire suite or execute specific modules using the commands below:

### Run All Tests
```powershell
npx playwright test
```

### Run Specific Test Suites
```powershell
# Run Authentication Module
npx playwright test tests/auth.spec.ts

# Run PIM Module
npx playwright test tests/pim.spec.ts

# Run Leave Module
npx playwright test tests/leave.spec.ts

# Run Attendance Module
npx playwright test tests/attendance.spec.ts

# Run Recruitment Module
npx playwright test tests/recruitment.spec.ts

# Run Admin Module
npx playwright test tests/admin.spec.ts
```

### Run Tests in UI Mode (Interactive)
```powershell
npx playwright test --ui
```

### Run Tests in Headed Mode (Visible Browser)
```powershell
npx playwright test --headed
```

---

##  Best Practices & Design Patterns

### 1. Strict Page Object Model (POM)
* All locators are defined strictly at the top inside page class constructors. No page action methods contain hardcoded selector strings.
* Assertions are located exclusively in test spec files, keeping the page classes clean and reusable.

### 2. Dynamic Synchronization (No Flakiness)
* Zero static `Thread.sleep()` or arbitrary `page.waitForTimeout()` sleeps are used for execution flow control.
* Dynamic waits are implemented for loaders (waiting for `.oxd-form-loader` to become `hidden`) and elements (using `.waitFor({ state: 'visible' })`).
* Validations are checked against stable redirects (`toHaveURL`) rather than ephemeral toast popups which are prone to timing issues on slow server environments.

### 3. Step Logging (`test.step`)
* Every test case wraps its actions in `test.step('Step Name', async () => { ... })` blocks. This ensures clear, readable terminal logs and reports showing exactly where each test progresses and executes.

### 4. Code Cleanliness
* No dead code comments are left in the codebase, keeping it clean, professional, and readable.

### 5. Dynamic Data Isolation
* Tests generate unique numeric suffixes (`Date.now().toString().slice(-4)`) for employee IDs, vacancy names, and usernames. This avoids duplicate key violations and database state conflicts.
* Autocomplete lists dynamically query existing records or filter inputs using single-word prefixes to handle AJAX search indexing accurately.
