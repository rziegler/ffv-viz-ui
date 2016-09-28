'use strict';

angular.module('ffvApp.version', [
  'ffvApp.version.interpolate-filter',
  'ffvApp.version.version-directive'
])

.value('version', '1.1');