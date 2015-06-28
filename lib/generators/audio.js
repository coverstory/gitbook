var Q = require("q");
var _ = require("lodash");
var util = require("util");
var path = require("path");

var cheerio = require('cheerio');
var speak = require('robospeak');

var fs = require("../utils/fs");
var html2text = require("../utils/html2text");
var BaseGenerator = require('../generator');

function Generator() {
    BaseGenerator.apply(this, arguments);
};
util.inherits(Generator, BaseGenerator);

// Finish generation
Generator.prototype.finish = function() {
    return Q();
};

// Convert an input file
Generator.prototype.convertFile = function(input) {
    var that = this;

    return that.book.parsePage(input, {
        convertImages: false,
        interpolateTemplate: function(page) {
            return that.callHook("page:before", page);
        },
        interpolateContent: function(page) {
            return that.callHook("page", page);
        }
    })
    .then(function(page) {
        // Extract text from content
        var d = Q.defer();

        // Calculate output paths
        var relativeOutput = that.book.contentPath(page.path);
        var output = path.join(that.options.output, relativeOutput).replace(/\.html$/, '.m4a');

        // Get page's html
        var html = _.pluck(page.sections, 'content').join('');

        // Convert to text
        var text = html2text(html);

        // Generate audio file
        speak(text).save(output, d.resolve);

        return d.promise;
    });
};

module.exports = Generator;
