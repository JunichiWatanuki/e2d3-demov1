
/*
 * load parameters
 */

(function() {
  var _baseUrl, _dataType, _dataUrl, _scriptType, _viewport, frame, ref, ref1, ref2, ref3, ref4;

  frame = window.frameElement;

  _baseUrl = (ref = frame.getAttribute('data-base-url')) != null ? ref : '.';

  _scriptType = (ref1 = frame.getAttribute('data-script-type')) != null ? ref1 : 'js';

  _dataType = (ref2 = frame.getAttribute('data-data-type')) != null ? ref2 : 'csv';

  _dataUrl = (ref3 = frame.getAttribute('data-data-url')) != null ? ref3 : "data." + _dataType;

  _viewport = (ref4 = frame.getAttribute('data-viewport')) != null ? ref4 : '#e2d3-chart-area';


  /*
   * config
   */

  require.config({
    baseUrl: _baseUrl,
    paths: E2D3_DEFAULT_PATHS,
    shim: E2D3_DEFAULT_SHIM,
    map: E2D3_DEFAULT_MAP,
    config: {
      text: {
        useXhr: function() {
          return true;
        }
      }
    }
  });


  /*
   * main routine
   */

  require(['domReady!', 'ui/framecommon', 'e2d3util', 'e2d3loader!main.' + _scriptType], function(domReady, common, util, main) {
    document.querySelector('#e2d3-base').href = _baseUrl + '/';
    return common.loadMainCss(function() {
      var chart;
      chart = main != null ? main(document.querySelector(_viewport), _baseUrl, window.parent.storage) : {};
      window.onresize = function(e) {
        return typeof chart.resize === "function" ? chart.resize() : void 0;
      };
      window.debug = {
        setupDebugConsole: function() {
          return util.setupDebugConsole();
        }
      };
      return window.chart = {
        update: function(data) {
          return typeof chart.update === "function" ? chart.update(data, common.onDataUpdated) : void 0;
        },
        save: function() {
          return typeof chart.save === "function" ? chart.save() : void 0;
        },
        storage: function(key, value) {
          return typeof chart.storage === "function" ? chart.storage(key, value) : void 0;
        }
      };
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZyYW1lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtBQUFBLE1BQUE7O0VBR0EsS0FBQSxHQUFRLE1BQU0sQ0FBQzs7RUFFZixRQUFBLCtEQUFpRDs7RUFDakQsV0FBQSxvRUFBdUQ7O0VBQ3ZELFNBQUEsa0VBQW1EOztFQUNuRCxRQUFBLGlFQUFpRCxPQUFBLEdBQVE7O0VBQ3pELFNBQUEsaUVBQWtEOzs7QUFFbEQ7Ozs7RUFHQSxPQUFPLENBQUMsTUFBUixDQUNFO0lBQUEsT0FBQSxFQUFTLFFBQVQ7SUFDQSxLQUFBLEVBQU8sa0JBRFA7SUFFQSxJQUFBLEVBQU0saUJBRk47SUFHQSxHQUFBLEVBQUssZ0JBSEw7SUFJQSxNQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQ0U7UUFBQSxNQUFBLEVBQVEsU0FBQTtpQkFBTTtRQUFOLENBQVI7T0FERjtLQUxGO0dBREY7OztBQVNBOzs7O0VBR0EsT0FBQSxDQUFRLENBQUMsV0FBRCxFQUFjLGdCQUFkLEVBQWdDLFVBQWhDLEVBQTRDLGtCQUFBLEdBQXFCLFdBQWpFLENBQVIsRUFBdUYsU0FBQyxRQUFELEVBQVcsTUFBWCxFQUFtQixJQUFuQixFQUF5QixJQUF6QjtJQUdyRixRQUFRLENBQUMsYUFBVCxDQUF1QixZQUF2QixDQUFvQyxDQUFDLElBQXJDLEdBQTRDLFFBQUEsR0FBVztXQUN2RCxNQUFNLENBQUMsV0FBUCxDQUFtQixTQUFBO0FBQ2pCLFVBQUE7TUFBQSxLQUFBLEdBQ0ssWUFBSCxHQUNFLElBQUEsQ0FBSyxRQUFRLENBQUMsYUFBVCxDQUF1QixTQUF2QixDQUFMLEVBQXdDLFFBQXhDLEVBQWtELE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBaEUsQ0FERixHQUdFO01BRUosTUFBTSxDQUFDLFFBQVAsR0FBa0IsU0FBQyxDQUFEO29EQUNoQixLQUFLLENBQUM7TUFEVTtNQUdsQixNQUFNLENBQUMsS0FBUCxHQUNFO1FBQUEsaUJBQUEsRUFBbUIsU0FBQTtpQkFDakIsSUFBSSxDQUFDLGlCQUFMLENBQUE7UUFEaUIsQ0FBbkI7O2FBRUYsTUFBTSxDQUFDLEtBQVAsR0FDRTtRQUFBLE1BQUEsRUFBUSxTQUFDLElBQUQ7c0RBQ04sS0FBSyxDQUFDLE9BQVEsTUFBTSxNQUFNLENBQUM7UUFEckIsQ0FBUjtRQUVBLElBQUEsRUFBTSxTQUFBO29EQUNKLEtBQUssQ0FBQztRQURGLENBRk47UUFJQSxPQUFBLEVBQVMsU0FBQyxHQUFELEVBQU0sS0FBTjt1REFDUCxLQUFLLENBQUMsUUFBUyxLQUFLO1FBRGIsQ0FKVDs7SUFkZSxDQUFuQjtFQUpxRixDQUF2RjtBQTFCQSIsImZpbGUiOiJmcmFtZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIyBsb2FkIHBhcmFtZXRlcnNcbiMjI1xuZnJhbWUgPSB3aW5kb3cuZnJhbWVFbGVtZW50XG5cbl9iYXNlVXJsID0gZnJhbWUuZ2V0QXR0cmlidXRlKCdkYXRhLWJhc2UtdXJsJykgPyAnLidcbl9zY3JpcHRUeXBlID0gZnJhbWUuZ2V0QXR0cmlidXRlKCdkYXRhLXNjcmlwdC10eXBlJykgPyAnanMnXG5fZGF0YVR5cGUgPSBmcmFtZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGF0YS10eXBlJykgPyAnY3N2J1xuX2RhdGFVcmwgPSBmcmFtZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGF0YS11cmwnKSA/IFwiZGF0YS4je19kYXRhVHlwZX1cIlxuX3ZpZXdwb3J0ID0gZnJhbWUuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXdwb3J0JykgPyAnI2UyZDMtY2hhcnQtYXJlYSdcblxuIyMjXG4jIGNvbmZpZ1xuIyMjXG5yZXF1aXJlLmNvbmZpZ1xuICBiYXNlVXJsOiBfYmFzZVVybFxuICBwYXRoczogRTJEM19ERUZBVUxUX1BBVEhTXG4gIHNoaW06IEUyRDNfREVGQVVMVF9TSElNXG4gIG1hcDogRTJEM19ERUZBVUxUX01BUFxuICBjb25maWc6XG4gICAgdGV4dDpcbiAgICAgIHVzZVhocjogKCkgLT4gdHJ1ZVxuXG4jIyNcbiMgbWFpbiByb3V0aW5lXG4jIyNcbnJlcXVpcmUgWydkb21SZWFkeSEnLCAndWkvZnJhbWVjb21tb24nLCAnZTJkM3V0aWwnLCAnZTJkM2xvYWRlciFtYWluLicgKyBfc2NyaXB0VHlwZV0sIChkb21SZWFkeSwgY29tbW9uLCB1dGlsLCBtYWluKSAtPlxuXG4gICMgc2V0IGJhc2UgdXJpXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlMmQzLWJhc2UnKS5ocmVmID0gX2Jhc2VVcmwgKyAnLydcbiAgY29tbW9uLmxvYWRNYWluQ3NzICgpIC0+XG4gICAgY2hhcnQgPVxuICAgICAgaWYgbWFpbj9cbiAgICAgICAgbWFpbiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF92aWV3cG9ydCksIF9iYXNlVXJsLCB3aW5kb3cucGFyZW50LnN0b3JhZ2VcbiAgICAgIGVsc2VcbiAgICAgICAge31cblxuICAgIHdpbmRvdy5vbnJlc2l6ZSA9IChlKSAtPlxuICAgICAgY2hhcnQucmVzaXplPygpXG5cbiAgICB3aW5kb3cuZGVidWcgPVxuICAgICAgc2V0dXBEZWJ1Z0NvbnNvbGU6ICgpIC0+XG4gICAgICAgIHV0aWwuc2V0dXBEZWJ1Z0NvbnNvbGUoKVxuICAgIHdpbmRvdy5jaGFydCA9XG4gICAgICB1cGRhdGU6IChkYXRhKSAtPlxuICAgICAgICBjaGFydC51cGRhdGU/IGRhdGEsIGNvbW1vbi5vbkRhdGFVcGRhdGVkXG4gICAgICBzYXZlOiAoKSAtPlxuICAgICAgICBjaGFydC5zYXZlPygpXG4gICAgICBzdG9yYWdlOiAoa2V5LCB2YWx1ZSkgLT5cbiAgICAgICAgY2hhcnQuc3RvcmFnZT8oa2V5LCB2YWx1ZSlcbiJdfQ==
