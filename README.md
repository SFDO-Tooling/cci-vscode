<h1 align="center">
  <br>  
  <!-- TODO: Update link to marketplace listing once published -->
    <a href="#">
      CumulusCI Extension for VS Code 
    </a>
</h1>
<br>

A minimal GUI for working with [CumulusCI](https://cumulusci.readthedocs.io/en/latest/intro.html) in Visual Studio Code.

-   View and manage the state of orgs in a CumulusCI project.
-   Easily launch flows against orgs in a CumulusCI project.
-   Built-in commands accessible via the command pallette for frequently used operations.

![Intro](media/intro.gif)

## Requirements

This extension requires CumulusCI to installed on a your machine.
See the [CumulusCI documentation](https://cumulusci.readthedocs.io/en/latest/get_started.html#install-cumulusci)
for help with installation and setup.

## CumulusCI Explorer View

The CumulusCI Explorer view is where you can easily view all orgs, tasks, and
flows available within a given project. To access the explorer view click
on the "CCI" icon on the left-hand sidebar of VS Code.

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
and press `<ENTER>` to execute the task.** Hovering your mouse over
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

## Have Feedback?

Please open a new [GitHub
Issue](https://github.com/SFDO-Tooling/cci-vscode/issues) for any bugs
or feature requests.
