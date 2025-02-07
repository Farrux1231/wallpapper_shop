CREATE DATABASE shop;
use shop;
CREATE Table user(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(64),
    phone VARCHAR(64),
    password VARCHAR(64),
    role ENUM('admin', 'user') DEFAULT "user"
);

ALTER TABLE user ADD COLUMN isActive BOOLEAN DEFAULT false;
CREATE Table category(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name_uz VARCHAR(64),
    name_en VARCHAR(64),
    image VARCHAR(64)
);
CREATE Table brand(
    id INTEGER AUTO_INCREMENT PRIMARY key,
    name_uz VARCHAR(64),
    name_en VARCHAR(64),
    image VARCHAR(64)
);

CREATE Table country (
    id INTEGER AUTO_INCREMENT PRIMARY key,
    name_uz VARCHAR(64),
    name_en VARCHAR(64)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_uz VARCHAR(64),
    name_en VARCHAR(64),
    brand_id INT,
    country_id INT,
    price INT,
    old_price INT,
    available BOOLEAN,
    description_uz VARCHAR(255),
    description_en VARCHAR(255),
    washable BOOLEAN,
    size INT,
    Foreign Key (brand_id) REFERENCES brand(id),
    Foreign Key (country_id) REFERENCES country(id)
);

ALTER TABLE products ADD COLUMN image VARCHAR(128);

CREATE TABLE categoryItem(
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    product_id INT,
    Foreign Key (category_id) REFERENCES category(id),
    Foreign Key (product_id) REFERENCES products(id)
);

CREATE Table orders(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_prise INT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE Table orderItem(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    order_id INT,
    count INT,
    total INT,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(order_id) REFERENCES orders(id)


);




