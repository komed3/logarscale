/**
 * logscale
 * lightweight npm package to create logarithmic scales
 * 
 * @author komed3 (Paul Köhler)
 * @version 1.0.0
 * @license MIT
 */

'use strict';

module.exports = class LogScale {

    is = false;
    base = 10;

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
            Math.log( Math.abs( parseFloat( value ) ) ) / Math.log( this.base )
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

            return { lower: 0, upper: 0 };

        }

        let sign = value < 1 ? -1 : 1;

        value = this.#base( value );

        return {
            lower: Math.pow( this.base, Math.floor( value ) ) * sign,
            upper: Math.pow( this.base, Math.ceil( value ) ) * sign
        };

    };

    /**
     * @private
     * generates a range of powers
     * 
     * @param {Number} start range start
     * @param {Number} stop range end
     * @param {Int} [sign=1] sign if positive or negative
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

        this.is = false;

        if ( ( base = parseFloat( base ) ) > 0 ) {

            this.base = base;

        }

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
     * @returns {Number[]} ticks
     */
    getTicks () {

        if ( this.is ) {

            let negative = this.min < 0 && this.max < 0;

            let start = negative
                ? Math.ceil( this.logMin )
                : Math.floor( this.logMin );

            let stop = negative
                ? Math.floor( this.logMax )
                : Math.ceil( this.logMax );

            if ( this.min < 0 && this.max > 0 ) {

                return [
                    ...this.#range( start, 0, -1 ),
                    0, ...this.#range( 0, stop )
                ];

            } else {

                return this.#range(
                    start, stop,
                    negative ? -1 : 1
                );

            }

        }

    };

    /**
     * gets scale ticks in reverse order
     * 
     * @returns {Number[]} ticks
     */
    getTicksReverse () {

        if ( this.is ) {

            return this.getTicks().reverse();

        }

    };

    /**
     * get percentage of a value within the scale
     * 
     * @param {Number} value value to calculate the percentage for
     * @param {String} [from="min"] reference point ( min / max )
     * @returns {Number} percentage
     */
    pct ( value, from = 'min' ) {

        if ( this.is ) {

            value = this.#base( value );

            switch ( from ) {

                default:
                case 'min':
                    return ( ( value - this.logMin ) / this.logRange ) * 100;

                case 'max':
                    return ( ( this.logMax - value ) / this.logRange ) * 100;

            }

        }

    };

};