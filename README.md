<h1 align="center">
  <br>
  <!-- TODO: Update link to marketplace listing once published -->
  <a href="#">
    <img src="https://raw.githubusercontent.com/SFDO-Tooling/cci-vscode/main/media/images/cci-logo.png?token=ABORMOR55C27ABODDQKRBDDBBG42I">
  </a>
  <br>
  CumulusCI 
  <br>
</h1>

<h4 align="center">A minimal GUI for working with CumulusCI in Visual Studio Code</h4>
<br>

![]

## Requirements

This extension requires CumulusCI installed on a your machine for it to
work. See the [CumulusCI
documentation](https://cumulusci.readthedocs.io/en/latest/get_started.html#install-cumulusci)
for help with installation and setup.

## CumulusCI Explorer

The CumulusCI Explorer is where users can easily view all tasks and
flows available to them in a given project, as well as, manage and view
the status of orgs available to them.

### Working with Orgs

The `Orgs` view allows you to see all of the orgs that are available to
you in the given project open in VSCode. Scratch orgs are indicated by
the presence of a green dot. If the dot is filled in, then the scratch
org is currently active. If the dot is empty, there is currently no scratch
org for that org configuration. Connected orgs are indicated via the icon
with two connected blue rings next to the org name. Hovering your mouse
over a given org also provides additional info about the org.

### Working with Flows

The `Flows` view allows you to see all the flows that are currently
available to the given project open in VSCode. Flows are grouped by
various categories. To execute a flow, click on the \"Run Flow\" icon to
the right of the name of the flow. After clicking the icon, a dropdown
menu with all available orgs will be displayed. Select the org you wish
to execute the flow against and the flow will run automatically. Hovering
your mouse over an individual flow provides a description of the flow.

### Working with Tasks

The `Tasks` view allows you to see all tasks that are currently
available to the given project open in VSCode. Tasks are grouped by
various categories. Tasks can be run individually by clicking the
`Run Task` icon to the right of the task name. This will open up a new
terminal window with the beginning of the task command already filled
in. **You will still need to provide any task options that are required
and hit \`\`ENTER\`\` to execute the task.** Hovering your mouse over
an individual task provides a description of the task.

### Utility CumulusCI Commands

In addition to the `Orgs`, `Tasks`, and `Flows` views, the extension
also provides some useful built-in commands that can be executed via the
VSCode command palette. To access the command palette you can select
`View` in the menu bar and click on `Command Palette...`, or use the
keyboard shortcut of `cmd+shift+p` or `ctrl+shift+p`.

The following are currently available:

-   `CumulusCI: Initialize a project`
-   `CumulusCI: Version`
-   `CumulusCI: Share an Error Log`

## Development

All you need to contribute to this VSCode extension is VSCode!
Simply clone this repository, open it up in VSCode and off you go!

### Running Tests

Running tests can be done through either the [yarn test]{.title-ref}
command or via the Debugger with one of the launch configurations that
runs a specific suite of tests. See the [launch.json]{.title-ref} for
more information on specific launch targets.

---

**NOTE**

If you are running `yarn test` all instances of VSCode must be closed.
Using [VS Code Insiders](https://code.visualstudio.com/insiders/) for
development mitigates this issue. See the [VSCode
docs](https://code.visualstudio.com/api/working-with-extensions/testing-extension#tips)
for more info.

---

### Debugging

VSCode makes debugging this extension easy. Simply open this repository
in VSCode, navigate to the \"Run and Debug\" tab, ensure the \"Run
Extension\" option is select, and click the play button. A new window of
VSCode will appear with the extension running within it.

## Installing Pre-Release Versions

If you\'re interested in trying a version of this extension that has not
yet been published to the Visual Studio Code marketplace, you can access
the latest `.vsix` file in the release tag. Then install the extension
with:

```console
code --install-extension <path/to/file>
```

## Have Feedback?

Please open a new [GitHub
Issue](https://github.com/SFDO-Tooling/cci-vscode/issues) for any bugs
or feature requests.
