create table category(
category_id	int	not null  primary key AUTO_INCREMENT,
category_name	varchar(50)	not null);	

insert into category(category_name)
values('electronics'),('Clothing'),('toys and games');

select * from category;
