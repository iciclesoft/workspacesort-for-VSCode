# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2018-04-02
### Added
- Command `Sort Workspace Folders` which will sort the workspace folders.
- Context-menu item to run the command, this will be shown when right-clicking a folder in the explorer.

## [1.1.0] - 2018-05-27
### Added
- Optional setting `workspacesort.workspaceDirectory`, which can be used to point to the directory of the .code-workspace file. This is only necessary if it can't be resolved automatically.

## [1.2.0] - 2018-10-05
### Added
- The `name` property is now taken into account when sorting the workspace folders, instead of only looking at the directory name.

### Changed
- The way the .code-workspace filename is determined, making it not bound to a locale.
- The way the .code-workspace file is being searched by traversing the file-tree to find the right file.

## [1.3.1] - 2019-01-01
### Added
- A notification is now shown whenever the `.code-workspace` file could not be parsed, giving an indication of what caused the error.