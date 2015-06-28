var _ = require('lodash');
var cheerio = require('cheerio');

function html2text(html) {
    var $ = cheerio.load(html);
    var nodes = $.root().children();

    var t = _.toArray(nodes
    .filter(function(i, el) {
        return isTextual(el);
    })
    .map(function(i, node) {
        var rawText = $(node).text();

        // Add pause after titles
        if(isTitle(node)) {
            return "[[slnc 500]] " + rawText + " [[slnc 500]]";
        }

        return rawText;
    }))
    .join('');

    return t;
}

function isTextual(node) {
    return isP(node) || isTitle(node);
}

function isP(node) {
    return nodeTag(node) === 'p';
}

function isTitle(node) {
    switch(nodeTag(node)) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            return true;
    }
    return false;
}

function nodeTag(node) {
    if(!(node && node.tagName)) {
        return '';
    }
    return node.tagName.toLowerCase();
}

function isTag(node) {
    return node && node.tagName;
}

function children(node) {
    return node.childNodes || [];

    var nodes = [];

    node = node.firstChild;
    while (node) {
        nodes.push(node);
        node = node.nextSibling;
    }

    return nodes;
}

function text(node) {
    return node.text();
}

function walkTheDOM(node, func) {
    func(node, 0);
    node = node.firstChild;
    while (node) {
        walkTheDOM(node, func);
        node = node.nextSibling;
    }
}

module.exports = html2text;
