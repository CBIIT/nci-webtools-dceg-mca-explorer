export async function importData(logger) {
  logger.info(`Started mosaic tiler data import`);
}

importData(console).then((e) => {
  process.exit(0);
});
