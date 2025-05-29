CREATE TABLE ratings (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    login_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,  
    CONSTRAINT unique_rating UNIQUE (login_id, product_id),
    FOREIGN KEY (login_id) REFERENCES login(loginid) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES list_items(product_id) ON DELETE CASCADE
);

select * from ratings