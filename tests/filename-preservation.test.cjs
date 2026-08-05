const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

function loadOutputFilenameMethod() {
    const pagePath = path.join(__dirname, '..', 'image-compressor.html');
    const pageSource = fs.readFileSync(pagePath, 'utf8');
    const methodMatch = pageSource.match(
        /getOutputFilename\(file\)\s*\{([\s\S]*?)\n\s*\}\s*\n\s*showProgress\(\)/
    );

    assert.ok(methodMatch, 'image-compressor.html should define getOutputFilename(file)');

    return new Function('file', methodMatch[1]);
}

test('compressed images keep the original base filename', () => {
    const getOutputFilename = loadOutputFilenameMethod();

    const cases = [
        { original: '产品图.v2.jpg', outputType: 'image/png', expected: '产品图.v2.png' },
        { original: 'hero.webp', outputType: 'image/webp', expected: 'hero.webp' }
    ];

    for (const { original, outputType, expected } of cases) {
        const actual = getOutputFilename.call(
            { formatSelect: { value: outputType } },
            { name: original }
        );

        assert.equal(actual, expected);
    }
});
