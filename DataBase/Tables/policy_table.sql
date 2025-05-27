create table policy(
policy_id	int	not null primary key auto_increment,
policy_name	varchar(50)	not null,
policy_discription	varchar(230)	not null
);

insert into policy(policy_name,policy_discription)
values ('pay on delivery','make payment when order delivered'),('7 days replacement','replace order if it is  defected'),
('free delivery','no charges on delivery');

select * from policy;


ALTER TABLE policy
ADD CONSTRAINT unique_policy_name UNIQUE (policy_name);

