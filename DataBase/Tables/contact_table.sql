create table contact(
contact_id	int	not null	primary key auto_increment,
conatact_name	varchar(100)	not null,
conatact_email	varchar(120)	not null,
conatact_subject	varchar(100)	not null,
contact_message text);

select * from contact;