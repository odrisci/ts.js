/*! ts v0.0.0 - 2014-07-02 
 * License: MIT */
(function(exports){
  var ts = exports.ts = { version : '0.0.0' };

  // Creates a new timeseries object
  ts.timeSeries = function(){
    var data = [],
        timeSeries = new ts_timeSeries();

    // Inserts the elements from ots into this timeSeries
    timeSeries.splice = function( ots ){

      var odata, i;
      // Check that ots is of the right form:
      // 1) ots is a timeSeries object
      // 2) ots is an array of [ts, value] pairs
      if( ots instanceof ts_timeSeries ){
        odata = ots.data();
      }
      else if( ots instanceof Array ){
        odata = ots;
        // now ensure that the elements are good:
        for( i = 0; i < odata.length; ++i ){
          if( odata[i] instanceof Array ){
            odata[i][0] = +odata[i][0];
          }
          else{
            alert( 'input must be a valid time series' );
            return timeSeries;
          }
        }
      }
      else{
        alert( 'input must be a timeSeries or an array of [timestamp, value] pairs' );
        return timeSeries;
      }

      if( odata.length === 0 ){
        return timeSeries;
      }

      // Ok here we have odata and data, find where one can be inserted into the other
      // Algorithm:
      //  consider odata[j]
      //    find i, index of first element in data such that data[i][0] > data[j][0]
      //    find k, index of first element in odata such that data[i][0]  odata[k][0]
      i = data.length;
      var j = 0;

      //
      while( i > 1 && data[i-1][0] > odata[0][0] ){
        i--;
      }

      while( j < odata.length ){
        var k = odata.length;

        while( i < data.length && data[i][0] <= odata[j][0] ){
          ++i;
        }

        if( i < data.length ){
          while( k > j && data[i][0] < odata[k-1][0] ){
            k--;
          }
        }

        // To splice an array into another array you need to do the following
        var args = [i, 0].concat( odata.slice(j,k) );
        Array.prototype.splice.apply( data, args );
        // The below does not work:
        //data.splice( i, 0, odata.slice(j,k) );

        j = k;

      }

      return timeSeries;

    };

    // Inserts a single [timstamp, value] pair into the timeSeries
    timeSeries.insert = function( timeStamp, value ){
      // Data is sorted by timeStamp, so we simply search backwards to find the place
      // to insert the data. Backwards search is used since we typically at to the end of a
      // timeseries
      var i = data.length - 1;

      if( i < 0 ){
        data.push( timeStamp, value );
        return this;
      }

      while( i > 0  && data[i][0] > timeStamp ){
        i--;
      }

      if( data[i][0] === timeStamp ){
        data[i][1] = value; // overwrite old data
      }
      else{
        data.splice( i+1, 0, [timeStamp, value] );
      }

      return timeSeries;
    };

    // Getter for the internal data - an array of [timeStamp, value] pairs
    timeSeries.data = function(){
      return data;
    };

    // Returns the [ts, value] pair nearest to timeStamp.
    // If an interpolator is provided then the value will be interpolated
    // otherwise a simple rounding is used.
    timeSeries.getValueNearest = function( timeStamp, interpolator ){
      if( data.length === 0 )
        return [];

      var sdata = data.slice();

      sdata.sort( function(a,b){
        return ( Math.abs( a[0] - timeStamp ) - Math.abs( b[0] - timeStamp ) );
      });

      return sdata[0];

    };

    // Returns an array of [ts, value] pairs such that for all ts:
    // start <= ts < stop
    timeSeries.getValuesInRange = function( start, stop ){
      var i = 0, j = data.length;

      while( i < data.length && data[i][0] < start ){
        ++i;
      }

      while( j > 1 && data[j-1][0] >= stop ){
        --j;
      }

      return data.slice(i,j);
    };

    // Drop old data
    timeSeries.dropDataBefore = function( lastTimeToKeep ){

      var i = 0;
      while( i < data.length && data[i][0] < lastTimeToKeep ){
        i++;
      }

      data.splice(0,i);

      return timeSeries;

    };

    return timeSeries;

  };

  function ts_timeSeries() {}
})(this);
