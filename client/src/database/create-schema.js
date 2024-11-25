// create-schema.js

const mysql = require('mysql2/promise');
const path = require('path');

// Load environment variables from the .env file located three directories up
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

// Debug: Log the resolved .env path
console.log('Resolved .env path:', path.resolve(__dirname, '../.env'));

async function createSchema() {
  let connection;

  try {
    // Connect to MySQL without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS massdb');
    console.log('Database "massdb" created or already exists.');

    // Switch to the newly created database
    await connection.changeUser({ database: 'massdb' });

    // Create tables
    await createTables(connection);

    console.log('All tables created successfully.');
  } catch (err) {
    console.error('Error during schema creation:', err);
  } finally {
    if (connection && connection.end) connection.end();
  }
}

async function createTables(connection) {
  // Create 'users' table
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone_number VARCHAR(15),
      password VARCHAR(255)
    ) 
  `;

  await connection.query(createUsersTableQuery);
  console.log('Users table created or already exists.');

  // Create users sample data
  const usersSampleDataQuery = `
    INSERT INTO users (username, email) VALUES ('Mahjabin', 'jabineus25@gmail.com'), ('Alicia', 'alicia.2005.loi@gmail.com'), ('Sienna', 'skn.markham@gmail.com'), ('Steeve', 'steevezacky@gmail.com')
    `;

  await connection.query(usersSampleDataQuery);
  console.log('Users table sample data created.');
  
  // Create 'pay_groups' table
  const createGroupsTableQuery = `
    CREATE TABLE IF NOT EXISTS pay_groups (
      group_id INT AUTO_INCREMENT PRIMARY KEY,
      group_name VARCHAR(100) NOT NULL,
      billers VARCHAR(255) NOT NULL
    )
  `;

  await connection.query(createGroupsTableQuery);
  console.log('Pay_groups table created or already exists.');

  // Create pay_groups sample data
  const groupsSampleDataQuery = `
    INSERT INTO pay_groups (group_name, billers) VALUES ('Group1', 'Mahjabin'), ('Group2','Alicia')
    `;

  await connection.query(groupsSampleDataQuery);
  console.log('Pay_groups table sample data created.');
  
  // Create 'group_members' table
  const createGroupMembersTableQuery = `
    CREATE TABLE IF NOT EXISTS group_members (
      group_id INT,
      user_id INT,
      PRIMARY KEY (group_id, user_id),
      FOREIGN KEY (group_id) REFERENCES pay_groups(group_id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `;

  await connection.query(createGroupMembersTableQuery);
  console.log('Group_members table created or already exists.');
  
  // Create group_members sample data
  const groupMembersSampleDataQuery = `
    INSERT INTO group_members (group_id, user_id) VALUES (1, 1), (1, 3), (2, 2), (2, 4)
    `;

  await connection.query(groupMembersSampleDataQuery);
  console.log('Group_members table sample data created.');
  

  // Create 'receipts' table
  const createReceiptsQuery = `
    CREATE TABLE IF NOT EXISTS receipts (
      receipt_id INT AUTO_INCREMENT PRIMARY KEY,
      total_amount DECIMAL(10, 2) NOT NULL,
      receipt_date DATE NOT NULL,
      group_id INT NOT NULL,
      billers VARCHAR(255) NOT NULL,
      date TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (group_id) REFERENCES pay_groups(group_id)
    )
  `;

  await connection.query(createReceiptsQuery);
  console.log('Receipts table created or already exists.');

  // Create receipts sample data
  const receiptsSampleDataQuery = `
    INSERT INTO receipts (total_amount, receipt_date, group_id, billers) VALUES (500, '2024-05-06', 1, 'Mahjabin'), (200, '2024-07-08',2, 'Alicia')
    `;

  await connection.query(receiptsSampleDataQuery);
  console.log('Receipts table sample data created.');
  
  // Create 'payments' table
  const createPaymentsQuery = `
    CREATE TABLE IF NOT EXISTS payments (
      payment_id INT AUTO_INCREMENT PRIMARY KEY,
      receipt_id INT,
      user_id INT,
      debt DECIMAL(10, 2) NOT NULL,
      paid DECIMAL(10, 2) NOT NULL,
      date TIMESTAMP DEFAULT NOW(),
      method VARCHAR(50),
      FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `;

  await connection.query(createPaymentsQuery);
  console.log('Payments table created or already exists.');
  
  // Create payments sample data
  const paymentsSampleDataQuery = `
    INSERT INTO payments (receipt_id, user_id, debt, paid, method) VALUES (1, 3, 500, 500, 'credit card'), (2, 4, 200, 200, 'debit card')
    `;

  await connection.query(paymentsSampleDataQuery);
  console.log('Payments table sample data created.');
  
  // Create 'friends' table
  const createFriendsQuery = `
    CREATE TABLE IF NOT EXISTS friends (
      user_id INT,
      friend_id INT,
      PRIMARY KEY (user_id, friend_id),
      FOREIGN KEY (friend_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `;

  await connection.query(createFriendsQuery);
  console.log('Friends table created or already exists.');
  
  // Create friends sample data
  const friendsSampleDataQuery = `
    INSERT INTO friends (user_id, friend_id) VALUES (1, 3);
    `;

  await connection.query(friendsSampleDataQuery);
  console.log('Friends table sample data created.');
  
}

// Start the schema creation process
createSchema();
