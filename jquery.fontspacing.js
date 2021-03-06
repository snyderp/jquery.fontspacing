/**
 * jQuery.fontspacing
 *
 * Corrects font spacing issues on older browsers for high bit
 * charcters by padding strings with characters that old browsers
 * render with 0 width with a space in them.  This makes for some
 * symantic messiness, but correct rendering.
 *
 * @param object options
 *   This plugin accepts a single configuration option, "chars"
 *   that takes an array of characters to test for.
 *
 * @author Peter Snyder <snyderp@gmail.com>
 * @link   https://github.com/snyderp/jquery.fontspacing
 */
(function ($) {
    "use strict";

    // Stores assocations between single character
    // strings and boolean values, describing whether
    // the character renders with a width in the
    // current browser.
    var character_renders_correctly = {},
        // Function that checks to see if an array
        // of characters each render correctly in the
        // current browser by:
        //   1) Creating and inserting a span with
        //      the tested character into the document
        //   2) Checking the width of the created element,
        //      and seeing if any width is added
        //   3) Recording whether this browser has problems
        //      with this character, and
        //   4) Removing the inserted element when things are
        //      done.
        test_character_widths,
        // Simple function to count the number of times a
        // string occurs in another string
        substr_count = function (needle, haystack) {
            var matches = haystack.match(new RegExp(needle, 'g'));
            return matches ? matches.length : 0;
        };

    test_character_widths = function (chars) {

        // First, create a container element that we'll
        // use to insert and test character widths
        // in, and insert it into the document.
        var test_span = $("<span />")
                .css("font-size", "100%")
                .appendTo("body"),
            // store the set of characters we've already tested
            // into an easier to type var name, just to keep
            // this code below from being crazy looking...
            tests = character_renders_correctly,
            // The initial width of the entered span, so we
            // can test whether entering a given piece of text
            // into the element adds any width.
            default_width = test_span.width();

        $.each(chars, function (index, value) {

            // Only repeat this test if we haven't already tested
            // with this character.
            if (tests[value] === undefined) {

                test_span
                    .text("")
                    .text(value);

                tests[value] = test_span.width() > default_width;
            }
        });

        test_span.remove();
        return tests;
    };

    $.fn.fontSpacing = function (options) {

        var chars_to_test = (options && options.chars)
            ? options.chars
            : ['ʔ', 'ɨ'];

        // Test the character widths outside any loops,
        // so we don't do expensive DOM-insert-then-measure
        // operations more than once for each character
        // we need to test in this page load.
        test_character_widths(chars_to_test);

        this.each(function () {

            var $this = $(this);

            $.each(chars_to_test, function (index, value) {

                // The number of times that the high bit character
                // we're looking for appears in the text of the
                // current element.
                var num_test_chars,
                    test_text = $this.text();

                // For each character that doesn't appear to get
                // spacing in the current font / browser,
                // insert an additional space into the word,
                // right after the non-width-ed character,
                // to give the apperance of the character getting
                // one space worth of width. 
                if (!character_renders_correctly[value]) {
                    $this.html(test_text.replace(new RegExp("(" + value + ")([^\w&])", 'g'), "$1&nbsp;$2"));
                }
            });
        });
    };
}(jQuery));
