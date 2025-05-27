create table Login(
loginid	int	not null	primary key auto_increment,
UserName	VARCHAR(50)	not null,	
first_name	VARCHAR(50)	not null,	
last_Name	VARCHAR(50)	,	
emailaddress	VARCHAR(200)	not null,	
phoneNo	VARCHAR(200)	not null,
password	VARCHAR(200)	not null,	
DateOfBirth	DATE	not null,	
gender	VARCHAR(200)	null,	
address	int	 null
);

/*alter table Login
modify column address int null;*/
ALTER TABLE Login
ADD FOREIGN KEY (address) REFERENCES user_address(address_id);

 insert into Login(loginid,UserName,first_name,last_Name,emailaddress,phoneNo,password,DateOfBirth,gender,address)
 values (1,'chetan07','chetan','mehra','chetan@gmail.com','5555555555','Chetan1','2003-11-07','M',1),
 (2,'hament1','hement','mehra','hement@gmail,com','1111111111','hement1','1996-09-21','M',2),
 (3,'jay1','jay','mehra','jay@gmail.com','2222222222','jay1','2000-12-01','F',3);

select * from Login;
alter table login
add constraint unique_login
unique (loginid,
UserName(50),
first_name(50),
last_Name(50),
emailaddress(100),
phoneNo(20),
password(50),
DateOfBirth,
gender(10),
address
);











