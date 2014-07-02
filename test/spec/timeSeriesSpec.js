'use strict';

describe('timeSeries', function () {

  var theTS, otherTS;

  beforeEach(function(){
    theTS = ts.timeSeries().splice( [ [0, 1], [1, 2], [2, 3] ] );

    otherTS = ts.timeSeries().splice( [ [0.5, 1.5], [0.75, 1.75], [1.5, 2.5], [2.75, 3.75] ] );
  });

  it('should have a timeSeries object with 3 elements in it ', function () {
    expect(theTS.data().length).toBe(3);
  });

  it('should have a data array equal to [0,1], [1,2], [2,3] ]', function() {
    expect(theTS.data()).toEqual( [ [0,1], [1,2], [2,3] ] );
  });

  it('should splice two timeSeries together with sorted results', function() {
    var newTS = ts.timeSeries();
    newTS.splice( theTS );
    newTS.splice( otherTS );

    expect(newTS.data().length).toBe(7);

    expect(newTS.data()).toEqual( [ [0,1], [0.5, 1.5], [0.75, 1.75], [1,2], [1.5, 2.5],
      [2,3], [2.75, 3.75] ] );
  });

  it('should add a new [timeStamp, value] pair at the end', function() {
    var newTS = theTS.insert( 4, 5 );

    expect(newTS.data().length).toBe(4);

    expect(newTS.data()).toEqual( [[0,1],[1,2],[2,3],[4,5]] );
  });

  it( 'should extract values in the given range when they are present', function(){
    expect(theTS.getValuesInRange( 0, 2 )).toEqual( [[0,1],[1,2]] );
  });

  it( 'should return an empty list when no values are in the given range', function(){
    expect(theTS.getValuesInRange(5, 12)).toEqual( [] );
  });

  it( 'should pick out the value nearest to the desired timestamp', function(){
    expect(theTS.getValueNearest( 2 )).toEqual( [2, 3] );
    expect(theTS.getValueNearest( 1.5 )).toEqual( [1,2] );
    expect(theTS.getValueNearest( -1 )).toEqual([0,1]);
  });

  it( 'should drop data older than the specified timestamp', function(){
    expect(theTS.dropDataBefore( 0.5 ).data()).toEqual( [[1,2],[2,3]] );
    expect(theTS.dropDataBefore( 2 ).data()).toEqual([[2,3]]);
  });

});
