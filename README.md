# LogarScale

This lightweight npm package can be used to calculate a simple logarithmic scale between two given values (minimum and maximum) and the base.

It handles negative values as well as any positiv logarithmic base.

> [!WARNING]
> This package is no longer actively developed, maintained or supported.  
> Please use the **[scalax](https://npmjs.com/package/scalax)** package instead.

## Install

Using Node.js, install the package with the following shell command:

```sh
npm install logarscale
```

## Usage

Load the package into your project:

```js
const LogarScale = require( 'logarscale' );
```

Sample of how to use the package in your code:

```js
let scale = new LogarScale( -1.341, 6.5, 2 );

if ( scale.calculate() ) {

    let min = scale.getMinimum();
    // expected: -2

    let max = scale.getMaximum();
    // expected: 8

    let ticks = scale.getTicks( false );
    // expected: [ -2, 0, 2, 4, 8 ]

    let pct = scale.pct( 2 );
    // expected: 50

    let crossesZero = scale.crossesZero();
    // expected: true

}
```

### JavaScript

Using JavaScript load this package by embed this file via jsDelivr:

```js
import LogarScale from 'https://cdn.jsdelivr.net/npm/logarscale@1.0.0/+esm';
```

Remember: To use import you need to load your JavaScript file as ``type="module"``.

## API

Here you can find all methods available in the ``LogarScale`` class.

Creating a new instance of ``LogarScale`` allows to pass the bounds and logarithmic base. This replaces methods ``setBounds`` and ``setBase``. You still need to run ``calculate()``.

### ``setBounds( min, max )``

Set lower / upper bounds for the scale. Requires to run ``calculate()`` afterwards.

### ``setBase( base )``

Set logarithmic scale for the scale. Can be any positiv number. Requires to run ``calculate()`` afterwards.

### ``centerAt ( [ value = 0 ] )``

Center scale at the given value (default is zero). Requires to run ``calculate()`` afterwards.

### ``calculate()``

Calculates the scale range, minimum, maximum and multiple other things.

### ``isNegative()``

Checks if the entire scale is negative. Returns true if the scale is negative.

### ``crossesZero()``

Checks if the scale crosses zero. Returns true if the scale crosses zero.

### ``getRange()``

Returns the scale range (from min to max).

### ``getMinimum()``

Returns the scale minium value.

### ``getMaximum()``

Returns the scale maximum value.

### ``getTicks( [ pow0 = true ] )``

Returns an array of the scale ticks (ascending order).

If ``pow0 = false``, ticks for ``x^0`` on both sides the scale (negative and positive) will be excluded. This only hits when the scale has positive and negative values (crosses zero).

### ``getTicksReverse( [ pow0 = true ] )``

Returns an array of the scale ticks (descending order).

### ``pct( value [, from = 'min' ] )``

Returns the percentage of a value within the scale from the reference point (either minimum or maximum value).

## Patch notes

### 1.0.1

* Successor **[scalax](https://npmjs.com/package/scalax)** takes over this package

### 1.0.0

* Initial release
