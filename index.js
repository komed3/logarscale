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

        if ( _low && _high ) {

            this.setBounds( _low, _high );

        }

        if ( _base ) {

            this.setBase( _base );

        }

    };

    /**
     * @private
     * calculate logarithmic base
     * 
     * @param {Number} number number to calculate base for
     * @returns {Number} logarithmic base
     */
    #base ( number ) {

        return number === 0 ? 0 : (
            Math.log( Math.abs( parseFloat( number ) ) ) / Math.log( this.base )
        );

    };

    /**
     * @private
     * find nearest power
     * 
     * @param {Number} number number to find nearest power for
     * @returns {Number} nearest power
     */
    #nearest ( number ) {

        return number === 0 ? 0 : (
            Math.pow(
                this.base, Math.ceil( this.#base( number ) )
            ) * (
                number < 1 ? -1 : 1
            )
        );

    };

    /**
     * @private
     * generates a range of powers
     * 
     * @param {Number} start range start
     * @param {Number} stop range end
     * @param {Int} sign sign if positive or negative
     * @returns {Number[]} generated range of powers
     */
    #range ( start, stop, sign = 1 ) {

        return Array.from(
            { length: stop - start + 1 },
            ( _, i ) => Math.pow( this.base, start + i ) * sign
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

        this.base = parseFloat( base );

        this.is = false;

    };

    /**
     * calculates scale min / max and step size
     * 
     * @returns {Boolean} scale successfully generated
     */
    calculate () {

        if ( this.lowerBound && this.upperBound && this.base ) {

            this.min = this.#nearest( this.lowerBound );
            this.max = this.#nearest( this.upperBound );

            this.range = this.max - this.min;

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

            let start = Math.ceil( this.#base( this.min ) );
            let stop = Math.floor( this.#base( this.max ) );

            if ( this.min < 0 && this.max > 0 ) {

                return [
                    -Math.pow( this.base, start ), 0,
                    ...this.#range( start, stop )
                ];

            } else {

                return this.#range(
                    start, stop,
                    this.min < 0 ? -1 : 1
                );

            }

        }

    };

};