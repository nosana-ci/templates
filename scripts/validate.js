import { validateJson } from '@nosana/schema-validator';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';



fs.readdirSync('./templates').filter(folder => {
    const template = fs.readFileSync(path.join('./templates/' + folder, 'template.yml'));
    const yml = template.toString();
    const result = validateJson(JSON.stringify(parse(yml)));
    if (result.valid) {
      console.log(`${folder} template is valid!`)
    } else {
      const error = result.errors[0];
      throw new Error(`${folder}: ${error.schemaPath} ${error.message}`);
    }
  }
);
