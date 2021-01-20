#!/bin/bash
tsc src/chore.ts --watch
tsc src/display.ts --watch
tsc src/index.ts --watch
tsc src/list.ts --watch
tsc src/taskmanager.ts --watch
npx webpack --watch
