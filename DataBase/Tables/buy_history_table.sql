create table buy_history(
buy_id	int	not null primary key auto_increment,
login_id	int	not null,	
product_id	int	not null,	
buy_date	date	not null,	
delivared_address	int	not null,
foreign key(login_id) references login(loginid) on delete cascade ,
foreign key(product_id) references list_items(product_id) on delete cascade,
foreign key(delivared_address) references user_address(address_id)
on delete cascade
);
insert into buy_history(login_id,product_id,buy_date,delivared_address)
values (2,3,'2025-02-24',3),(2,1,'2025-03-14',3),(1,2,'2025-4-04',2);

select * from buy_history;


