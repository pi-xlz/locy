import { Command } from "commander";
import { logger, whiteBold } from "../utils/logger";
import { getLofoConfig } from "../utils/get-config";
import { FONTS_DIR_NAME } from "../constants";
import fs, { pathExistsSync } from "fs-extra";
import path from "path";
import { reWriteFileSync } from "../utils/write-file";
import { isTypescriptProject } from "../utils/get-project-info";
import { getFontsDir } from "../helpers/get-fonts-dir";
import { folderExists, isFontFamilyDir } from "../utils/exists";
import prompts, { type Choice } from "prompts";

export const remove = new Command()
  .name("remove")
  .alias("rm")
  .description("remove a font family")
  .argument("[family]", "font family to remove")
  .option("-a, --all", "remove all font families")
  .action(removeHandler);

const { fonts, reachedSuccess, signalSuccess, updateFonts } = getLofoConfig();
function removeHandler(family: string, options: any) {
  const fontsDirPath = getFontsDir();

  if (!fs.pathExistsSync(fontsDirPath as string)) {
    // throw new Error(`${FONTS_DIR_NAME} directory does not exist`);
    logger.error(`${whiteBold(FONTS_DIR_NAME)} directory does not exist`);
    process.exit(1);
  }
  // remove all font families
  if (options.all) return removeFontFamily("", "all");

  if (!fonts) {
    logger.error(
      `${whiteBold(
        FONTS_DIR_NAME
      )} entry is missing in lofo-config.json. Try adding font files to your project and try again...`
    );
    process.exit(1);
  }
  if (fonts && !fonts.length && reachedSuccess) {
    logger.warning(
      `${whiteBold(
        FONTS_DIR_NAME
      )} entry is empty in lofo-config.json. Try adding font files to your project and try again...`
    );
    process.exit(1);
  }
  if (family && !fonts.includes(family)) {
    logger.warning(
      `Font family ${whiteBold(
        family
      )} does not exist. Ensure it exists in the ${whiteBold(
        FONTS_DIR_NAME
      )} directory and try again...`
    );
    process.exit(1);
  }

  const fontChoices = fonts.map(
    (font): Choice => ({
      title: font,
      value: font,
    })
  );

  if (family) return removeFontFamily(family);

  prompts({
    type: "select",
    name: "fontToRemove",
    message: "What font do you want to remove?",
    choices: fontChoices,
  })
    .then((res) => {
      if (!res.fontToRemove) return;
      removeFontFamily(res.fontToRemove);
    })
    .catch((err) => logger.error(err));
}

const removeFontFamily = (
  family?: string,
  flag: "single" | "all" = "single"
) => {
  const fontsDirPath = getFontsDir();
  const itemsInFontsDir = fs.readdirSync(fontsDirPath as string);
  const indexFile = isTypescriptProject() ? "index.ts" : "index.js";
  const indexFilePath = path.join(fontsDirPath!, indexFile);
  if (flag === "single") {
    logger.info(`Removing font family: ${family}`);
    if (!family) {
      logger.warning("Please specify a font family to remove");
      process.exit(1);
    }
    if (!itemsInFontsDir.includes(family as string)) {
      throw new Error(
        `Font family: ${whiteBold(family)} does not exist in ${whiteBold(
          FONTS_DIR_NAME
        )} directory`
      );
    }
    const fontFamilyPath = path.join(fontsDirPath!, family);
    // remove font family directory
    fs.removeSync(fontFamilyPath);
    const namedExport = `export const ${family} = localfont`;
    const restFonts = fonts?.filter(
      (fontFamily) => fontFamily !== family
    ) as string[];
    const defaultExport = `\nexport default {
      ${restFonts.join(", ")}
    }`;
    // remove font family named export in index file
    reWriteFileSync(indexFilePath, namedExport, "export", true);
    // remove font family in default export object
    reWriteFileSync(indexFilePath, defaultExport, "export");
    if (reachedSuccess) {
      updateFonts(() => restFonts);
      signalSuccess();
    }
    return logger.success(
      `Font family ${whiteBold(family)} was successfully removed!`
    );
  }
  logger.info(`Removing all font families`);
  if (!itemsInFontsDir.length)
    return logger.warning(`${whiteBold(FONTS_DIR_NAME)} directory is empty`);
  let hasRemovedFontFamily = false;
  itemsInFontsDir?.forEach((fsItem) => {
    const fsItemPath = path.join(fontsDirPath!, fsItem);
    if (!pathExistsSync(fsItemPath)) return;
    if (folderExists(fsItemPath) && isFontFamilyDir(fsItemPath)) {
      fs.removeSync(fsItemPath);
      hasRemovedFontFamily = true;
    }
  });
  if (!hasRemovedFontFamily)
    return logger.error("No font family directories were found");
  fs.removeSync(indexFilePath);
  if (reachedSuccess) {
    updateFonts(() => []);
    signalSuccess();
  }
  logger.success("Removed all font familes");
};
