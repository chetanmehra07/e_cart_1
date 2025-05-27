create table list_items(	
product_id	int	not null	primary key auto_increment,
product_name	varchar(100)	not null,
MRP	float	not null,
discount	float,
stock_avl	int	,
free_delivery_status	bit	not null,	
item_category	int	not null,
product_image	varchar(100)	not null	,
applicable_policies	varchar(250)	not null,	
specs	varchar(100)	not null,
foreign key (item_category) references category(category_id)
);	
 
 insert into list_items(product_name,MRP,discount,stock_avl,free_delivery_status,item_category,product_image,applicable_policies,specs)
 values('pocom2','15000','20',1,1,1,'pocom2 image','4','brand-poco  storage-128GB 8GB- RAM '),
 ('VIVO2','25000','10',1,1,1,'VIVO2 image','2','brand-VIVO  storage-128GB 16GB- RAM '),
 ('MACBOOK','250000','20',1,1,1,'MAC image','5','brand-apple  storage-2TB 16GB- RAM '),
 ('VIVO2','25000','10',1,1,1,'VIVO2 image','4','brand-VIVO  storage-128GB 16GB- RAM '),
 ('man-shirt','500','5',0,0,2,'shrt-image',5,'size-M'),
 ('uno-cards','100','10',1,1,1,'cards_image',2,'2 extra cards');
 
select * from list_items;

