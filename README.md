# JS Notebook

An Electron application for creating beautiful markdown files that can run
JavaScript.

## Screenshots

1. Opening a `jsnote` file.

![Opening a File](./examples/1.jpg)

2. The interface when the file is opened.

![Editor Interface](./examples/2.jpg)

3. Running a snippet.

![Running a Snippet](./examples/3.jpg)

4. Save as another file.

![Save As Another File](./examples/4.jpg)

5. Changing the file language from TypeScript to Javascript.

![Changing the File Language](./examples/5.jpg)

## Functionalities

- Create notes mixed with markdown and JavaScript / Typescript code segments
- Write GitHub-flavoured markdown with LaTeX mathematical equations
- Run and stop each segment individually
- Automatically download packages from npm if needed
- Save / Save As note when done
- Remove and create note files
- Basic error handling for invalid note files
- Show recent files
- Loading the last opened file when startup

## How to Use

- Click `Create Note` on the home page to create a new note file
- Click `Add Snippet` or `Add Text` to write code or markdown.
- For code, click `Run` to run the snippet, and `Stop` to stop it.
- If the code contains logs to the console, open devtools with `Ctrl+Shift+I` to
  see the output.
- Click `Save` or `Save As` to save the note file.
- To leave the file, click the `Home` icon.
- To delete a segment, click the red trash icon.
- To switch the order of segments, click the up arrow or the down arrow.
- To change the settings of a file, click the `Settings` button in the right upper corner.
- To delete a note, click the red `Delete` button next to the `Settings` button.

## Technologies

JS Notebook uses the following technologies:

- `electron`: because it is a desktop application
- `@electron-forge`: for Webpack and react
- `electron-is-dev`: check if the software is running in production or not
- `esbuild-wasm`: for bundling the code segments
- `idb-keyval`: for caching files from `unpkg`
- `electron-devtools-installer`: for debugging Redux applications
- `electron-localshortcut`: for registering shortcuts

- `react`: the user interface framework
- `react-router-dom`: for routing pages
- `@chakra-ui`: for pre-made components
- `monaco-editor`: editor for editing code and markdown
- `monaco-themes`: for the beautiful github theme
- `object-merge`: for merging settings
- `react-markdown`: for compiling markdown strings into components
- `remark-gfm`: for GFM-flavoured markdown syntax
- `remark-math`, `rehype-katex`, `katex`: for equations
- `redux`, `react-redux`: Integrating redux store with react
- `formik`: for easier forms
- `react-hotkeys-hook`: for registering keyboard shortcuts
- `react-icons`: for FontAwesome icons

- `jest`: for testing all components
- `ts-jest`: for transpilation
- `jest-environment-jsom`: for testing React components
- `@testing-library`: for React testing utilities

also with various Webpack plugins for stylsheets, images etc. Development tools
such as ESLint, Prettier are also listed.

## Trying Locally

Local development requires `node` and `npm` to be installed. It would be best if both versions are the latest.

To start the application in development mode, type:

```
npm start
```

To package the application on the platform you are in, type:

```
npm package
```

Tests can be run by:

```
npm test
```

or

```
npm test:watch
```
