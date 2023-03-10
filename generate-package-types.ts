#!/usr/bin/env ts-node

import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { argv, cwd } from 'node:process';
import { getJsonSchemaReader, getTypeScriptWriter, makeConverter } from 'typeconv';

// store generated types in cwd
const [, , path = 'package.d.ts'] = argv;
const dist = resolve(cwd(), path);

// load schema
const response = await fetch('https://json.schemastore.org/package.json');
const { $schema, title, definitions, ...schema } = (await response.json()) as any;

// as typeconv only looks inside the definitions object, we
// need to inline the global package definition inside it
const aligned = { $schema, title, definitions: { ...definitions, package: { ...schema } } };
const data = JSON.stringify(aligned);

// prepare reader and writer
const reader = getJsonSchemaReader();
const writer = getTypeScriptWriter();

// convert schema to TypeScript
const { convert } = makeConverter(reader, writer);
const { data: result } = await convert({ data });

// write file to dist
await writeFile(dist, result);
