create table cart(
cart_id	int	not null primary key auto_increment,
loginid	int 	not null ,
product_id	int	not null,
item_count	int	not null,	
added_date	date	not null,
foreign key(loginid) references Login(loginid),
foreign key(product_id) references list_items(product_id) on delete cascade
);

insert into cart(loginid,product_id,item_count,added_date)
values (1,2,1,'2025-03-09'),(1,1,1,'2025-01-29'),(2,4,3,'2025-04-19');

select * from cart;
insert into cart(loginid,product_id,item_count,added_date)
values (1,3,2,'2025-03-09')