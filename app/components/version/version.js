'use strict';

angular.module('ffvApp.version', [
  'ffvApp.version.interpolate-filter',
  'ffvApp.version.version-directive'
])

.value('version', '0.1');
