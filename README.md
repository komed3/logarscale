# logscale

This lightweight npm package can be used to calculate a simple logarithmic scale between two given values (minimum and maximum) and the base. It handles negative values as well as any positiv logarithmic base.

## Install

Using Node.js, install the package with the following shell command:

```sh
npm install logscale
```

## Usage

Load the package into your project:

```js
const LogScale = require( 'logscale' );
```

Sample of how to use the package in your code:

```js
let scale = new LogScale( -1.341, 6.5, 2 );

if ( scale.calculate() ) {

    let min = scale.getMinimum();
    // expected: -2

    let max = scale.getMaximum();
    // expected: 7

    let ticks = scale.getTicks();
    // expected: [ -2, 0, 2, 4, 6, 8 ]

    let pct = scale.pct( -1 );
    // expected: 12.5

}
```

### JavaScript

Using JavaScript load this package by embed this file via jsDelivr:

```js
import LinScale from 'https://cdn.jsdelivr.net/npm/locscale@1.0.0/+esm';
```

Remember: To use import you need to load your JavaScript file as ``type="module"``.

## API

Here you can find all methods available in the ``LogScale`` class.

Creating a new instance of ``LogScale`` allows to pass the bounds and logarithmic base. This replaces methods ``setBounds`` and ``setBase``. You still need to run ``calculate()``.

### ``setBounds( min, max )``

Set lower / upper bounds for the scale. Requires to run ``calculate()`` afterwards.

### ``setBase( base )``

Set logarithmic scale for the scale. Can be any positiv number. Requires to run ``calculate()`` afterwards.

### ``centerAt ( [ value = 0 ] )``

Center scale at the given value (default is zero). Requires to run ``calculate()`` afterwards.

### ``calculate()``

Calculates the scale range, minimum, maximum and multiple other things.

### ``getRange()``

Returns the scale range (from min to max).

### ``getMinimum()``

Returns the scale minium value.

### ``getMaximum()``

Returns the scale maximum value.

### ``isNegative()``

Returns if the entire scale is below zero.

### ``getTicks()``

Returns an array of the scale ticks (ascending order).

### ``getTicksReverse()``

Returns an array of the scale ticks (descending order).

### ``pct( value [, from = 'min' ] )``

Returns the percentage of a value within the scale from the reference point (either minimum or maximum value).

## Patch notes

### 1.0.0

* Initial release
