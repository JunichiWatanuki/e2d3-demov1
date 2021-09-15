(function() {
  var _dataType, _path, _scriptType, params, ref, ref1, ref2;

  params = window.location.hash.substring(1).split('!');


  /*
   * load parameters
   */

  _path = (ref = params[0]) != null ? ref : '.';

  _scriptType = (ref1 = params[1]) != null ? ref1 : 'js';

  _dataType = (ref2 = params[2]) != null ? ref2 : 'csv';


  /*
   * config
   */

  require.config({
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

  require(['bootstrap', 'jquery', 'vue', 'd3', 'e2d3', 'ui/i18n', 'ui/components', 'ui/colorthemes', 'ui/capabilities'], function(bootstrap, $, Vue, d3, e2d3, i18n, components, colorthemes, capabilities) {
    e2d3.util.setupLiveReloadForDelegateMode();
    $(function() {
      return $('[data-toggle="tooltip"]').tooltip();
    });
    return new Vue({
      el: 'body',
      data: function() {
        return {
          bound: true,
          capabilities: {},
          themes: colorthemes,
          selectedColors: []
        };
      },
      components: {
        themes: {
          props: ['themes'],
          template: '#themes',
          methods: {
            select: function(theme) {
              this.$parent.selectedColors = theme.colors;
              return this.$parent.chart().storage('colors', theme.colors);
            }
          }
        }
      },
      ready: function() {
        this.binding = null;
        this.baseUrl = e2d3.util.baseUrl(_path);
        this.fetchManifest();
        return this.initExcel().then((function(_this) {
          return function() {
            _this.initState();
            return _this.createFrame();
          };
        })(this)).then((function(_this) {
          return function() {
            if (e2d3.util.isDebugConsoleEnabled()) {
              _this.debug().setupDebugConsole();
            }
            return _this.bindStored()["catch"](function(err) {
              return _this.fillWithSampleData();
            });
          };
        })(this));
      },
      methods: {
        initExcel: function() {
          return e2d3.initialize();
        },
        initState: function() {
          var chart, parameter, ref3;
          chart = e2d3.excel.initAttribute('chart', {
            path: _path,
            scriptType: _scriptType,
            dataType: _dataType
          });
          parameter = e2d3.excel.initAttribute('parameter', {});
          return this.selectedColors = (ref3 = parameter.colors) != null ? ref3 : this.themes[0].colors;
        },
        createFrame: function() {
          window.storage = (function(_this) {
            return function(key, value) {
              var parameter;
              parameter = e2d3.excel.getAttribute('parameter');
              if (value != null) {
                parameter[key] = value;
                e2d3.excel.storeAttribute('parameter', parameter);
                _this.storageChanged(key, value);
              }
              return parameter[key];
            };
          })(this);
          this.frame = document.createElement('iframe');
          this.frame.src = 'frame.html';
          this.frame.width = '100%';
          this.frame.height = '100%';
          this.frame.frameBorder = 0;
          this.frame.setAttribute('data-base-url', this.baseUrl);
          this.frame.setAttribute('data-script-type', _scriptType);
          this.frame.setAttribute('data-data-type', _dataType);
          this.$els.frame.appendChild(this.frame);
          return new Promise((function(_this) {
            return function(resolve, reject) {
              var checkframe;
              checkframe = function() {
                if (_this.chart() != null) {
                  return resolve();
                } else {
                  return setTimeout(checkframe, 100);
                }
              };
              return checkframe();
            };
          })(this));
        },
        storageChanged: function(key, value) {
          if (key === 'colors') {
            return this.selectedColors = value;
          }
        },
        chart: function() {
          var ref3, ref4;
          return (ref3 = this.frame) != null ? (ref4 = ref3.contentWindow) != null ? ref4.chart : void 0 : void 0;
        },
        debug: function() {
          var ref3, ref4;
          return (ref3 = this.frame) != null ? (ref4 = ref3.contentWindow) != null ? ref4.debug : void 0 : void 0;
        },
        fillWithSampleData: function() {
          return this.fetchSampleData().then((function(_this) {
            return function() {
              return _this.bindSelected();
            };
          })(this)).then((function(_this) {
            return function() {
              return _this.bound = true;
            };
          })(this))["catch"]((function(_this) {
            return function(err) {
              _this.onError(err);
              return _this.bound = false;
            };
          })(this));
        },
        rebindSelectedCells: function() {
          return this.bindSelected().then((function(_this) {
            return function() {
              return _this.bound = true;
            };
          })(this))["catch"]((function(_this) {
            return function(err) {
              return _this.onError(err);
            };
          })(this));
        },
        saveImage: function(type) {
          return e2d3.save(this.chart().save().node(), type, this.baseUrl);
        },
        shareChart: function() {
          return this.getBoundData().then(function(data) {
            var parameter;
            parameter = e2d3.excel.getAttribute('parameter');
            return e2d3.api.upload(_path, _scriptType, parameter, data);
          }).then((function(_this) {
            return function(result) {
              return _this.showShare(result.url);
            };
          })(this))["catch"]((function(_this) {
            return function(err) {
              return _this.showAlert({
                name: 'Error on sharing',
                message: err.statusText
              });
            };
          })(this));
        },
        goHome: function() {
          var ref3;
          e2d3.excel.removeAttribute('chart');
          e2d3.excel.removeAttribute('parameter');
          if ((ref3 = this.binding) != null) {
            ref3.release()["catch"](this.onError);
          }
          return window.location.href = 'index.html';
        },
        fetchManifest: function() {
          return d3.promise.yaml(this.baseUrl + "/manifest.yml").then((function(_this) {
            return function(obj) {
              return _this.capabilities = capabilities.extract(obj.capabilities);
            };
          })(this))["catch"]((function(_this) {
            return function(err) {
              return _this.capabilities = capabilities.extract(void 0);
            };
          })(this));
        },
        fetchSampleData: function() {
          return d3.promise.text(this.baseUrl + "/data." + _dataType).then(function(text) {
            return e2d3.excel.fill(_dataType, text);
          });
        },
        bindSelected: function() {
          return this.bind(e2d3.excel.bindSelected());
        },
        bindStored: function() {
          return this.bind(e2d3.excel.bindStored());
        },
        bind: function(binder) {
          var renderBinding, updateBinding;
          updateBinding = (function(_this) {
            return function(binding) {
              var ref3;
              if ((ref3 = _this.binding) != null) {
                ref3.release()["catch"](_this.onError);
              }
              _this.binding = binding;
              return _this.binding.on('change', renderBinding);
            };
          })(this);
          renderBinding = (function(_this) {
            return function() {
              return _this.getBoundData().then(function(data) {
                _this.chart().update(data);
                return Promise.resolve();
              });
            };
          })(this);
          return binder.then(function(binding) {
            updateBinding(binding);
            return renderBinding();
          });
        },
        getBoundData: function() {
          if (this.binding != null) {
            return this.binding.fetchData();
          } else {
            return Promise.resolve(e2d3.data.empty());
          }
        },
        onError: function(err) {
          this.showAlert(i18n.error(err));
          return e2d3.onError(err);
        },
        showAlert: function(title, message) {
          return this.$refs.alert.show(title, message);
        },
        showShare: function(url) {
          return this.$refs.share.show(url);
        }
      }
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,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LENBQUEsQ0FBQSxJQUFBO2lCQU1oQixNQUNFLENBQUMsSUFESCxDQUNRLFNBQUMsT0FBRDtZQUNKLGFBQUEsQ0FBYyxPQUFkO21CQUNBLGFBQUEsQ0FBQTtVQUZJLENBRFI7UUFaSSxDQTNHTjtRQTRIQSxZQUFBLEVBQWMsU0FBQTtVQUNaLElBQUcsb0JBQUg7bUJBQ0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQUEsRUFERjtXQUFBLE1BQUE7bUJBR0UsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFWLENBQUEsQ0FBaEIsRUFIRjs7UUFEWSxDQTVIZDtRQWtJQSxPQUFBLEVBQVMsU0FBQyxHQUFEO1VBQ1AsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsQ0FBWDtpQkFDQSxJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWI7UUFGTyxDQWxJVDtRQXNJQSxTQUFBLEVBQVcsU0FBQyxLQUFELEVBQVEsT0FBUjtpQkFDVCxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFiLENBQWtCLEtBQWxCLEVBQXlCLE9BQXpCO1FBRFMsQ0F0SVg7UUF5SUEsU0FBQSxFQUFXLFNBQUMsR0FBRDtpQkFDVCxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFiLENBQWtCLEdBQWxCO1FBRFMsQ0F6SVg7T0FuQ0Y7S0FERTtFQU5pSCxDQUF2SDtBQXBCQSIsImZpbGUiOiJjaGFydC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbInBhcmFtcyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKS5zcGxpdCAnISdcblxuIyMjXG4jIGxvYWQgcGFyYW1ldGVyc1xuIyMjXG5fcGF0aCA9IHBhcmFtc1swXSA/ICcuJ1xuX3NjcmlwdFR5cGUgPSBwYXJhbXNbMV0gPyAnanMnXG5fZGF0YVR5cGUgPSBwYXJhbXNbMl0gPyAnY3N2J1xuXG4jIyNcbiMgY29uZmlnXG4jIyNcbnJlcXVpcmUuY29uZmlnXG4gIHBhdGhzOiBFMkQzX0RFRkFVTFRfUEFUSFNcbiAgc2hpbTogRTJEM19ERUZBVUxUX1NISU1cbiAgbWFwOiBFMkQzX0RFRkFVTFRfTUFQXG4gIGNvbmZpZzpcbiAgICB0ZXh0OlxuICAgICAgdXNlWGhyOiAoKSAtPiB0cnVlXG5cbnJlcXVpcmUgWydib290c3RyYXAnLCAnanF1ZXJ5JywgJ3Z1ZScsICdkMycsICdlMmQzJywgJ3VpL2kxOG4nLCAndWkvY29tcG9uZW50cycsICd1aS9jb2xvcnRoZW1lcycsICd1aS9jYXBhYmlsaXRpZXMnXSwgKGJvb3RzdHJhcCwgJCwgVnVlLCBkMywgZTJkMywgaTE4biwgY29tcG9uZW50cywgY29sb3J0aGVtZXMsIGNhcGFiaWxpdGllcykgLT5cblxuICBlMmQzLnV0aWwuc2V0dXBMaXZlUmVsb2FkRm9yRGVsZWdhdGVNb2RlKClcblxuICAkIC0+ICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKClcblxuICBuZXcgVnVlXG4gICAgZWw6ICdib2R5J1xuXG4gICAgZGF0YTogKCkgLT5cbiAgICAgIGJvdW5kOiB0cnVlXG4gICAgICBjYXBhYmlsaXRpZXM6IHt9XG4gICAgICB0aGVtZXM6IGNvbG9ydGhlbWVzXG4gICAgICBzZWxlY3RlZENvbG9yczogW11cblxuICAgIGNvbXBvbmVudHM6XG4gICAgICB0aGVtZXM6XG4gICAgICAgIHByb3BzOiBbJ3RoZW1lcyddXG4gICAgICAgIHRlbXBsYXRlOiAnI3RoZW1lcydcbiAgICAgICAgbWV0aG9kczpcbiAgICAgICAgICBzZWxlY3Q6ICh0aGVtZSkgLT5cbiAgICAgICAgICAgIEAkcGFyZW50LnNlbGVjdGVkQ29sb3JzID0gdGhlbWUuY29sb3JzXG4gICAgICAgICAgICBAJHBhcmVudC5jaGFydCgpLnN0b3JhZ2UgJ2NvbG9ycycsIHRoZW1lLmNvbG9yc1xuXG4gICAgcmVhZHk6ICgpIC0+XG4gICAgICBAYmluZGluZyA9IG51bGxcbiAgICAgIEBiYXNlVXJsID0gZTJkMy51dGlsLmJhc2VVcmwgX3BhdGhcblxuICAgICAgQGZldGNoTWFuaWZlc3QoKVxuXG4gICAgICBAaW5pdEV4Y2VsKClcbiAgICAgICAgLnRoZW4gKCkgPT5cbiAgICAgICAgICBAaW5pdFN0YXRlKClcbiAgICAgICAgICBAY3JlYXRlRnJhbWUoKVxuICAgICAgICAudGhlbiAoKSA9PlxuICAgICAgICAgIEBkZWJ1ZygpLnNldHVwRGVidWdDb25zb2xlKCkgaWYgZTJkMy51dGlsLmlzRGVidWdDb25zb2xlRW5hYmxlZCgpXG5cbiAgICAgICAgICBAYmluZFN0b3JlZCgpXG4gICAgICAgICAgICAuY2F0Y2ggKGVycikgPT5cbiAgICAgICAgICAgICAgQGZpbGxXaXRoU2FtcGxlRGF0YSgpXG5cbiAgICBtZXRob2RzOlxuICAgICAgaW5pdEV4Y2VsOiAoKSAtPlxuICAgICAgICBlMmQzLmluaXRpYWxpemUoKVxuXG4gICAgICBpbml0U3RhdGU6ICgpIC0+XG4gICAgICAgIGNoYXJ0ID0gZTJkMy5leGNlbC5pbml0QXR0cmlidXRlICdjaGFydCcsXG4gICAgICAgICAgcGF0aDogX3BhdGhcbiAgICAgICAgICBzY3JpcHRUeXBlOiBfc2NyaXB0VHlwZVxuICAgICAgICAgIGRhdGFUeXBlOiBfZGF0YVR5cGVcblxuICAgICAgICBwYXJhbWV0ZXIgPSBlMmQzLmV4Y2VsLmluaXRBdHRyaWJ1dGUgJ3BhcmFtZXRlcicsIHt9XG5cbiAgICAgICAgQHNlbGVjdGVkQ29sb3JzID0gcGFyYW1ldGVyLmNvbG9ycyA/IEB0aGVtZXNbMF0uY29sb3JzXG5cbiAgICAgIGNyZWF0ZUZyYW1lOiAoKSAtPlxuICAgICAgICAjIFJlZmVyIGZyb20gY2hpbGQgZnJhbWVcbiAgICAgICAgIyBJdCBuZWVkcyBFeGNlbCBBUEkgaW5pdGlhbGl6ZWRcbiAgICAgICAgd2luZG93LnN0b3JhZ2UgPSAoa2V5LCB2YWx1ZSkgPT5cbiAgICAgICAgICBwYXJhbWV0ZXIgPSBlMmQzLmV4Y2VsLmdldEF0dHJpYnV0ZSAncGFyYW1ldGVyJ1xuICAgICAgICAgIGlmIHZhbHVlP1xuICAgICAgICAgICAgcGFyYW1ldGVyW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgZTJkMy5leGNlbC5zdG9yZUF0dHJpYnV0ZSAncGFyYW1ldGVyJywgcGFyYW1ldGVyXG4gICAgICAgICAgICBAc3RvcmFnZUNoYW5nZWQga2V5LCB2YWx1ZVxuICAgICAgICAgIHBhcmFtZXRlcltrZXldXG5cbiAgICAgICAgQGZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnaWZyYW1lJ1xuICAgICAgICBAZnJhbWUuc3JjID0gJ2ZyYW1lLmh0bWwnXG4gICAgICAgIEBmcmFtZS53aWR0aCA9ICcxMDAlJ1xuICAgICAgICBAZnJhbWUuaGVpZ2h0ID0gJzEwMCUnXG4gICAgICAgIEBmcmFtZS5mcmFtZUJvcmRlciA9IDBcbiAgICAgICAgQGZyYW1lLnNldEF0dHJpYnV0ZSAnZGF0YS1iYXNlLXVybCcsIEBiYXNlVXJsXG4gICAgICAgIEBmcmFtZS5zZXRBdHRyaWJ1dGUgJ2RhdGEtc2NyaXB0LXR5cGUnLCBfc2NyaXB0VHlwZVxuICAgICAgICBAZnJhbWUuc2V0QXR0cmlidXRlICdkYXRhLWRhdGEtdHlwZScsIF9kYXRhVHlwZVxuXG4gICAgICAgIEAkZWxzLmZyYW1lLmFwcGVuZENoaWxkIEBmcmFtZVxuXG4gICAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAgICAgY2hlY2tmcmFtZSA9ICgpID0+XG4gICAgICAgICAgICBpZiBAY2hhcnQoKT9cbiAgICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQgY2hlY2tmcmFtZSwgMTAwXG4gICAgICAgICAgY2hlY2tmcmFtZSgpXG5cbiAgICAgIHN0b3JhZ2VDaGFuZ2VkOiAoa2V5LCB2YWx1ZSkgLT5cbiAgICAgICAgaWYga2V5ID09ICdjb2xvcnMnXG4gICAgICAgICAgQHNlbGVjdGVkQ29sb3JzID0gdmFsdWVcblxuICAgICAgY2hhcnQ6ICgpIC0+XG4gICAgICAgIEBmcmFtZT8uY29udGVudFdpbmRvdz8uY2hhcnRcblxuICAgICAgZGVidWc6ICgpIC0+XG4gICAgICAgIEBmcmFtZT8uY29udGVudFdpbmRvdz8uZGVidWdcblxuICAgICAgZmlsbFdpdGhTYW1wbGVEYXRhOiAoKSAtPlxuICAgICAgICBAZmV0Y2hTYW1wbGVEYXRhKClcbiAgICAgICAgICAudGhlbiAoKSA9PlxuICAgICAgICAgICAgQGJpbmRTZWxlY3RlZCgpXG4gICAgICAgICAgLnRoZW4gKCkgPT5cbiAgICAgICAgICAgIEBib3VuZCA9IHRydWVcbiAgICAgICAgICAuY2F0Y2ggKGVycikgPT5cbiAgICAgICAgICAgIEBvbkVycm9yIGVyclxuICAgICAgICAgICAgQGJvdW5kID0gZmFsc2VcblxuICAgICAgcmViaW5kU2VsZWN0ZWRDZWxsczogKCkgLT5cbiAgICAgICAgQGJpbmRTZWxlY3RlZCgpXG4gICAgICAgICAgLnRoZW4gKCkgPT5cbiAgICAgICAgICAgIEBib3VuZCA9IHRydWVcbiAgICAgICAgICAuY2F0Y2ggKGVycikgPT5cbiAgICAgICAgICAgIEBvbkVycm9yIGVyclxuXG4gICAgICBzYXZlSW1hZ2U6ICh0eXBlKSAtPlxuICAgICAgICBlMmQzLnNhdmUgQGNoYXJ0KCkuc2F2ZSgpLm5vZGUoKSwgdHlwZSwgQGJhc2VVcmxcblxuICAgICAgc2hhcmVDaGFydDogKCkgLT5cbiAgICAgICAgQGdldEJvdW5kRGF0YSgpXG4gICAgICAgICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICAgICAgICBwYXJhbWV0ZXIgPSBlMmQzLmV4Y2VsLmdldEF0dHJpYnV0ZSAncGFyYW1ldGVyJ1xuICAgICAgICAgICAgZTJkMy5hcGkudXBsb2FkIF9wYXRoLCBfc2NyaXB0VHlwZSwgcGFyYW1ldGVyLCBkYXRhXG4gICAgICAgICAgLnRoZW4gKHJlc3VsdCkgPT5cbiAgICAgICAgICAgIEBzaG93U2hhcmUgcmVzdWx0LnVybFxuICAgICAgICAgIC5jYXRjaCAoZXJyKSA9PlxuICAgICAgICAgICAgQHNob3dBbGVydCBuYW1lOiAnRXJyb3Igb24gc2hhcmluZycsIG1lc3NhZ2U6IGVyci5zdGF0dXNUZXh0XG5cbiAgICAgIGdvSG9tZTogKCkgLT5cbiAgICAgICAgZTJkMy5leGNlbC5yZW1vdmVBdHRyaWJ1dGUgJ2NoYXJ0J1xuICAgICAgICBlMmQzLmV4Y2VsLnJlbW92ZUF0dHJpYnV0ZSAncGFyYW1ldGVyJ1xuICAgICAgICBAYmluZGluZz8ucmVsZWFzZSgpLmNhdGNoKEBvbkVycm9yKVxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdpbmRleC5odG1sJ1xuXG4gICAgICBmZXRjaE1hbmlmZXN0OiAoKSAtPlxuICAgICAgICBkMy5wcm9taXNlLnlhbWwgXCIje0BiYXNlVXJsfS9tYW5pZmVzdC55bWxcIlxuICAgICAgICAgIC50aGVuIChvYmopID0+XG4gICAgICAgICAgICBAY2FwYWJpbGl0aWVzID0gY2FwYWJpbGl0aWVzLmV4dHJhY3Qgb2JqLmNhcGFiaWxpdGllc1xuICAgICAgICAgIC5jYXRjaCAoZXJyKSA9PlxuICAgICAgICAgICAgQGNhcGFiaWxpdGllcyA9IGNhcGFiaWxpdGllcy5leHRyYWN0IHVuZGVmaW5lZFxuXG4gICAgICBmZXRjaFNhbXBsZURhdGE6ICgpIC0+XG4gICAgICAgIGQzLnByb21pc2UudGV4dCBcIiN7QGJhc2VVcmx9L2RhdGEuI3tfZGF0YVR5cGV9XCJcbiAgICAgICAgICAudGhlbiAodGV4dCkgLT5cbiAgICAgICAgICAgIGUyZDMuZXhjZWwuZmlsbCBfZGF0YVR5cGUsIHRleHRcblxuICAgICAgYmluZFNlbGVjdGVkOiAoKSAtPlxuICAgICAgICBAYmluZCBlMmQzLmV4Y2VsLmJpbmRTZWxlY3RlZCgpXG5cbiAgICAgIGJpbmRTdG9yZWQ6ICgpIC0+XG4gICAgICAgIEBiaW5kIGUyZDMuZXhjZWwuYmluZFN0b3JlZCgpXG5cbiAgICAgIGJpbmQ6IChiaW5kZXIpIC0+XG4gICAgICAgIHVwZGF0ZUJpbmRpbmcgPSAoYmluZGluZykgPT5cbiAgICAgICAgICBAYmluZGluZz8ucmVsZWFzZSgpLmNhdGNoKEBvbkVycm9yKVxuICAgICAgICAgIEBiaW5kaW5nID0gYmluZGluZ1xuICAgICAgICAgIEBiaW5kaW5nLm9uICdjaGFuZ2UnLCByZW5kZXJCaW5kaW5nXG5cbiAgICAgICAgcmVuZGVyQmluZGluZyA9ICgpID0+XG4gICAgICAgICAgQGdldEJvdW5kRGF0YSgpXG4gICAgICAgICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgICAgICAgQGNoYXJ0KCkudXBkYXRlIGRhdGFcbiAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKClcblxuICAgICAgICBiaW5kZXJcbiAgICAgICAgICAudGhlbiAoYmluZGluZykgLT5cbiAgICAgICAgICAgIHVwZGF0ZUJpbmRpbmcoYmluZGluZylcbiAgICAgICAgICAgIHJlbmRlckJpbmRpbmcoKVxuXG4gICAgICBnZXRCb3VuZERhdGE6ICgpIC0+XG4gICAgICAgIGlmIEBiaW5kaW5nP1xuICAgICAgICAgIEBiaW5kaW5nLmZldGNoRGF0YSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoZTJkMy5kYXRhLmVtcHR5KCkpXG5cbiAgICAgIG9uRXJyb3I6IChlcnIpIC0+XG4gICAgICAgIEBzaG93QWxlcnQgaTE4bi5lcnJvciBlcnJcbiAgICAgICAgZTJkMy5vbkVycm9yIGVyclxuXG4gICAgICBzaG93QWxlcnQ6ICh0aXRsZSwgbWVzc2FnZSkgLT5cbiAgICAgICAgQCRyZWZzLmFsZXJ0LnNob3cgdGl0bGUsIG1lc3NhZ2VcblxuICAgICAgc2hvd1NoYXJlOiAodXJsKSAtPlxuICAgICAgICBAJHJlZnMuc2hhcmUuc2hvdyB1cmxcbiJdfQ==
