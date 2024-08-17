# LoFo

CLI for adding local fonts to your Next.js projects!

```
 npx lofo
```

## Installation

To get started, run the above command in the root of your project directory and `lofo` would try to get everything set up properly for you automatically. You can also install the CLI on your machine by running the command below:

```
npm install lofo
```

After which you can execute the CLI by just running the command: `lofo` in your terminal...

### How it works.

When the CLI is executed, it would look through your project for a `fonts` directory and create one(_if it doesn't exist_) in the root directory of your project.

> [!NOTE]
> _It would **not** check your entire project directory tree recursively, it instead checks directories that a `fonts` directory would likely be found(based on common conventions). As this would most likely vary from person-to-person, you could put all your local font files in a directory named `fonts` in the root directory of your project. You could [move]() it somewhere else afterwards! A common convention you could also consider is putting your `fonts` directory(containing all your font files) in the `public/` directory of your Next.js project._

In the latter scenario, after the creation of the `fonts` directory, if there are no font files in your `fonts` directory already, it would prompt you to move your local font files[_these files typically have extensions such as `.otf`, `.ttf`, `.woff`, `.woff2` etc._] into the `fonts` directory.

It would then resolve the paths to all the font files in your `fonts` directory and then generate the code snippet to add the font imports into your Next.js project. _This would typically be written to your root `layout.tsx` file._

### Project Structure

_This is an example project structure to begin with before running the cli -- not cumpulsory_

```
my-project/
├── app
├── pages
├── public
├── fonts/
│   ├── my-font.woff2
│   └── ...
└── ...
```

### Fonts Directory Destination

The final destination of the `fonts` directory is up to you. You can decide to move the `fonts` directory to a different location, this can be achieved by running the CLI with an argument or manually moving the `fonts` directory through your project directory tree, if you prefer the latter, remember to run `lofo` afterwards to auto update your import path...

### Quirks

These are known "quirks" that you may notice during usage, some are by design, others are minor issues that would be fixed.

#### Q(uirk): I have to manually delete a font's entry in the `lofo-config.json` file after I remove/delete a local font.

This is an issue! Rest assured that a fix is on the way and would be released soon enough as QL(Quality of Life) improvement.

#### Q(uirk): Nothing happens when I add a folder containing my font files to the `fonts` directory.

We are aware of this issue and are currently implementing this as a quality of life improvement, to be released in the next **minor** release.

### Roadmap

- [ ] Add support for projects using TailwindCSS
- [ ] Add support for projects still on pages router
- [ ] Add support for React.js projects
- [ ] Add support for Vanilla.js projects
- [ ] Add support for monorepo projects

> [!WARNING]
> _This project, at this time, makes quite a few assumptions about your project and conventions. Proceed with caution!_
