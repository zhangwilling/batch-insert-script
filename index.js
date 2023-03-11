const CHUNK_ITEM_COUNT = 200000;
const BATCH_ITEM_COUNT = 100;
const SLEEP_TIME = 30; // 30s

/**
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
 */
const sqlFactory = (insertStr) => `INSERT INTO count_test(id, col1, col2)  VALUES ${insertStr}`;
const valueFactory = (id) => `(${id},'string-${id}', 1)`

mainMysql(0, 24000000)
mainPgSql(0, 24000000)
mainOB(0, 24000000)

async function mainMysql(startId, step) {
  const Realm = require('leoric');
  const realm = new Realm({
    host: 'localhost',
    user: 'root',
    database: 'mytest'
  });
  // 你可以试试改为注释的这行，无休的批量插入
  await chunk(realm, startId, step, { batchCountLimit: BATCH_ITEM_COUNT, jobStartId: startId });
  // await sleepChunkJob(realm, startId, step)
  // process.exit();
}

async function mainPgSql(startId, step) {
  const Realm = require('leoric');
  const realm = new Realm({
    dialect: 'postgres',
    host: 'localhost',
    user: 'postgres',
    password: 'postgrespw',
    database: 'mytest',
    port: 5433
  });
  await chunk(realm, startId, step, { batchCountLimit: BATCH_ITEM_COUNT, jobStartId: startId });
  // await sleepChunkJob(realm, startId, step)
  // process.exit();
}

async function mainOB(startId, step) {
  const Realm = require('leoric');

  const realm = new Realm({
    host: 'localhost',
    port: '2881',
    user: 'root',
    database: 'mytest'
  });
  await chunk(realm, startId, step, { batchCountLimit: BATCH_ITEM_COUNT, jobStartId: startId });
  // 跟 docker 环境压力有关，如果内存有压力, OB 得歇歇，用这个慢慢插。
  // await sleepChunkJob(realm, startId, step)
  // process.exit();
}

async function sleepChunkJob(realm, startId, step) {
  console.log(`--------- job start, startId:${startId} step:${step}, endId: ${startId + step}------------`)

  const chunkCount = Math.ceil(step / CHUNK_ITEM_COUNT);
  const lastCount = step - (chunkCount - 1) * CHUNK_ITEM_COUNT;

  let currentId = startId;
  let accStep = 0;

  for (let i = 0; i < chunkCount; i++) {
    const isLast = i === chunkCount - 1;
    console.log(`--------- chunk ${i + 1}, start from ${currentId} ------------`);

    const step = (isLast ? lastCount : CHUNK_ITEM_COUNT);
    await chunk(realm, currentId, step, { batchCountLimit: BATCH_ITEM_COUNT, jobStartId: startId });
    currentId = currentId + step;
    accStep = accStep + step;

    console.log(`--------- chunk ${i + 1} end, next start from ${currentId} ------------`);
    if (!isLast) {
      console.log(`--------- sleep ${SLEEP_TIME}min ------------`);
      await sleep(SLEEP_TIME);
    }
  }

  console.log(`--------- job complete ${step} added------------`)
}


async function chunk(realm, chunkStartId, chunkStep, { batchCountLimit, jobStartId }) {
  console.log('--------- chunk start ------------')
  await realm.connect();

  let currentChunkStep = 0;
  let currentBatchCount = 0;
  let insertValueArr = [];

  while (currentChunkStep < chunkStep) {
    let id = chunkStartId + currentChunkStep;

    while (currentBatchCount < batchCountLimit && currentBatchCount < chunkStep) {
      ++id;
      // values 集合
      insertValueArr.push(valueFactory(id))

      currentBatchCount++;
    }

    const insertStr = insertValueArr.join(',');

    try {
      // insert into 语句
      await realm.query(sqlFactory(insertStr));
    } catch (e) {
      console.log("🚀 exec sql error", e);
    }

    currentChunkStep = currentChunkStep + batchCountLimit;
    const currentId = chunkStartId + currentChunkStep;
    console.log(`🚀 currentId: ${currentId}, accStep: ${currentId - jobStartId}, chunkStep: ${currentChunkStep}`);

    insertValueArr = [];
    currentBatchCount = 0;
  }
  await realm.disconnect();
  console.log(`---------chunk end ${chunkStep} added------------`)
}


async function sleep(second) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000 * second)
  })
}
