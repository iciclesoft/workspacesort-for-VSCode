# WorkspaceSort

WorkspaceSort adds the ability to sort workspace-folders in the same way as files and inner-folders are sorted. There are two ways to sort your workspace folders:
* Right-click on a folder in your explorer and click `Sort Workspace Folders`.
* Open the Command-palette and type `Sort Workspace Folders`.

# Installation

To install the extension, press Ctrl-P or Cmd-P (Mac) in VSCode and execute the following command:

`ext install WorkspaceSort`

# Contribute

If you would like to contribute to WorkspaceSort, you can find the github repository at [github.com/iciclesoft/workspacesort-for-VSCode](https://github.com/iciclesoft/workspacesort-for-VSCode). You are free to fork the repository and create pull-requests. Please make sure all unit tests pass before creating a pull-request.

## Release Notes

### 1.0.0

Initial release of WorkspaceSort. In this version it is possible to sort your workspace folders in alphabetical order, either by using the context-menu on a folder or by typing the command. No difference is made between uppercase and lowercase characters when sorting.

### 1.1.0
- Added the setting `workspacesort.workspaceDirectory` which can be used to point to the directory of the .code-workspace file, this is only necessary if it can't be resolved automatically.
- Changed the way the .code-workspace filename is determined. Instead of stripping `' (Workspace)'`, it now uses a regex so it is not bound to a locale.
- Changed the way the .code-workspace file is being searched. Before it assumed all folders added to the workspace were in the same directory as the .code-workspace file. Now it traverses the file-tree to find the right file.

### For more information

* [Project's github repository](https://github.com/iciclesoft/workspacesort-for-VSCode)