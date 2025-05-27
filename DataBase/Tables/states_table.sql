create table states(
state_id	int	not null primary key auto_increment,
statename	varchar(50)	not null
);
insert into states (statename)
values ('Andhra'),('Rajasthan'),('Delhi'),('U.P');

SELECT * from states
order by statename; 	
alter table states
add constraint unique_states
unique(
state_id, statename)