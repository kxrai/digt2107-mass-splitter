-- Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    password VARCHAR(255) NOT NULL
);

-- Groups Table
CREATE TABLE pay_groups (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    billers VARCHAR(255)  -- Assuming this could store multiple billers; adjust type as needed
);

-- Group Members Table (Associative Table for Groups and Users)
CREATE TABLE group_members (
    group_id INT,
    user_id INT,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES pay_groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Receipts Table
CREATE TABLE receipts (
    receipt_id INT AUTO_INCREMENT PRIMARY KEY,
    total_amount DECIMAL(10, 2) NOT NULL,
    receipt_date DATE NOT NULL,
    group_id INT,
    billers VARCHAR(255),  -- Assuming this refers to a biller's name or identifier
    date DATE NOT NULL,
    FOREIGN KEY (group_id) REFERENCES pay_groups(group_id)
);

-- Payments Table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_id INT,
    user_id INT,
    debt DECIMAL(10, 2) NOT NULL,
    paid DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    method VARCHAR(50),
    FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);