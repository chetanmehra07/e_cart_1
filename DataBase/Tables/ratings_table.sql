CREATE TABLE ratings (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    login_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    CONSTRAINT unique_rating UNIQUE (login_id, product_id)
);

select * from ratings