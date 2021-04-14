#!/usr/bin/env node
import { copy, remove } from 'fs-extra';
import * as fs from 'fs/promises';
import * as path from 'path';

const SRC_PATH_BASE = 'src';
const COMPONENT_PACKAGES_FOLDER_NAME = 'component_packages';
const [, , filesJson] = process.argv;

/* eslint-disable @typescript-eslint/no-var-requires */
const { filesToIncludeToBuild }: { filesToIncludeToBuild: string[] } = require(path.resolve(
  process.cwd(),
  filesJson
));

const { name }: { name: string } = require(path.resolve(process.cwd(), 'package.json'));
/* eslint-enable @typescript-eslint/no-var-requires */

const componentPath = path.resolve(
  process.cwd(),
  SRC_PATH_BASE,
  COMPONENT_PACKAGES_FOLDER_NAME,
  name
);

fs.readdir(componentPath)
  .then((entries) => {
    return entries.map(async (e) => {
      return e === 'package.json' || remove(path.resolve(componentPath, e));
    });
  })
  .then((waitUntilAllResolved) => Promise.all(waitUntilAllResolved))
  .then(() =>
    filesToIncludeToBuild.reduce(
      (promises: Promise<void>[], nextFile) => [
        ...promises,
        copy(
          path.resolve(process.cwd(), SRC_PATH_BASE, nextFile),
          path.resolve(componentPath, nextFile)
        ),
      ],
      []
    )
  )
  .then((waitUntilAllResolved) => Promise.all(waitUntilAllResolved))
  /* eslint-disable no-console */
  .then(() => console.log('Component has been built'))
  .catch((e) => console.log(e));
/* eslint-enable no-console */
