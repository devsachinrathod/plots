< ! -- CREATE TABLE internship_applications (
id INT AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(255) NOT NULL,
last_name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
contact VARCHAR(20) NOT NULL,
education_status VARCHAR(255) NOT NULL,
country_name VARCHAR(255) NOT NULL,
city_name VARCHAR(255) NOT NULL,
department_applied VARCHAR(255) NOT NULL,
preferred_date DATE NOT NULL,
remote ENUM('yes', 'no') NOT NULL,
unpaid ENUM('yes', 'no') NOT NULL,
submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-->
< ! -- CREATE TABLE users (
email VARCHAR(255) PRIMARY KEY,
pass VARCHAR(255) NOT NULL
);
-->