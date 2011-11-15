# Seesaw.sugar

Seesaw.sugar provides on-demand balanced delimiter selecting for MacRabbit's [Espresso](http://macrabbit.com/espresso/) text editor.

For instance, take this Javascript fragment:

    function example(anArgument) {
        var customObject = {
            foo: 'bar',
            stuff: 'things'
        };
    }

If you place your cursor next to the first `{` character and select **Actions&rarr;Seesaw&rarr;Select Balanced Delimiters** then the first `{` and last `}` characters will both be selected. Conversely, if you chose **Jump To Balanced Delimiter** instead, the last `}` character would be selected.

This allows you to very quickly see which delimiters are balanced against one another or to jump to the start or end of a block.

Seesaw currently works with the following characters:

* ( and )
* [ and ]
* { and }
* < and >

Lastly, if you place your cursor next to a delimiter character inside of a string, Seesaw will only look for closing delimiters in strings. For instance, take this nonsensical but illustrative code fragment:

    var myJSONString = '{ "foo": "bar"';
    if (foobarring) {
        myJSONString = myJSONString + ', "morefoo": "betterBar"';
        myJSONString += "}";
    }

If you place your cursor next to the `{` character in the first string and choose **Jump To Balanced Delimiter**, the `}` character in the string on the fourth line will be selected.

## Installation

**Requires Espresso 2**

The easiest way to install Seesaw.sugar currently is directly from GitHub:

    cd ~/Library/Application\ Support/Espresso/Sugars
    git clone git://github.com/onecrayon/Seesaw.sugar.git

Relaunch Espresso, and a new Seesaw submenu will be available in your Actions menu.

Alternately, you can [download the project](https://github.com/onecrayon/Seesaw.sugar/zipball/master), decompress it, rename the resulting folder "Seesaw.sugar", and double click it to install.

## Development

Seesaw.sugar is written entirely in XML and JavaScript using Espresso's [JavaScript API](http://wiki.macrabbit.com/index/JavaScriptActions/)! To discover how I'm doing things or tweak its behavior to fit your own needs, right click the Sugar in the Finder and choose Show Package Contents or fork this project and go to town.

You can also [let me know](http://onecrayon.com/about/contact/) if you have any feedback, requests, or run across any problems.

I would like to implement the following (and if you want any of this sooner, feel free to try implementing it yourself!):

* Itemizer-based handling for entire HTML tags
* Quotation marks around strings
* Itemizer-based handling for slashes around Javascript regex zones
* Maybe balancing multiline comment delimiters? Other balanced delimiters that I've overlooked?

## MIT License

Copyright (c) 2011 Ian Beck

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
