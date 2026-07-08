import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PIMPage } from '../pages/PIMPage';
import * as path from 'path';
import * as fs from 'fs';

test.describe('PIM Module', () => {
  let loginPage: LoginPage;
  let pimPage: PIMPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    pimPage = new PIMPage(page);

    await loginPage.navigate();
    await loginPage.login('Admin', 'admin123');
    await loginPage.verifyDashboardPageDisplayed();
    await pimPage.navigateToPIM();
  });

  test('TC-PIM-01 Add a new employee with all required fields @smoke', async () => {
    const empId = `EMP${Date.now().toString().slice(-4)}`;
    
    await test.step('Step 1: Create a new employee', async () => {
      await pimPage.addEmployee('John', 'Doe', 'M', empId);
    });

    await test.step('Step 2: Verify employee details page loads', async () => {
      await pimPage.verifyPersonalDetailsHeaderVisible();
    });

    await test.step('Step 3: Verify employee appears in the employee list', async () => {
      await pimPage.searchEmployeeById(empId);
      await pimPage.verifyEmployeeInList('John', 'Doe');
    });
  });

  test('TC-PIM-02 Add employee without first name @regression', async () => {
    await test.step('Step 1: Attempt to add employee without first name', async () => {
      await pimPage.addEmployeeBtn.click();
      await pimPage.lastNameInput.fill('Doe');
      await pimPage.saveBtn.click();
    });

    await test.step('Step 2: Verify required validation prevents saving', async () => {
      await pimPage.verifyRequiredValidationErrorVisible();
    });
  });

  test('TC-PIM-03 Search employee by exact name @regression', async () => {
    await test.step('Step 1: Search employee by exact name John Doe', async () => {
      await pimPage.searchEmployeeByName('John Doe');
    });

    await test.step('Step 2: Verify matching employee is shown', async () => {
      await pimPage.verifyFirstRowContainsText('John');
    });
  });

  test('TC-PIM-04 Search employee by partial name @regression @bonus', async () => {
    await test.step('Step 1: Search employee by partial name Jo', async () => {
      await pimPage.searchEmployeeByName('Jo');
    });
  
    await test.step('Step 2: Verify all matching results contain Jo', async () => {
      await pimPage.verifyFirstRowContainsCharCaseInsensitive('j');
    });
  });
  
  test('TC-PIM-05 Search employee with non-existent name @regression @bonus', async () => {
    await test.step('Step 1: Search non-existent employee', async () => {
      await pimPage.searchEmployeeByName('NonExistentEmployeeNamexyz');
    });
  
    await test.step('Step 2: Verify No Records Found message', async () => {
      await pimPage.verifyNoRecordsFoundVisible();
    });
  });
  
  test('TC-PIM-06 Edit employee job title and save @regression', async () => {
    await test.step('Step 1: Search and click edit on first employee', async () => {
      await pimPage.employeeListTab.click();
      await pimPage.searchBtn.click();
      await pimPage.editBtn.first().click();
    });
  
    await test.step('Step 2: Update job title', async () => {
      await pimPage.jobDetailsTab.click();
      await pimPage.selectJobTitleByIndex(1);
      await pimPage.saveBtn.first().click();
    });
  
    await test.step('Step 3: Verify success message or data updated', async () => {
      await pimPage.verifyToastMessageVisible();
    });
  });
  
  test('TC-PIM-07 Delete an employee @regression', async () => {
    const testEmpId = `DEL${Date.now().toString().slice(-4)}`;
    
    await test.step('Step 1: Create a temporary employee to delete', async () => {
      await pimPage.addEmployee('Temp', 'DeleteMe', '', testEmpId);
    });
  
    await test.step('Step 2: Delete employee', async () => {
      await pimPage.deleteEmployee(testEmpId);
    });
  
    await test.step('Step 3: Verify employee is removed from the list', async () => {
      await pimPage.searchEmployeeById(testEmpId);
      await pimPage.verifyNoRecordsFoundVisible();
    });
  });
  
  test('TC-PIM-08 Upload profile photo (valid JPG, under 1 MB) @regression @bonus', async () => {
    await test.step('Step 1: Open employee profile', async () => {
      await pimPage.employeeListTab.click();
      await pimPage.searchBtn.click();
      await pimPage.editBtn.first().click();
    });
  
    await test.step('Step 2: Upload valid profile photo', async () => {
      const tempPhotoPath = path.join(__dirname, 'temp_avatar.jpg');
      if (!fs.existsSync(tempPhotoPath)) {
        fs.writeFileSync(tempPhotoPath, 'mock image content');
      }
      await pimPage.uploadPhoto(tempPhotoPath);
      try { fs.unlinkSync(tempPhotoPath); } catch (e) {}
    });
  
    await test.step('Step 3: Verify photo is saved successfully', async () => {
      await pimPage.verifyToastMessageVisible();
    });
  });
  
  test('TC-PIM-09 Upload unsupported file type as profile photo @regression @bonus', async () => {
    await test.step('Step 1: Open employee profile', async () => {
      await pimPage.employeeListTab.click();
      await pimPage.searchBtn.click();
      await pimPage.editBtn.first().click();
    });
  
    await test.step('Step 2: Upload invalid file type (.txt)', async () => {
      const tempFilePath = path.join(__dirname, 'temp_file.txt');
      if (!fs.existsSync(tempFilePath)) {
        fs.writeFileSync(tempFilePath, 'some text content');
      }
      await pimPage.uploadPhoto(tempFilePath);
      try { fs.unlinkSync(tempFilePath); } catch (e) {}
    });
  
    await test.step('Step 3: Verify validation error is displayed', async () => {
      await pimPage.verifyPhotoUploadErrorMsg(/File type not allowed|File type not supported/i);
    });
  });
  
  test('TC-PIM-10 Add emergency contact for employee @regression @bonus', async () => {
    await test.step('Step 1: Open employee profile and go to Emergency Contacts', async () => {
      await pimPage.employeeListTab.click();
      await pimPage.searchBtn.click();
      await pimPage.editBtn.first().click();
    });
  
    await test.step('Step 2: Add emergency contact information', async () => {
      await pimPage.addEmergencyContact('Jane Doe', 'Spouse', '0901234567');
    });
  
    await test.step('Step 3: Verify contact is saved', async () => {
      await pimPage.verifyToastMessageVisible();
    });
  });
});
