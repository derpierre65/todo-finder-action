// import { execSync } from 'child_process';
import path from 'path';
// import { fileURLToPath } from 'url';
import core from '@actions/core';
import reportTodoPackage from 'report-todo';

function convertSeverity(s) {
  if (s === 0) { // off
    return 'INFO';
  } else if (s === 1) {
    return 'WARNING';
  } else if (s === 2) {
    return 'ERROR';
  }
  return 'UNKNOWN_SEVERITY';
}

const rdjson = {
  source: {
    name: 'todo-finder',
    url: 'https://github.com/derpierre65/todo-finder-action/'
  },
  diagnostics: []
};

try {
  const { reportTodo } = reportTodoPackage;

  console.log('scnadir:', core.getInput('scandir') || './src/**/*')
  console.log('severity:', core.getInput('severity'));

  const labels = JSON.parse(await reportTodo(core.getInput('scandir') || './src/**/*', {
    reportMode: 'json',
  }));

  const cwdPath = path.dirname(process.cwd());
  for (const label of labels) {
    for (const match of label.matches) {
      rdjson.diagnostics.push({
        location: {
          path: path.join(cwdPath, match.filePath),
          range: {
            start: {
              line: match.startLineNo,
            },
          }
        },
        severity: convertSeverity(parseInt(core.getInput('severity'))),
        // original_output: 'No description',
      });
    }
  }

  // leasot
  // const json = JSON.parse(execSync('npx leasot "' + core.getInput('scandir') + '" --reporter json -x').toString());
  // for (const todo of json) {
  //   rdjson.diagnostics.push({
  //     location: {
  //       path: path.join(path.dirname(fileURLToPath(import.meta.url)), todo.file),
  //       range: {
  //         start: {
  //           line: todo.line,
  //         },
  //       }
  //     },
  //     severity: convertSeverity(parseInt(core.getInput('severity'))),
  //     // original_output: todo.text || 'No description',
  //   });
  // }
} catch (error) {
  console.error(`error: ${error.message}`);
  process.exit(1);
}

console.log(JSON.stringify(rdjson));