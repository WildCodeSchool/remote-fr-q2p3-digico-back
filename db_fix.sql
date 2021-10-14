CREATE DATABASE projet3;
USE projet3;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `pseudonym` VARCHAR(100)  NOT NULL, 
    `password` VARCHAR(100) NOT NULL,
    `firstname` VARCHAR(150)  NOT NULL ,
    `lastname` VARCHAR(150)  NULL ,
    `email` VARCHAR(100)  NOT NULL ,
    `mobile` VARCHAR(100)  NOT NULL ,
    `user_img` VARCHAR(250)  NULL ,
    `address` VARCHAR(150)  NULL ,
    `socials` VARCHAR(150)  NULL ,
    `skills` VARCHAR(150)  NULL ,
    `description` VARCHAR(1500)  NULL ,
    `experience_points` INT  NULL ,
    `is_admin` BOOLEAN  NULL ,
    PRIMARY KEY (
        `id`
    )
);

DROP TABLE IF EXISTS projects;
CREATE TABLE `projects` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `title` VARCHAR(100)  NOT NULL ,
    `description` VARCHAR(1500)  NOT NULL ,
    `socials` VARCHAR(150)  NULL ,
    `img` VARCHAR(455)  NOT NULL ,
    `localisation` VARCHAR(150)  NULL ,
    `project_date` DATE  NOT NULL DEFAULT '0000-00-00',
    `user_id` INT  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

DROP TABLE IF EXISTS ideas;
CREATE TABLE `ideas` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `title` VARCHAR(100)  NOT NULL ,
    `description` VARCHAR(840)  NOT NULL ,
    `socials` VARCHAR(150)  NULL ,
    `img` VARCHAR(150)  NULL ,
    `idea_date` DATE  NOT NULL DEFAULT '0000-00-00',
    `user_id` INT  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

DROP TABLE IF EXISTS comments;
CREATE TABLE `comments` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `comment_content` VARCHAR(480)  NOT NULL ,
    `comment_date` DATE  NOT NULL DEFAULT '0000-00-00',
    `idea_id` INT  NOT NULL ,
    `user_id` INT  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

DROP TABLE IF EXISTS categories;
CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `category_name` VARCHAR(150)  NOT NULL ,
    `project_id` INT  NOT NULL ,
    `idea_id` INT  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

DROP TABLE IF EXISTS user_tags;
CREATE TABLE `user_tags` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `tag_name` VARCHAR(100)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

DROP TABLE IF EXISTS user_tag;
CREATE TABLE `user_tag` (
    `user_tag_id` INT  NOT NULL ,
    `user_id` INT  NOT NULL 
);

DROP TABLE IF EXISTS badges;
CREATE TABLE `badges` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `badge_name` VARCHAR(100)  NOT NULL ,
    `badge_img` VARCHAR(100)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

DROP TABLE IF EXISTS user_badge;
CREATE TABLE `user_badge` (
    `badge_id` INT  NOT NULL ,
    `user_id` INT  NOT NULL 
);

DROP TABLE IF EXISTS category_tag;
CREATE TABLE `category_tag` (
    `category_tag_id` INT  NOT NULL ,
    `category_id` INT  NOT NULL 
);

DROP TABLE IF EXISTS category_tags;
CREATE TABLE `category_tags` (
    `id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL ,
    `category_tag_name` VARCHAR(100)
);

-- Ajout des contraintes

ALTER TABLE `projects` ADD CONSTRAINT `fk_projects_user_id` FOREIGN KEY(`user_id`)
REFERENCES `users` (`id`);

ALTER TABLE `ideas` ADD CONSTRAINT `fk_ideas_user_id` FOREIGN KEY(`user_id`)
REFERENCES `users` (`id`);

ALTER TABLE `comments` ADD CONSTRAINT `fk_comments_idea_id` FOREIGN KEY(`idea_id`)
REFERENCES `ideas` (`id`);

ALTER TABLE `comments` ADD CONSTRAINT `fk_comments_user_id` FOREIGN KEY(`user_id`)
REFERENCES `users` (`id`);

ALTER TABLE `categories` ADD CONSTRAINT `fk_categories_project_id` FOREIGN KEY(`project_id`)
REFERENCES `projects` (`id`);

ALTER TABLE `categories` ADD CONSTRAINT `fk_categories_idea_id` FOREIGN KEY(`idea_id`)
REFERENCES `ideas` (`id`);

ALTER TABLE `user_tag` ADD CONSTRAINT `fk_user_tag_user_tag_id` FOREIGN KEY(`user_tag_id`)
REFERENCES `user_tags` (`id`);

ALTER TABLE `user_tag` ADD CONSTRAINT `fk_user_tag_user_id` FOREIGN KEY(`user_id`)
REFERENCES `users` (`id`);

ALTER TABLE `user_badge` ADD CONSTRAINT `fk_user_badge_badge_id` FOREIGN KEY(`badge_id`)
REFERENCES `badges` (`id`);

ALTER TABLE `user_badge` ADD CONSTRAINT `fk_user_badge_user_id` FOREIGN KEY(`user_id`)
REFERENCES `users` (`id`);

ALTER TABLE `category_tag` ADD CONSTRAINT `fk_category_tag_category_tag_id` FOREIGN KEY(`category_tag_id`)
REFERENCES `category_tags` (`id`);

ALTER TABLE `category_tag` ADD CONSTRAINT `fk_category_tag_category_id` FOREIGN KEY(`category_id`)
REFERENCES `categories` (`id`);

ALTER TABLE `projects` ADD claps INT NULL AFTER project_date;
ALTER TABLE `projects` ADD contributors INT NULL AFTER claps;
ALTER TABLE `projects` MODIFY COLUMN project_date VARCHAR(80) NOT NULL;
ALTER TABLE `projects` ADD category VARCHAR(32) NOT NULL AFTER claps;
ALTER TABLE `ideas` MODIFY COLUMN idea_date VARCHAR(80) NOT NULL;
