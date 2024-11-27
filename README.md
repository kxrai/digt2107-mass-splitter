# 🚀 MASS Splitter

**Team Number:** 4  
**Team Members:**  
- Mahjabin Mollah  
- Alicia Loi  
- Sienna Markham  
- Steeve Nchanda  

---

### 💡 Project Overview

**MASS Splitter** is a simple and intuitive app designed to solve the common headache of splitting bills during group outings. Whether you’re out with friends for dinner or on a group trip, MASS Splitter helps you manage shared expenses effortlessly.

Tools We Are Using:
ReactJS
NodeJS
MySQL
TailwindCSS
DaisyUI

---

### 🎯 Key Features (MVP)

1. **Manual Bill Entry**  
   Users can manually input bill items and costs for quick entry.
   
2. **Add Party Members**  
   Easily add members from your contact list or enter details manually to split the bill.

3. **Automatic Bill Splitting**  
   MASS Splitter calculates the total bill and divides it evenly or by customized shares.

4. **Payment Notifications**  
   Notifications are sent to remind everyone of their share, with options to pay via SMS, email, or other messaging apps.

5. **Track Payments**  
   Track who has paid and who still owes money in real-time.

---

### 📂 Repository Structure

- **main branch**: Stable code releases.
- **development branch**: Active development.
- **feature branches**: Separate branches for each feature under development.

---

### 🛠️ How to Get Started

1. Clone the repository:
   ```bash
   git clone https://github.com/kxrai/digt2107-mass-software-project.git
   ```

   Make sure to run: ```npm install ``` in root directory
   
2. Set up the mysql database:
   - Download MySQL from https://dev.mysql.com/downloads/installer/
   - Install the MySQL Server and any additional products are optional like MySQL Workbench
   - Copy/Move the ```env.sample``` file from the ```samples``` directory into your root directory
   - Rename ```env.sample``` file to ```.env``` in your root directory
   - Replace ```my_db_password``` with your MySQL root password and it's recommended to leave the other default settings - make sure to save it!
   - Run the create-schema script to create your database:
      ```bash
      node client/src/database/create-schema.js
   Your database will be created with sample data!
   
3. Run the project:
   - Start React Frontend on one terminal
      ```bash
      cd client
      npm install
      npm start
      
   - Start Express Backend Server on another terminal
     ```bash
     cd server
     npm install
     npm start
MASS Splitter should now be running successfully!

   
   
