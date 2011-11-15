/**
 * balance-delimiters.js
 * 
 * This action looks for the balancing delimiter for the selected character
 * or the one next to the cursor and selects both of them.
 * 
 * setup options:
 * - select (string): specifies what to select; 'both' (default) or 'opposite'
 */

action.canPerformWithContext = function(context, outError) {
	// Only allow the action to be performed if we have a single character or nothing selected
	return context.selectedRanges[0].length <= 1;
};

action.performWithContext = function(context, outError) {
	// Figure out what our character is
	var selection = context.selectedRanges[0],
		startChar = '',
		startIndex = selection.location;
	// Figure out what character we are trying to match
	if (selection.length === 1) {
		startChar = context.substringWithRange(selection);
	} else {
		// Check left first
		if (selection.location > 0) {
			startIndex = selection.location - 1;
			startChar = context.substringWithRange(new Range(startIndex, 1));
		}
		// If it isn't the left character, try the right (if a character exists to the right)
		if (delimiterChars.indexOf(startChar) < 0 && context.string.length - 1 > selection.location) {
			startIndex = selection.location;
			startChar = context.substringWithRange(new Range(startIndex, 1));
		}
	}
	
	// Figure out if what our closing character is, and which direction we are moving
	var charIndex = delimiterChars.indexOf(startChar);
	// If the character is not one we can balance, kill the action
	if (charIndex < 0) {
		return false;
	}
	// Remainder of 1 == even number, so moving backward (because array starts at 0); otherwise moving forward
	var dir = (charIndex % 2 ? -1 : 1),
		endChar = delimiterChars[charIndex + dir];
	
	// Last bit of prep; figure out if we are in a string or not since we will either discount or only count items in strings then
	var zone = context.syntaxTree.zoneAtCharacterIndex(startIndex),
		stringSelector = new SXSelector('string, string *'),
		searchStrings = stringSelector.matches(zone);
	
	// Okay, we're ready to loop over the document until we find our balanced endChar
	var curIndex = startIndex + dir, // Tracks the index in the document we are inspecting
		curChar = '',                // The current character at curIndex
		openItems = 1,               // The number of open paired characters we have found
		endIndex = null,             // Our final index where the paired character lives
		remainingZones = [],         // Used if we need to skip over syntax zones
		arrIndex = 0,                // Index when looping over remainingZones array
		arrCount = 0;                // Length of remainingZones for looping
	while (endIndex === null && curIndex >= 0 && curIndex < context.string.length) {
		// Make sure we are in a string if we want to be
		zone = context.syntaxTree.zoneAtCharacterIndex(curIndex);
		if ((stringSelector.matches(zone) && searchStrings) || (!stringSelector.matches(zone) && !searchStrings)) {
			// Check to see if our current character is one of the ones we are looking for
			curChar = context.string.substr(curIndex, 1);
			// Increment our start or open items if necessary
			if (curChar === startChar) {
				openItems++;
			} else if (curChar === endChar) {
				openItems--;
			}
			// If openItems is 0 it means we have found our balancing character
			if (openItems === 0) {
				endIndex = curIndex;
			}
			// Prep for our next loop iteration
			curIndex += dir;
		} else {
			// Need to jump to end of current string, or to the next string (depending on if we started in a string or not)
			if (stringSelector.matches(zone) && !searchStrings) {
				// We are in a string, but not searching strings
				if (dir === 1) {
					// Parsing forward, so jump to index after string
					curIndex = zone.range.location + zone.range.length + 1;
				} else {
					// Parsing backward, so jump to index before string
					curIndex = zone.range.location - 1;
				}
			} else if (!stringSelector.matches(zone) && searchStrings) {
				// We are outside a string, but are only searching inside of strings; we need to jump to the next string
				// The zones we parse depend on the direction we are moving
				if (dir === 1) {
					// Moving forward, so grab all zones from our index to the end of the document
					remainingZones = context.syntaxTree.zonesInCharacterRange(new Range(curIndex, context.string.length - curIndex));
					arrIndex = 0;
				} else {
					// We are moving backwards, so grab all zones from the beginning of the document to our index
					remainingZones = context.syntaxTree.zonesInCharacterRange(new Range(0, curIndex));
					arrIndex = remainingZones.length;
				}
				// Loop over the array until we find the next string zone
				for (arrCount = remainingZones.length; (dir === 1 && arrIndex < arrCount) || (dir === -1 && arrIndex >= 0); (dir === 1 ? arrIndex++ : arrIndex--)) {
					zone = remainingZones[arrIndex];
					// If we have a string, set the index to the start or end depending on which direction we are moving
					if (stringSelector.matches(zone)) {
						if (dir === 1) {
							curIndex = zone.range.location;
						} else {
							curIndex = zone.range.location + zone.range.length - 1;
						}
						// Kill the loop now that we have our string
						break;
					}
				}
			}
		}
	}
	
	// If we have an endIndex, then select the two characters
	if (endIndex !== null) {
		// Select both delimiters, or the opposite delimiter depending on settings
		if (action.setup.select === 'opposite') {
			context.selectedRanges = [new Range(endIndex, 1)];
		} else {
			// Select both (default)
			context.selectedRanges = [new Range(startIndex, 1), new Range(endIndex, 1)];
		}
		return true;
	} else {
		return false;
	}
};

var delimiterChars = [
	'[', ']',
	'{', '}',
	'(', ')',
	'<', '>'
];
