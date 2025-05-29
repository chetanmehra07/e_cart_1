create table orders(
order_id int not null primary key auto_increment,
login_id int not null,
product_id int not null,
order_date date	not null,
delivery_date  date not null,
quantity int not null,
FOREIGN KEY (login_id) REFERENCES login(loginid) ON DELETE CASCADE,
FOREIGN KEY (product_id) REFERENCES list_items(product_id) ON DELETE CASCADE
);
ALTER TABLE orders
ADD COLUMN delivery_address INT NOT NULL;

ALTER TABLE orders
ADD CONSTRAINT fk_delivery_address
FOREIGN KEY (delivery_address) REFERENCES user_address(address_id);

UPDATE orders 
SET delivery_date = '2023-05-29'  -- or any past date
WHERE order_id = 1;               -- replace with actual order ID


select * from orders



