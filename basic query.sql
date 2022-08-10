use `nodelogin`;
select * from useraccounts;
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
INSERT INTO `useraccounts` (`username`, `password`, `email`, `active`, `admintag`) VALUES ('test3', 'test', 'test@test.com', '1', '0');
select * from usergroups;
delete from usergroups where groupname = 'test5';