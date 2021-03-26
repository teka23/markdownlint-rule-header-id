"use strict";

const { addError, forEachHeading, escapeForRegExp } = require("markdownlint-rule-helpers");
const slugify = require('slugify')

function filterLineByLineNumber(params, lineNumber) {
  let line;
  params.tokens.forEach(function forToken(token) {
    if (token.lineNumber === lineNumber) {
      line = token.line;
    };
  });
  return line;
}

module.exports = {
  "names": [ "JK001", "header-jekyll-id-rule" ],
  "description": "Header with custom id rule",
  "tags": [ "headings", "headers" ],
  "function": function rule(params, onError) {
    forEachHeading(params, (heading) => {
      const { line, lineNumber } = heading;
      const nextLine = filterLineByLineNumber(params, lineNumber + 1)
      const slugifyOptions = { lower: true, strict: true };
      const slugifiedHeader = slugify(line, slugifyOptions);
      const jekyllID = `{: #${slugifiedHeader} }`
      if (!(/^\{\:\s*#[a-zA-Z0-9\-]+.*\}$/.test(nextLine))) {
        onError({
          "lineNumber": lineNumber,
          "detail": `Expected kramdown ID attribute at next line: ${lineNumber + 1}. You can fix by inserting \`${jekyllID}\` to the next line`,
          "fixInfo": {
            "editColumn": line.length + 1,
            "insertText": "\n" + jekyllID
          }
        });
      }
    });
  }
};
