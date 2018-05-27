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
- Setting `workspacesort.workspaceDirectory` which can be used to point to the directory of the .code-workspace file, this is only necessary if it can't be resolved automatically.

### Changed
- The way the .code-workspace filename is determined. Instead of stripping `' (Workspace)'`, it now uses a regex so it is not bound to a locale.
- The way the .code-workspace file is being searched. Before it assumed all folders added to the workspace were in the same directory as the .code-workspace file. Now it traverses the file-tree to find the right file.