/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
const assert = require('assert');
const extension = require('./../extension');
const sep = require('path').sep;

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
// const myExtension = require('../extension');

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', function() {
    test('sortPaths', function() {
        let obj = {
            'folders': [
                {'path': 'a'},
                {'path': 'c'},
                {'path': 'b'}
            ]
        };
        // 'c' and 'b' must be sorted
        assert.equal(true, extension.sortPaths(obj), 'c and b must be sorted');
        // Folders are sorted, should return false now
        assert.equal(false, extension.sortPaths(obj), 'Folders are sorted, should return false now');
    });

    test('topLevelDirectory', function () {
        let expected = 'dir';
        let separatedSingleDir = sep + expected + sep;
        let singleDir = expected;
        let multipleDir = 'dirA' + sep + 'dirB' + sep + expected;
        // Postfixed separator should be removed
        assert.equal(expected, extension.topLevelDirectory(separatedSingleDir), 'Postfixed separator should be removed');
        // Separatorless input should be the output
        assert.equal(expected, extension.topLevelDirectory(singleDir), 'Separatorless input should be the output');
        // Multiple levels should return the last level
        assert.equal(expected, extension.topLevelDirectory(multipleDir), 'Multiple levels should return the last level');
    });

    test('alphabeticalPaths', function() {
        let a = {'path': 'a'};
        let a2 = {'path': 'a'};
        let b = {'path': 'b'};
        let capB = {'path': 'B'};
        // a is less than b
        assert.equal(-1, extension.alphabeticalPaths(a, b), 'a is less than b');
        // b is more than a
        assert.equal(1, extension.alphabeticalPaths(b, a), 'b is more than a');
        // a and a2 are equal
        assert.equal(0, extension.alphabeticalPaths(a, a2), 'a and a2 are equal');
        // Upper- and lowercase should be equal
        assert.equal(0, extension.alphabeticalPaths(b, capB), 'Upper- and lowercase should be equal');
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
        // arrAB and arrAB2 have the same content
        assert.equal(true, extension.isSameArrayContent(arrAB, arrAB2), 'arrAB and arrAB2 have the same content');
        // arrAB and arrBA differ
        assert.equal(false, extension.isSameArrayContent(arrAB, arrBA), 'arrAB and arrBA differ');
    });
});