'use strict';

describe('ffvApp.version module', function() {
  beforeEach(module('ffvApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
