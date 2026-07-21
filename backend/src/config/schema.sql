CREATE DATABASE IF NOT EXISTS weightogo_db;
USE weightogo_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role ENUM('Administrator (Admin)', 'Barangay Nutrition Scholar') NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  assigned_barangay VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS barangays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  lat DECIMAL(10, 4) NOT NULL,
  lng DECIMAL(10, 4) NOT NULL
);

CREATE TABLE IF NOT EXISTS children (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  barangay VARCHAR(255) NOT NULL,
  purok VARCHAR(100) NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  age_months INT NOT NULL,
  gender ENUM('Male', 'Female') NOT NULL,
  birthdate DATE NOT NULL,
  wfa_status ENUM('Normal', 'Underweight', 'Severe Underweight', 'Overweight', 'Obese') DEFAULT 'Normal',
  hfa_status ENUM('Normal', 'Stunted', 'Severe Stunted') DEFAULT 'Normal',
  wfhl_status ENUM('Normal', 'Wasted', 'Severely Wasted', 'Overweight', 'Obese') DEFAULT 'Normal',
  classification ENUM('normal', 'stunted', 'obese') DEFAULT 'normal',
  weight DECIMAL(5, 2) DEFAULT NULL,
  height DECIMAL(5, 2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT NOT NULL,
  month VARCHAR(3) NOT NULL,
  year INT NOT NULL,
  weight DECIMAL(5, 2) NOT NULL,
  height DECIMAL(5, 2) NOT NULL,
  wfa_status ENUM('Normal', 'Underweight', 'Severe Underweight', 'Overweight', 'Obese') DEFAULT 'Normal',
  hfa_status ENUM('Normal', 'Stunted', 'Severe Stunted') DEFAULT 'Normal',
  wfhl_status ENUM('Normal', 'Wasted', 'Severely Wasted', 'Overweight', 'Obese') DEFAULT 'Normal',
  classification ENUM('normal', 'stunted', 'obese') DEFAULT 'normal',
  assessed_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (assessed_by) REFERENCES users(id) ON DELETE SET NULL
);
