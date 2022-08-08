select * from usergroups;
delete from usergroups where groupname = 'test5';
create table if not exists `Task`(
`Task_name` varchar(100) NOT NULL,
`Task_description` varchar(100) NOT NULL,
`Task_notes` varchar(100) NOT NULL,
`Task_id` varchar(200) NOT NULL,
`Task_plan` varchar(200) NOT NULL,
`Task_app_Acronym` varchar(200) NOT NULL,
`Task_state` varchar(200) NOT NULL,
`Task_creator` varchar(200) NOT NULL,
`Task_owner` varchar(200) NOT NULL,
`Task_createDate` varchar(200) NOT NULL
) ENGINE=InnoDB;
select * from application;
alter table application modify column app_enddate date;
select * from plan;