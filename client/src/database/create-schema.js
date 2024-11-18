import db from '../config/dbConfig';
import mysql from 'mysql2';

if(db) {
    createSchema();
}

function createSchema() {
    {
        const createDatabaseQuery = 'CREATE DATABASE IF NOT EXISTS massdb';
        connection.query(createDatabaseQuery, (err, result) => {
          if (err) {
            console.error('Error creating database: ', err.stack);
            return;
          }
          console.log('Database "massdb" created or already exists.');
      
          // Switch to the newly created database
          connection.changeUser({ database: 'massdb' }, (err) => {
            if (err) {
              console.error('Error changing to massdb: ', err.stack);
              return;
            }
      
            // Create tables (schema)
            const createUsersTableQuery = `
              CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone_number VARCHAR(15),
                password VARCHAR(255) NOT NULL
              )
            `;
      
            connection.query(createUsersTableQuery, (err, result) => {
              if (err) {
                console.error('Error creating users table: ', err.stack);
                return;
              }
              console.log('Users table created or already exists.');
            });
      
            const createGroupsTableQuery = `
              CREATE TABLE IF NOT EXISTS pay_groups (
                group_id INT AUTO_INCREMENT PRIMARY KEY,
                group_name VARCHAR(100) NOT NULL,
                billers VARCHAR(255) NOT NULL
              )
            `;
      
            connection.query(createGroupsTableQuery, (err, result) => {
              if (err) {
                console.error('Error creating posts table: ', err.stack);
                return;
              }
              console.log('Posts table created or already exists.');
            });

            const createGroupMembersTableQuery = `
              CREATE TABLE IF NOT EXISTS group_members (
                group_id INT,
                user_id INT,
                PRIMARY KEY (group_id, user_id),
                FOREIGN KEY (group_id) REFERENCES pay_groups(group_id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
              )
            `;
      
            connection.query(createGroupMembersTableQuery, (err, result) => {
              if (err) {
                console.error('Error creating posts table: ', err.stack);
                return;
              }
              console.log('Posts table created or already exists.');
            });

            const createReceiptsQuery = `
            CREATE TABLE IF NOT EXISTS receipts (
                receipt_id INT AUTO_INCREMENT PRIMARY KEY,
                total_amount DECIMAL(10, 2) NOT NULL,
                receipt_date DATE NOT NULL,
                group_id INT,
                billers VARCHAR(255),  -- Assuming this refers to a biller's name or identifier
                date TIMESTAMP DEFAULT NOW(),
                FOREIGN KEY (group_id) REFERENCES pay_groups(group_id)
              )
            `;
      
            connection.query(createReceiptsQuery, (err, result) => {
              if (err) {
                console.error('Error creating posts table: ', err.stack);
                return;
              }
              console.log('Posts table created or already exists.');
            });

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
      
            connection.query(createPaymentsQuery, (err, result) => {
              if (err) {
                console.error('Error creating posts table: ', err.stack);
                return;
              }
              console.log('Posts table created or already exists.');
            });

          });
        });
      }
      
      // Close the connection after all queries are done
      process.on('exit', () => {
        connection.end();
      });
}

