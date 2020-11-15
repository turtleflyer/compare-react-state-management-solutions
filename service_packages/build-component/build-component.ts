#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
import { copy } from 'fs-extra';
import { resolve } from 'path';

const DEF_PATH_BASE = 'src';
const COMPONENT_PACKAGES_FOLDER_NAME = 'component_packages';

const [, , filesJson] = process.argv;
const { files }: { files: string[] } = require(resolve(process.cwd(), filesJson));
const { name }: { name: string } = require(resolve(process.cwd(), 'package.json'));

Promise.all(
  files.reduce((promises: Promise<void>[], path) => {
    const newPromise = copy(
      resolve(process.cwd(), DEF_PATH_BASE, path),
      resolve(process.cwd(), DEF_PATH_BASE, COMPONENT_PACKAGES_FOLDER_NAME, name, path)
    );
    return [...promises, newPromise];
  }, [])
).then(() => console.log('done'));
