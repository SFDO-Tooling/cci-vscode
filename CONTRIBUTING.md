# Contributing to the Extention

All you need to contribute to this VSCode extension is VSCode and CumulusCI.
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
