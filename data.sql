CREATE DATABASE projet3;
USE projet3;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `pseudonym` VARCHAR(100)  NOT NULL ,
    `password` VARCHAR(100) NOT NULL,
    `firstname` VARCHAR(150)  NULL ,
    `lastname` VARCHAR(150) NULL ,
    `email` VARCHAR(100)  NOT NULL ,
    `mobile` VARCHAR(100)  NOT NULL ,
    `user_img` VARCHAR(250) NULL ,
    `adress` VARCHAR(150)  NULL ,
    `socials` VARCHAR(150)  NULL ,
    `competences` VARCHAR(150) NULL ,
    `description` VARCHAR(1500) NULL ,
    `experience_points` INT NULL ,
    `projects_id` INT NULL ,
    `ideas_id` INT NULL ,
    `is_admin` BOOLEAN NULL ,
    PRIMARY KEY (
        `id`
    )
);

DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `title` VARCHAR(100)  NOT NULL ,
    `description` VARCHAR(1500)  NOT NULL ,
    `socials` VARCHAR(150) NULL ,
    `img` VARCHAR(150) NULL ,
    `localisation` VARCHAR(150) NULL ,
    `project_date` DATE NOT NULL DEFAULT '0000-00-00' ,
    `owner_id` INT NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

DROP TABLE IF EXISTS `ideas`;
CREATE TABLE `ideas` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `title` VARCHAR(100)  NOT NULL ,
    `description` VARCHAR(840)  NOT NULL ,
    `img` VARCHs01
    `idea_date` DATE NOT NULL DEFAULT '0000-00-00' ,
    `owner_id` INT NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `project_id` INT  NOT NULL ,
    `idea_id` INT  NOT NULL ,
    `categorie` VARCHAR(150)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `users_tags` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `tag_names` VARCHAR(100)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `comments` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `comment_content` VARCHAR(480)  NOT NULL ,
    `comment_date` DATE  NOT NULL ,
    `idea_id` INT  NOT NULL ,
    `writer_id` INT  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `badges` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `badge_name` VARCHAR(100)  NOT NULL ,
    `badge_img` VARCHAR(100)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `user_badges` (
    `badges_id` INT  NOT NULL ,
    `user_id` INT  NOT NULL 
);

CREATE TABLE `user_tag` (
    `tag_id` INT  NOT NULL ,
    `user_id` INT  NOT NULL 
);

CREATE TABLE `category_tag` (
    `categories_tag_id` INT  NOT NULL ,
    `categories_id` INT  NOT NULL 
);

CREATE TABLE `categories_tag` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `category_tag_names` VARCHAR(100),
    PRIMARY KEY (
        `id`
    )
);

ALTER TABLE `users` ADD CONSTRAINT `fk_users_projects_id` FOREIGN KEY(`projects_id`)
REFERENCES `projects` (`id`);

ALTER TABLE `users` ADD CONSTRAINT `fk_users_ideas_id` FOREIGN KEY(`ideas_id`)
REFERENCES `ideas` (`id`);

ALTER TABLE `categories` ADD CONSTRAINT `fk_categories_projects_id` FOREIGN KEY(`projects_id`)
REFERENCES `projects` (`id`);

ALTER TABLE `categories` ADD CONSTRAINT `fk_categories_idea_id` FOREIGN KEY(`idea_id`)
REFERENCES `ideas` (`id`);

ALTER TABLE `comments` ADD CONSTRAINT `fk_comments_idea_id` FOREIGN KEY(`idea_id`)
REFERENCES `ideas` (`id`);

ALTER TABLE `user_badges` ADD CONSTRAINT `fk_user_badges_badges_id` FOREIGN KEY(`badges_id`)
REFERENCES `badges` (`id`);

ALTER TABLE `user_badges` ADD CONSTRAINT `fk_user_badges_user_id` FOREIGN KEY(`user_id`)
REFERENCES `users` (`id`);

ALTER TABLE `user_tag` ADD CONSTRAINT `fk_user_tag_tag_id` FOREIGN KEY(`tag_id`)
REFERENCES `users_tags` (`id`);

ALTER TABLE `user_tag` ADD CONSTRAINT `fk_user_tag_user_id` FOREIGN KEY(`user_id`)
REFERENCES `users` (`id`);

ALTER TABLE `category_tag` ADD CONSTRAINT `fk_category_tag_categories_tag_id` FOREIGN KEY(`categories_tag_id`)
REFERENCES `categories_tag` (`id`);

ALTER TABLE `category_tag` ADD CONSTRAINT `fk_category_tag_categories_id` FOREIGN KEY(`categories_id`)
REFERENCES `categories` (`id`);
