import { validateJobDefinition } from '@nosana/sdk';
import * as fs from 'fs';
import * as path from 'path';

fs.readdirSync('./templates').filter(folder => {
    const template = fs.readFileSync(path.join('./templates/' + folder, 'job-definition.json'));
    const jobDefinition = template.toString();
    const result = validateJobDefinition(JSON.parse(jobDefinition));
    if (result.success) {
      console.log(`${folder} job definition is valid!`)
    } else {
      const error = result.errors[0];
      throw new Error(`${folder}: ${error.path} - expected ${error.expected}, but found ${JSON.stringify(error.value)}`);
    }
  }
);
