/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
const assert = require('assert');
const extension = require('./../extension');
const sep = require('path').sep;
const nodePath = require('path');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
// const myExtension = require('../extension');

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', function() {
    test('fileExists', function () {
        let existingPath = nodePath.join(__dirname, 'extension.test.js');
        let nonExistingPath = nodePath.join(__dirname, 'extension.js');

        // The file test/extension.test.js exists
        assert.equal(true, extension.fileExists(existingPath), 'The file ' + existingPath + ' does exist.');
        // The file test/extension.js does not exist
        assert.equal(false, extension.fileExists(nonExistingPath), 'The file ' + nonExistingPath + ' does not exist.');
    });


    test('sanitizedWorkspaceName', function () {
        let workspacePostfixes = [
            ' (Workspace)',
            ' (Werkruimte)',
            // Thanks to Google Translate
            ' (工作区)',
            ' (工作區)',
            ' (Espace de travail)',
            ' (Arbeitsplatz)',
            ' (Area di lavoro)',
            ' (Espacio de trabajo)',
            ' (ワークスペース)',
            ' (작업 영역)',
            ' (Рабочее пространство)',
            ' (Област)',
            ' (munkaterület)',
            ' (Área de trabalho)',
            ' (Çalışma Alanı)'
        ];

        let workspaceNames = [
            'imageFilter',
            'Tower Defense',
            'EVE Live DPS Graph (free)',
            'Project Sort (Workspace)'
        ];

        workspaceNames.forEach(function (name) {
            workspacePostfixes.forEach(function (postfix) {
                let postfixedName = name + postfix;
                let sanitized = extension.sanitizedWorkspaceName(postfixedName);
                assert.equal(name, sanitized, postfixedName + ' should become ' + name + ' after sanitizing instead of ' + sanitized + '.');
            });
        });
    });

    test('sortPaths', function() {
        let obj = {
            'folders': [
                {'path': 'a'},
                {'path': 'c'},
                {'path': 'b'}
            ]
        };
        
        assert.equal(true, extension.sortPaths(obj), 'c and b must be sorted');
        assert.equal(obj.folders[1].path, 'b', 'After sorting, the path of the folder with index 1 must be b.');
        assert.equal(false, extension.sortPaths(obj), 'Folders are sorted, should return false now');
    });

    test('topLevelDirectory', function () {
        let expected = 'dir';
        let separatedSingleDir = sep + expected + sep;
        let singleDir = expected;
        let multipleDir = 'dirA' + sep + 'dirB' + sep + expected;
        
        assert.equal(expected, extension.topLevelDirectory(separatedSingleDir), 'Postfixed separator should be removed');
        assert.equal(expected, extension.topLevelDirectory(singleDir), 'Separatorless input should be the output');
        assert.equal(expected, extension.topLevelDirectory(multipleDir), 'Multiple levels should return the last level');
    });

    test('alphabetical', function() {
        // Paths only
        let pathA = {'path': 'a'};
        let pathA2 = {'path': 'a'};
        let pathB = {'path': 'b'};
        let pathCapB = {'path': 'B'};
        
        assert.equal(-1, extension.alphabetical(pathA, pathB), 'a is less than b');
        assert.equal(1, extension.alphabetical(pathB, pathA), 'b is more than a');
        assert.equal(0, extension.alphabetical(pathA, pathA2), 'a and a2 are equal');
        assert.equal(0, extension.alphabetical(pathB, pathCapB), 'Upper- and lowercase should be equal');

        // Name only
        let nameA = {
            'name': 'a',
            'path': '0'
        };
        let nameB = {
            'name': 'b',
            'path': '0'
        };

        assert.equal(-1, extension.alphabetical(nameA, nameB), 'a is less than b');
        assert.equal(1, extension.alphabetical(nameB, nameA), 'b is more than a');

        // Mix
        let mixA = {
            'name': 'a',
            'path': '0'
        };
        let mixA2 = {
            'name': 'a',
            'path': '0'
        };
        let mixB = {'path': 'b'};

        assert.equal(-1, extension.alphabetical(mixA, mixB), 'a is less than b');
        assert.equal(1, extension.alphabetical(mixB, mixA), 'b is more than a');
        assert.equal(0, extension.alphabetical(mixA, mixA2), 'a and a2 are equal');
    });

    test('isSameArrayContent', function() {
        let arrAB = [
            {'path': 'a'},
            {'path': 'b'}
        ];
        let arrAB2 = arrAB.slice();
        let arrBA = [
            {'path': 'b'},
            {'path': 'a'}
        ];
        
        assert.equal(true, extension.isSameArrayContent(arrAB, arrAB2), 'arrAB and arrAB2 have the same content');
        assert.equal(false, extension.isSameArrayContent(arrAB, arrBA), 'arrAB and arrBA differ');
    });
});