// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode');
const fs = require('fs');
const sep = require('path').sep;

function fileExists(path) {
    try {
        fs.accessSync(path);
        return true;
    } catch (ex) {
        return false;
    }
}

function getWorkspacePath() {
    let uri = vscode.workspace.rootPath + sep + '..';
    let name = vscode.workspace.name.replace(' (Workspace)', '');
    let workspaceFile = name + '.code-workspace';
    let path = uri + sep + workspaceFile;
    
    if (fileExists(path)) {
        let dirContent = fs.readdirSync(uri);
        let workspaceFiles = dirContent.filter(item => item.match(/.+\.code-workspace$/));
        if (workspaceFiles.length === 1) {
            workspaceFile = workspaceFiles[0];
            path = uri + sep + workspaceFile;
        }
    }
    return path;
}

function sortPaths(wsObject) {
    let changed = false;
    if (wsObject.folders && wsObject.folders.length > 1) {
        let prev = wsObject.folders.slice();
        wsObject.folders = wsObject.folders.sort(alphabeticalPaths);
        changed = !isSameArrayContent(prev, wsObject.folders);
    }
    return changed;
}

function alphabeticalPaths(a, b) {
    return a.path === b.path ? 0 : a.path > b.path ? 1 : -1;
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

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sort', function () {
        let path = getWorkspacePath();
        if (fileExists(path)) {
            let fileContent = fs.readFileSync(path);
            let wsObject = JSON.parse(fileContent);
            if (sortPaths(wsObject)) {
                fs.writeFileSync(path, JSON.stringify(wsObject, undefined, '\t'));
                let name = vscode.workspace.name;
                vscode.window.showInformationMessage('Sorted ' + name);
            }
        } else {
            vscode.window.showErrorMessage('Unable to sort the workspaces folders. The workspace file was not found. Last checked path: ' + path);
        }
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
exports.sortPaths = sortPaths;
exports.alphabeticalPaths = alphabeticalPaths;
exports.isSameArrayContent = isSameArrayContent;