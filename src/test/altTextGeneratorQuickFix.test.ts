/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { extractImageAttributes } from '../utils/imageUtils';
import { describe, it } from 'node:test';

describe('Alt text quick fixes: extractImageInfo', () => {
	describe('Generate Alt Text', () => {
		const refineExisting = false;
		describe('Alt text missing: should provide result', () => {
			it('Markdown Image syntax', () => {
				const markdownImage = '![](path/to/image.png)';
				const match = extractImageAttributes(markdownImage, refineExisting);
				assert(match);
				const { imagePath, altTextStartIndex, isHTML, altTextLength } = match;
				assert.equal(imagePath, 'path/to/image.png');
				assert.equal(altTextStartIndex, 2);
				assert.equal(isHTML, false);
				assert.equal(altTextLength, 0);
			});

			it('HTML image syntax', () => {
				const htmlImage = '<img src="path/to/image.png" />';
				const match = extractImageAttributes(htmlImage, refineExisting);
				assert(match);
				const { imagePath, altTextStartIndex, isHTML, altTextLength } = match;
				assert.equal(imagePath, 'path/to/image.png');
				assert.equal(altTextStartIndex, 1);
				assert.equal(isHTML, true);
				assert.equal(altTextLength, 0);
			});

			it('Markdown Link with Image syntax', () => {
				const markdownLinkImage = '[![](path/to/image.png)](http://example.com)';
				const match = extractImageAttributes(markdownLinkImage, refineExisting);
				assert(match);
				const { imagePath, altTextStartIndex, isHTML, altTextLength } = match;
				assert.equal(imagePath, 'path/to/image.png');
				assert.equal(altTextStartIndex, 3);
				assert.equal(isHTML, false);
				assert.equal(altTextLength, 0);
			});
		});
		describe('Alt text is boilerplate: should provide result', () => {
			it('Markdown Image syntax', () => {
				const markdownImage = '![alt text](path/to/image.png)';
				const match = extractImageAttributes(markdownImage, refineExisting);
				assert(match);
				const { imagePath, altTextStartIndex, isHTML, altTextLength } = match;
				assert.equal(imagePath, 'path/to/image.png');
				assert.equal(altTextStartIndex, 2);
				assert.equal(isHTML, false);
				assert.equal(altTextLength, 8);
			});
			it('Markdown Image syntax, with space in image path', () => {
				const markdownImage = '![alt text](<path to image.png>)';
				const match = extractImageAttributes(markdownImage, refineExisting);
				assert(match);
				const { imagePath, altTextStartIndex, isHTML, altTextLength } = match;
				assert.equal(imagePath, 'path to image.png');
				assert.equal(altTextStartIndex, 2);
				assert.equal(isHTML, false);
				assert.equal(altTextLength, 8);
			});
		});
		describe('Alt text exists: should return undefined', () => {
			it('Markdown Image syntax', () => {
				const markdownImageWithAlt = '![some word](path/to/image.png)';
				const match = extractImageAttributes(markdownImageWithAlt, refineExisting);
				assert(!match);
			});

			it('HTML image syntax, alt before src', () => {
				const htmlImage = '<img alt="hi" src="path/to/image.png" />';
				const match = extractImageAttributes(htmlImage, refineExisting);
				assert(!match);
			});

			it('HTML image syntax, src before alt', () => {
				const htmlImage = '<img src="path/to/image.png" alt="hi" />';
				const match = extractImageAttributes(htmlImage, refineExisting);
				assert(!match);
			});

			it('Markdown Link with Image syntax', () => {
				const markdownLinkImageWithAlt = '[![some word](path/to/image.png)](http://example.com)';
				const match = extractImageAttributes(markdownLinkImageWithAlt, refineExisting);
				assert(!match);
			});
		});
	});


	describe('Refine alt text', () => {
		const refineExisting = true;
		describe('Alt text missing: should return undefined', () => {
			it('Markdown Image syntax', () => {
				const markdownImage = '![](path/to/image.png)';
				const match = extractImageAttributes(markdownImage, refineExisting);
				assert(!match);
			});

			it('HTML Image syntax, alt before src', () => {
				const htmlImage = '<img src="path/to/image.png" />';
				const match = extractImageAttributes(htmlImage, refineExisting);
				assert(!match);
			});

			it('Markdown Link with Image syntax', () => {
				const markdownLinkImage = '[![](path/to/image.png)](http://example.com)';
				const match = extractImageAttributes(markdownLinkImage, refineExisting);
				assert(!match);
			});
		});
		describe('Alt text is boilerplate: should return undefined', () => {
			it('Markdown Image syntax', () => {
				const markdownImage = '![alt text](path/to/image.png)';
				const match = extractImageAttributes(markdownImage, refineExisting);
				assert(!match);
			});
		});
		describe('Alt text exists: should provide result', () => {
			it('Markdown Image syntax', () => {
				const markdownImageWithAlt = '![some word](path/to/image.png)';
				const match = extractImageAttributes(markdownImageWithAlt, refineExisting);
				assert(match);
				const { imagePath, altTextStartIndex, isHTML, altTextLength } = match;
				assert.equal(imagePath, 'path/to/image.png');
				assert.equal(altTextStartIndex, 2);
				assert.equal(isHTML, false);
				assert.equal(altTextLength, 9);
			});
			it('Markdown Image syntax, space in image path', () => {
				const markdownImageWithAlt = '![some word](<path to image.png>)';
				const match = extractImageAttributes(markdownImageWithAlt, refineExisting);
				assert(match);
				const { imagePath, altTextStartIndex, isHTML, altTextLength } = match;
				assert.equal(imagePath, 'path to image.png');
				assert.equal(altTextStartIndex, 2);
				assert.equal(isHTML, false);
				assert.equal(altTextLength, 9);
			});
			it('HTML Image syntax, alt before source', () => {
				const htmlImage = '<img alt="hi" src="path/to/image.png" />';
				const match = extractImageAttributes(htmlImage, refineExisting);
				assert(match);
				const { imagePath, altTextStartIndex, isHTML, altTextLength } = match;
				assert.equal(imagePath, 'path/to/image.png');
				assert.equal(altTextStartIndex, 10);
				assert.equal(isHTML, true);
				assert.equal(altTextLength, 2);
			});

			it('HTML Image syntax, src before alt', () => {
				const htmlImage = '<img src="path/to/image.png" alt="hi" />';
				const match = extractImageAttributes(htmlImage, refineExisting);
				assert(match);
				const { imagePath, altTextStartIndex, isHTML, altTextLength } = match;
				assert.equal(imagePath, 'path/to/image.png');
				assert.equal(altTextStartIndex, 34);
				assert.equal(isHTML, true);
				assert.equal(altTextLength, 2);
			});

			it('Markdown Link with Image syntax', () => {
				const markdownLinkImageWithAlt = '[![one word](path/to/image.png)](http://example.com)';
				const match = extractImageAttributes(markdownLinkImageWithAlt, refineExisting);
				assert(match);
				const { imagePath, altTextStartIndex, isHTML, altTextLength } = match;
				assert.equal(imagePath, 'path/to/image.png');
				assert.equal(altTextStartIndex, 3);
				assert.equal(isHTML, false);
				assert.equal(altTextLength, 8);
			});
		});
	});
});
