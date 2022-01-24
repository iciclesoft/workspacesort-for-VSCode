// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode');
const fs = require('fs');
const nodePath = require('path');
const jsonic = require('jsonic');
const sep = nodePath.sep;
const altSep = sep === '\\' ? '/' : '\\';

function fileExists(path) {
    if (typeof path === 'string') {
        try {
            fs.accessSync(path);
            return true;
        } catch (ex) {
            // Unable to access the file
        }
    }
    return false;
}

function sanitizedWorkspaceName(str) {
    return str.replace(/\s(\[.+\])$/, '').replace(/\s(\([^()]+\))$/, '');
}

function isCodeWorkspaceFile(path) {
    if (typeof path === 'string') {
        let wsObject = getWorkspaceObject(path);
        if (typeof wsObject === 'object') {
            let projFolders = vscode.workspace.workspaceFolders;
            if (wsObject.folders && wsObject.folders.length === projFolders.length) {
                return true;
            }
        }
        return false;
    }
    throw new Error('Invalid argument path, expected string but got ' + typeof path);
}

function getWorkspacePath() {
    let name = sanitizedWorkspaceName(vscode.workspace.name);
    let workspaceFile = name + '.code-workspace';
    // First, check the settings
    let config = vscode.workspace.getConfiguration('workspacesort');
    if (config.has('workspaceDirectory')) {
        let workspaceDir = config.get('workspaceDirectory');
        // Does the directory contain the .code-workspace file?
        if (workspaceDir && workspaceDir.length > 0) {
            // If the setting is a file, just get the directory
            if (workspaceDir.indexOf('.') > -1) {
                workspaceDir = nodePath.dirname(workspaceDir);
            }
            let path = nodePath.normalize(workspaceDir + sep + workspaceFile);
            if (isCodeWorkspaceFile(path)) {
                return path;
            }
        }
    }
    // No setting active? Search the file ourselves
    // First, try to get the path through the new workspace-information
    if (fileExists(vscode.workspace.workspaceFile.fsPath)) {
        return vscode.workspace.workspaceFile.fsPath;
    }
    if (fileExists(vscode.workspace.workspaceFile.path)) {
        return vscode.workspace.workspaceFile.path;
    }
    // Get it from the folder-structure
    let visited = [];
    let projFolders = vscode.workspace.workspaceFolders;
    // Walk the project tree
    for (let projFolder of projFolders) {
        let folder = projFolder.uri.fsPath;
        // Visit all parent folders until we find the .code-workspace file
        while (folder.indexOf(sep) !== -1) {
            if (!visited.includes(folder)) {
                visited.push(folder);
                let path = nodePath.normalize(folder + sep + workspaceFile);
                if (isCodeWorkspaceFile(path)) {
                    return path;
                }
                folder = nodePath.normalize(folder + sep + '..' + sep);
            } else {
                break;
            }
        }
    }

    return '';
}

function getWorkspaceObject(path) {
    if (fileExists(path)) {
        let fileContent = fs.readFileSync(path);
        try {
            return jsonic(jsonic(fileContent));
            // return JSON.parse(fileContent);
        } catch (error) {
            let linified = linifyParseError(fileContent, error);
            vscode.window.showErrorMessage(linified);
            throw error;
        }
    }
    return undefined;
}

function linifyParseError(fileContent, error) {
    let newMessage = null;
    try {
        let positionPart = /[at position] [\d]+$/;
        if (positionPart.test(error.message)) {
            let getPosition = /[\d]+$/;
            let positionString = getPosition.exec(error.message);
            let position = parseInt(positionString[0], 10);

            if (Number.isInteger(position)) {
                let contentString = fileContent.toString('utf8');
                let subString = contentString.substr(0, position);
                let breakCount = subString.split('\n').length;
                newMessage = error.message + ` (Line: ${breakCount})`;
            }
        }
    } catch (e) {
        // We aren't interested in this error
    }

    return newMessage || error.message;
}

function sortPaths(wsObject) {
    let changed = false;
    if (wsObject.folders && wsObject.folders.length > 1) {
        let prev = wsObject.folders.slice();
        wsObject.folders = wsObject.folders.sort(alphabetical);
        changed = !isSameArrayContent(prev, wsObject.folders);
    }
    return changed;
}

function topLevelDirectory(path) {
    if (typeof path === 'string') {
        let split = path.split(sep).filter(it => Boolean(it.length));
        split = split[split.length - 1].split(altSep).filter(it => Boolean(it.length));
        return split[split.length - 1];
    }
    throw new Error('Invalid argument path, expected string but got ' + typeof path);
}

function getShownName(folderObj) {
    if (!folderObj.path) {
        throw new Error('Invalid argument folderObj, expected an object with at least a path-property.');
    }
    let name = folderObj.name;
    if (!name) {
        name = topLevelDirectory(folderObj.path).toLocaleLowerCase();
    }
    return name;
}

function alphabetical(a, b) {
    let nameA = getShownName(a);
    let nameB = getShownName(b);

    return nameA.localeCompare(nameB);
}

function isSameArrayContent(a, b) {
    let result = true;
    if (a.length !== b.length) {
        result = false;
    } else {
        a.forEach((item, index) => {
            if (item !== b[index]) {
                result = false;
                return;
            }
        });
    }
    return result;
}

function sortWorkspaceFolders(notifySuccess) {
    let path = getWorkspacePath();
    let wsObject = getWorkspaceObject(path);
    if (typeof wsObject === 'object') {
        if (sortPaths(wsObject)) {
            fs.writeFileSync(path, JSON.stringify(wsObject, undefined, '\t'));
            let name = vscode.workspace.name;
            if (notifySuccess !== false) {
                vscode.window.showInformationMessage('Sorted ' + name);
            }
        }
    } else {
        vscode.window.showErrorMessage('The .code-workspace file for this workspace was not found. Please use the setting workspacesort.workspaceDirectory to tell WorkspaceSort where it can be found.');
    }
}

function onDidChangeWorkspaceFolders() {
    let config = vscode.workspace.getConfiguration('workspacesort');
    let sortAutomatically = true;
    if (config.has('sortAutomatically')) {
        sortAutomatically = config.get('sortAutomatically');
    }
    if (sortAutomatically) {
        sortWorkspaceFolders(false);
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sort', sortWorkspaceFolders);

    context.subscriptions.push(disposable);
    vscode.workspace.onDidChangeWorkspaceFolders(onDidChangeWorkspaceFolders);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
exports.fileExists = fileExists;
exports.sanitizedWorkspaceName = sanitizedWorkspaceName;
exports.sortPaths = sortPaths;
exports.topLevelDirectory = topLevelDirectory;
exports.alphabetical = alphabetical;
exports.isSameArrayContent = isSameArrayContent;
exports.getWorkspaceObject = getWorkspaceObject;
exports.linifyParseError = linifyParseError;