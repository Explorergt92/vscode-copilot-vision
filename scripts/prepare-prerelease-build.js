/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const fs = require('fs');

const json = JSON.parse(fs.readFileSync('./package.json').toString());
const stableVersion = json.version.match(/(\d+)\.(\d+)\.(\d+)/);
const major = stableVersion[1];
const minor = stableVersion[2];

function prependZero(number) {
	if (number > 99) {
		throw new Error('Unexpected value to prepend with zero');
	}
	return `${number < 10 ? '0' : ''}${number}`;
}

// update name, publisher and description
// calculate version
// If the format of the patch version is ever changed, the isPreRelease utility function should be updated.
const date = new Date();
const month = date.getMonth() + 1;
const day = date.getDate();
const hours = date.getHours();
const patch = `${date.getFullYear()}${prependZero(month)}${prependZero(day)}${prependZero(hours)}`;

// The stable version should always be <major>.<minor_even_number>.patch
// For the nightly build, we keep the major, make the minor an odd number with +1, and add the timestamp as a patch.
const preReleasePackageJson = Object.assign(json, {
	version: `${major}.${Number(minor)+1}.${patch}`
});

fs.writeFileSync('./package.prerelease.json', JSON.stringify(preReleasePackageJson));
