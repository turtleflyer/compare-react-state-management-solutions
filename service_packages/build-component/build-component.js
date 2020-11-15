#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const DEF_PATH_BASE = 'src';
const COMPONENT_PACKAGES_FOLDER_NAME = 'component_packages';
const [, , filesJson] = process.argv;
const { files } = require(path_1.resolve(process.cwd(), filesJson));
const { name } = require(path_1.resolve(process.cwd(), 'package.json'));
Promise.all(files.reduce((promises, path) => {
    const newPromise = fs_extra_1.copy(path_1.resolve(process.cwd(), DEF_PATH_BASE, path), path_1.resolve(process.cwd(), DEF_PATH_BASE, COMPONENT_PACKAGES_FOLDER_NAME, name, path));
    return [...promises, newPromise];
}, [])).then(() => console.log('done'));
