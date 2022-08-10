use `nodelogin`;
CREATE TABLE IF NOT EXISTS `useraccounts` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `active` varchar(5) NOT NULL,
  `admintag` varchar(5) NOT NULL
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS `usergroups` (
  `groupname` varchar(250) NOT NULL,
  `username` varchar(50) NOT NULL
) ENGINE=InnoDB;
create table if not exists `application`(
`App_Acronym` varchar(100) NOT NULL,
`App_Description` longtext,
`App_Rnumber` int,
`App_startDate` date,
`App_endDate` date,
`App_permit_Create` varchar(100) NOT NULL,
`App_permit_Open` varchar(100) NOT NULL,
`App_permit_toDoList` varchar(100) NOT NULL,
`App_permit_Doing` varchar(100) NOT NULL,
`App_permit_Done` varchar(100) NOT NULL
) ENGINE=InnoDB;
create table if not exists `plan`(
`Plan_MVP_name` varchar(100) NOT NULL,
`Plan_startDate` date,
`Plan_endDate` date,
`Plan_app_Acronym` varchar(100) NOT NULL
) ENGINE=InnoDB;
create table if not exists `Task`(
`Task_name` varchar(100) NOT NULL,
`Task_description` longtext,
`Task_notes` longtext NOT NULL,
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