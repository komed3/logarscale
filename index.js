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

    constructor ( _low, _high, _ticks, _base ) {

        if ( _low && _high ) {

            this.setBounds( _low, _high );

        }

        if ( _ticks ) {

            this.setMaxTicks( _ticks );

        }

        if ( _base ) {

            this.setBase( _base );

        }

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
     * set maximum number of ticks
     * 
     * @param {Number} ticks number of ticks
     */
    setMaxTicks ( ticks ) {

        this.maxTicks = parseInt( ticks );

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

};