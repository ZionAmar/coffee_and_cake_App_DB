-- יצירת מסד נתונים coffee_and_cake
CREATE DATABASE IF NOT EXISTS coffee_and_cake;

-- השימוש במסד נתונים coffee_and_cake
USE coffee_and_cake;

-- יצירת טבלה data
CREATE TABLE IF NOT EXISTS data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    choice VARCHAR(255),
    date DATE,
    time TIME
);

-- יצירת טבלה users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(254),
    email VARCHAR(254)
);