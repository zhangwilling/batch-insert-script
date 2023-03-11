-- Mysql、OB
DROP TABLE IF EXISTS `count_test`;
CREATE TABLE `count_test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `col1` varchar(255) NOT NULL,
  `col2` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_col1` (`col1`),
  KEY `idx_col2` (`col2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Pg
DROP  TABLE IF EXISTS "count_test";
CREATE TABLE "count_test" (
  "id" int4 NOT NULL,
  "col1" varchar(255) NOT NULL,
  "col2" int4 NOT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX "idx_col1" ON "count_test" USING btree (
  "col1"
);
CREATE INDEX "idx_col2" ON "count_test" USING btree (
  "col2"
);
