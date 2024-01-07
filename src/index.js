#!/usr/bin/env node
const yargs = require("yargs");
const path = require("path");
const fs = require("fs").promises;
const { logger } = require("./logger");
const fse = require('fs-extra');

async function isDirectory(path) {
  try {
    const stats = await fs.stat(path);
    return stats.isDirectory();
  } catch (err) {
    console.error(err);
    return false;
  }
}
logger.info("欢迎使用pack");

// E:\project\wangjunjun\WORK\FB-ERP-UI\dist
// E:\project\wangjunjun\WORK\PHP\FB-ERP\public

// pack --from FB-ERP-UI/dist --to PHP/FB-ERP/public
// pack --from stone-vue/dist/index.html --to PHP/stone/resources/views/dist
// pack --from stone-vue/dist/static --to PHP/stone/public/static

const argv = yargs
  .option("from", {
    // alias: 'e',
    describe: "类型",
    type: "string", // 参数类型为字符串
  })
  .option("to", {
    // alias: 'p',
    describe: "项目名称",
    type: "string", // 参数类型为数字
    string: true,
  }).argv;
async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch (err) {
    if (err.code === "ENOENT") {
      // 文件夹不存在，创建它
      await fs.mkdir(dir, { recursive: true });
    } else {
      // 其他错误，抛出异常
      throw err;
    }
  }
}

async function copyFilesRecursively(sourceDir, destinationDir) {
  try {
    // 获取源文件夹下的所有文件和子文件夹
    const files = await fs.readdir(sourceDir);

    //
    await ensureDirectoryExists(destinationDir);
    // 遍历所有文件和子文件夹
    for (const file of files) {
      const sourcePath = path.resolve(sourceDir, file);
      const destinationPath = path.resolve(destinationDir, file);

      // 判断是文件还是文件夹
      const isDirectory = (await fs.stat(sourcePath)).isDirectory();

      if (isDirectory) {
        // 如果是文件夹，递归调用 copyFilesRecursively 复制文件夹
        await copyFilesRecursively(sourcePath, destinationPath);
      } else {
        // 确保目标文件夹存在
        await ensureDirectoryExists(path.dirname(destinationPath));

        // 复制文件
        await fs.copyFile(sourcePath, destinationPath);
      }
    }
  } catch (error) {
    console.error("Error copying files:", error);
  }
}

async function copyFile(sourcePath, destinationPath) {
  try {
    // 使用 fs-extra 的 ensureDir 方法确保目标文件夹存在
    await fse.ensureDir(path.dirname(destinationPath));

    // 如果目标路径是目录，创建一个文件，否则复制文件
    const isDirectory = (await fs.stat(destinationPath)).isDirectory();
    if (isDirectory) {
      const fileName = path.basename(sourcePath);
      destinationPath = path.join(destinationPath, fileName);
    }

    // 使用 fs-extra 的 copy 方法，如果目标文件已存在则进行覆盖
    await fse.copy(sourcePath, destinationPath, { overwrite: true });

    console.log(`${sourcePath} 已成功复制到 ${destinationPath}`);
  } catch (error) {
    console.error(`复制文件时发生错误: ${error}`);
  }
}


async function run() {
  const cwd = process.cwd();
  try {
    if (argv.from && argv.to) {
      /**
       * @type string
       */
      const from = path.join(cwd, argv.from);
      /**
       * @types
       */
      const to = path.join(cwd, argv.to);

      if (!(await isDirectory(to))) {
        logger.error("to 必须是个文件夹");
        return;
      }

      if (await isDirectory(from)) {
        logger.info(`复制文件夹[${from}] 复制到 [${to}]`);
        await copyFilesRecursively(from, to);
      } else {
        logger.info(`复制文件[${from}] 复制到 [${to}]`);
        await copyFile(from, to);
      }
    } else {
      logger.error("参数不正确");
    }
  } catch (error) {
    logger.error(error);
  }
}

run();
