create table user_address(
address_id	int	not null primary key auto_increment,
login_id	int	not null,
address_part1	varchar(255)	not null,
address_part2	varchar(255)	not null,
city	varchar(50)	not null,
state	int	not null,
nation	varchar(100)	not null,
pincode	varchar(200)	not null,
landmark	varchar(100)	not  null,
foreign key(login_id) references login(loginid),
foreign key(state) references states(state_id)
);
alter table user_address drop column dafault_address;

 insert into user_address(login_id,address_part1,address_part2,city,state,nation,pincode,landmark)
 values(1,'182 pawan putra H colony','meenawala','jaipur','2','india','123456','near universe'),
 (1,'nit ap','tadepalligudam','west godavari','1','india','341145','near kandhenu mess'),
 (2,'182 pawan putra H colony','meenawala','jaipur','1','india','123456','near universe'),
 (3,'182 pawan putra H colony','meenawala','jaipur','1','india','123456','near universe')	;
 
select * from user_address;
SHOW CREATE TABLE login;
/*SELECT * FROM login WHERE address IS NOT NULL AND address NOT IN (SELECT address_id FROM user_address);
UPDATE login
SET address = NULL
WHERE address IS NOT NULL AND address NOT IN (SELECT address_id FROM user_address);*/
/*ALTER TABLE login
ADD CONSTRAINT login_ibfk_1
FOREIGN KEY (address)
REFERENCES user_address(address_id)
ON DELETE SET NULL;

SELECT * FROM login WHERE loginid = 1;*/

ALTER TABLE user_address
ADD CONSTRAINT unique_user_address
UNIQUE (
    login_id,
    address_part1(100),
    address_part2(100),
    city(20),
    state,
    nation(50),
    pincode(20),
    landmark(50)
);





