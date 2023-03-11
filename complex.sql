--mysql、ob
DROP TABLE IF EXISTS `count_complex_test`;
CREATE TABLE `count_complex_test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `col1` varchar(190) NOT NULL,
  `col2` varchar(255) NOT NULL,
  `col3` int NOT NULL,
  `col4` int NOT NULL DEFAULT '0',
  `col5` longtext,
  `col6` int NOT NULL DEFAULT '1',
  `col7` int DEFAULT NULL,
  `col8` varchar(20) NOT NULL DEFAULT '0',
  `col9` int unsigned NOT NULL DEFAULT '0',
  `col10` int unsigned NOT NULL DEFAULT '0',
  `col11` datetime(6) DEFAULT NULL,
  `col12` longblob,
  `col13` longblob,
  `created_at` datetime(6) DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime(6) DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_col4_col3_col1` (`col4`,`col3`,`col1`),
  UNIQUE KEY `idx_col3_col2` (`col3`,`col2`),
  KEY `idx_col3` (`col3`),
  KEY `idx_col4` (`col4`),
  KEY `idx_col6` (`col6`),
  KEY `idx_col7` (`col7`),
  KEY `idx_col9` (`col9`),
  KEY `idx_col10` (`col10`),
  KEY `idx_col11` (`col11`),
  KEY `idx_col3_col8` (`col3`,`col8`),
  KEY `idx_col3_col11` (`col3`,`col11`),
  KEY `idx_update_at` (`updated_at`)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Pg

DROP  TABLE IF EXISTS "count_complex_test";
CREATE TABLE "count_complex_test" (
  "id" int4 NOT NULL,
  "col1" varchar(190) NOT NULL ,
  "col2" varchar(255) NOT NULL,
  "col3" int4 NOT NULL,
  "col4" int4 NOT NULL DEFAULT 0,
  "col5" text,
  "col6" int4 NOT NULL DEFAULT 0,
  "col7" int4,
  "col8" varchar(20) NOT NULL DEFAULT '',
  "col9" int4 NOT NULL DEFAULT 0,
  "col10" int4 NOT NULL DEFAULT 0,
  "col11" timestamp,
  "col12" bytea,
  "col13" bytea,
  "created_at" timestamp DEFAULT NULL, 
  "updated_at" timestamp DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX "idx_col4_col3_col1" ON "count_complex_test" USING btree (
  "col4",
  "col3",
  "col1"
);
CREATE INDEX "idx_col3_col2" ON "count_complex_test" USING btree (
  "col3",
  "col2"
);
CREATE INDEX "idx_col3" ON "count_complex_test" USING btree (
  "col3"
);
CREATE INDEX "idx_col4" ON "count_complex_test" USING btree (
  "col4"
);
CREATE INDEX "idx_col6" ON "count_complex_test" USING btree (
  "col6"
);
CREATE INDEX "idx_col7" ON "count_complex_test" USING btree (
  "col7"
);
CREATE INDEX "idx_col9" ON "count_complex_test" USING btree (
  "col9"
);
CREATE INDEX "idx_col10" ON "count_complex_test" USING btree (
  "col10"
);
CREATE INDEX "idx_col11" ON "count_complex_test" USING btree (
  "col11"
);
CREATE INDEX "idx_col3_col8" ON "count_complex_test" USING btree (
  "col3",
  "col8"
);
CREATE INDEX "idx_col3_col11" ON "count_complex_test" USING btree (
  "col3",
  "col11"
);
CREATE INDEX "idx_update_at" ON "count_complex_test" USING btree (
  "updated_at"
);
COMMENT ON COLUMN "count_complex_test"."created_at" IS '创建时间';
COMMENT ON COLUMN "count_complex_test"."updated_at" IS '修改时间';

