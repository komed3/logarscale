/**
 * logscale
 * lightweight npm package to create logarithmic scales
 * 
 * This lightweight npm package can be used to calculate a simple
 * logarithmic scale between two given values (minimum and maximum)
 * and the base. It handles negative values as well as any positiv
 * logarithmic base.
 * 
 * @author komed3 (Paul Köhler)
 * @version 1.0.0
 * @license MIT
 */

'use strict';

module.exports = class LogScale {

    /**
     * indicates whether the scale has been successfully calculated
     * 
     * @type {Boolean}
     */
    is = false;

    /**
     * logarithmic base used for calculations
     * default is "10"
     * 
     * @type {Number}
     */
    base = 10;

    /**
     * initializes a LogScale instance
     * 
     * @param {Number} [_low] lower bound
     * @param {Number} [_high] upper bound
     * @param {Number} [_base] logarithmic base
     */
    constructor ( _low, _high, _base ) {

        if ( _low !== undefined && _high !== undefined ) {

            this.setBounds( _low, _high );

        }

        if ( _base !== undefined ) {

            this.setBase( _base );

        }

    };

    /**
     * @private
     * calculate logarithmic base
     * 
     * @param {Number} value value to calculate base for
     * @returns {Number} logarithmic base
     */
    #base ( value ) {

        return value === 0 ? 0 : (
            Math.log( Math.abs( parseFloat( value ) ) ) /
            Math.log( this.base )
        );

    };

    /**
     * @private
     * find nearest power
     * 
     * @param {Number} value value to find nearest power for
     * @returns {Number} nearest power
     */
    #nearest ( value ) {

        if ( value === 0 ) {

            return {
                lower: 0,
                upper: 0
            };

        } else {

            let logValue = this.#base( value );
            let sign = value < 1 ? -1 : 1;

            return {
                lower: Math.pow( this.base, Math.floor( logValue ) ) * sign,
                upper: Math.pow( this.base, Math.ceil( logValue ) ) * sign
            };

        }

    };

    /**
     * @private
     * generates a range of powers
     * 
     * @param {Number} start range start
     * @param {Number} stop range end
     * @param {Int} [sign=1] sign (positive or negative)
     * @returns {Number[]} generated range of powers
     */
    #range ( start, stop, sign = 1 ) {

        return Array.from(
            { length: Math.abs( stop - start ) + 1 },
            ( _, i ) => Math.pow( this.base, start + i * sign ) * sign
        );

    };

    /**
     * set lower / upper bounds
     * 
     * @param {Number} low lower bound
     * @param {Number} high upper bound
     */
    setBounds ( low, high ) {

        low = parseFloat( low );
        high = parseFloat( high );

        this.lowerBound = Math.min( low, high );
        this.upperBound = Math.max( low, high );

        this.is = false;

    };

    /**
     * set logarithmic base
     * 
     * @param {Number} base logarithmic base
     */
    setBase ( base ) {

        if ( ( base = parseFloat( base ) ) > 0 ) {

            this.base = base;

        }

        this.is = false;

    };

    /**
     * center scale at value
     * 
     * @param {Number} [value=0] center value
     */
    centerAt( value = 0 ) {

        if (
            this.lowerBound !== undefined &&
            this.upperBound !== undefined
        ) {

            value = parseFloat( value );

            let abs = Math.max(
                Math.abs( value - this.lowerBound ),
                Math.abs( value - this.upperBound )
            );

            this.lowerBound = value - abs;
            this.upperBound = value + abs;

            this.is = false;

        }

    };

    /**
     * calculates scale min / max and step size
     * 
     * @returns {Boolean} scale successfully generated
     */
    calculate () {

        if (
            this.lowerBound !== undefined &&
            this.upperBound !== undefined &&
            this.base !== undefined
        ) {

            let nearestLower = this.#nearest( this.lowerBound );
            let nearestUpper = this.#nearest( this.upperBound );

            this.min = this.lowerBound < 0
                ? nearestLower.upper
                : nearestLower.lower;

            this.max = this.upperBound < 0
                ? nearestUpper.lower
                : nearestUpper.upper;

            this.range = this.max - this.min;

            this.logMin = this.#base( this.min );
            this.logMax = this.#base( this.max );

            this.logRange = this.logMax - this.logMin;

            this.is = true;

        }

        return this.is;

    };

    /**
     * checks if the entire scale is negative
     * 
     * @returns {Boolean} true if the scale is negative
     */
    isNegative () {

        if ( this.is ) {

            return this.max <= 0;

        }

    };

    /**
     * checks if the scale crosses zero
     * 
     * @returns {Boolean} true if the scale crosses zero
     */
    crossesZero () {

        if ( this.is ) {

            return this.min < 0 && this.max > 0;

        }

    };

    /**
     * get scale range
     * 
     * @returns {Number} range
     */
    getRange () {

        if ( this.is ) {

            return this.range;

        }

    };

    /**
     * gets scale maximum
     * 
     * @returns {Number} maximum
     */
    getMaximum () {

        if ( this.is ) {

            return this.max;

        }

    };

    /**
     * get scale minimum
     * 
     * @returns {Number} minimum
     */
    getMinimum () {

        if ( this.is ) {

            return this.min;

        }

    };

    /**
     * get scale ticks
     * 
     * @param {Boolean} [pow0=true] include x^0
     * @returns {Number[]} ticks
     */
    getTicks ( pow0 = true ) {

        if ( this.is ) {

            let start = this.isNegative()
                ? Math.ceil( this.logMin )
                : Math.floor( this.logMin );

            let stop = this.isNegative()
                ? Math.floor( this.logMax )
                : Math.ceil( this.logMax );

            let ticks = [];

            if ( this.crossesZero() ) {

                return [
                    ...this.#range( start, +!pow0, -1 ),
                    0, ...this.#range( +!pow0, stop )
                ];

            } else {

                return [
                    ...( this.min === 0 ? [ 0 ] : [] ),
                    ...this.#range( start, stop, this.isNegative() ? -1 : 1 ),
                    ...( this.max === 0 ? [ 0 ] : [] )
                ];

            }

        }

    };

    /**
     * gets scale ticks in reverse order
     * 
     * @param {Boolean} [pow0=true] include x^0
     * @returns {Number[]} ticks
     */
    getTicksReverse ( pow0 = true ) {

        if ( this.is ) {

            return this.getTicks( pow0 ).reverse();

        }

    };

    /**
     * get percentage of a value within the scale
     * 
     * @param {Number} value value to calculate the percentage for
     * @param {String} [from="min"] reference point ( min / max )
     * @returns {Number} percentage
     */
    pct( value, from = 'min' ) {

        if ( this.is ) {

            value = parseFloat( value );

            let logValue = this.#base( value ),
                pct;

            if ( this.crossesZero() ) {

                let logNeg = Math.abs( this.logMin ),
                    logPos = this.logMax,
                    logTotal = logNeg + logPos;

                if ( value < 0 ) {

                    pct = (
                        ( logNeg - Math.abs( logValue ) ) / logNeg
                    ) * (
                        logNeg / logTotal
                    ) * 100;

                } else if ( value > 0 ) {

                    pct = (
                        ( logValue / logPos ) * ( logPos / logTotal ) * 100
                    ) + (
                        logNeg / logTotal * 100
                    );

                } else {

                    pct = logNeg / logTotal * 100;

                }

            } else {

                pct = (
                    logValue - this.logMin
                ) / (
                    this.isNegative()
                        ? this.logMin - this.logMax
                        : this.logMax - this.logMin
                );

                pct = 100 * this.isNegative()
                    ? 1 - pct - 1
                    : pct;

            }

            return Math.abs(
                ( from === 'max' ? 100 : 0 ) - pct
            );

        }

    };

};