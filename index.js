
/*
 * config
 */

(function() {
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

  require(['bootstrap', 'jquery', 'vue', 'd3', 'marked', 'e2d3', 'ui/i18n', 'ui/secret'], function(bootstrap, $, Vue, d3, marked, e2d3, i18n, secret) {
    var ref;
    e2d3.restoreChart();
    secret(function() {
      return $('#delegate').show();
    });
    if (e2d3.util.isDelegateMode()) {
      $('#delegate a').html('<i class="fa fa-sign-out"></i> Leave from delegate mode');
      $('#delegate').show();
    }
    $('#delegate').on('click', function(e) {
      e2d3.util.toggleDelegateMode();
      return window.location.reload();
    });
    Vue.config.debug = true;
    return new Vue({
      el: 'body',
      data: {
        selected: (ref = sessionStorage.getItem('selected')) != null ? ref : 'recommended',
        tags: [
          {
            id: 'recommended',
            label: 'Recommended',
            image: 'star'
          }, {
            id: 'statistics',
            label: 'Statistics',
            image: 'balance-scale'
          }, {
            id: 'example',
            label: 'Examples',
            image: 'gavel'
          }, {
            id: 'hackathon',
            label: 'Hackathon',
            image: 'bolt'
          }, {
            id: 'map',
            label: 'Map',
            image: 'map-marker'
          }, {
            id: 'marathon',
            label: 'Marathon',
            image: 'map'
          }, {
            id: 'tbd',
            label: 'To Be Developed',
            image: 'bomb'
          }
        ],
        charts: []
      },
      computed: {
        selectedCharts: function() {
          return this.charts.filter((function(_this) {
            return function(chart) {
              if (_this.selected !== 'uncategorized') {
                return chart.tags.map(function(t) {
                  return t.name;
                }).indexOf(_this.selected) !== -1;
              } else {
                return chart.tags.length === 0;
              }
            };
          })(this)).sort((function(_this) {
            return function(c1, c2) {
              var order;
              if (_this.selected !== 'uncategorized') {
                order = function(chart) {
                  return chart.tags.filter(function(t) {
                    return t.name === _this.selected;
                  })[0].order;
                };
                return order(c1) - order(c2);
              } else {
                return 0;
              }
            };
          })(this));
        }
      },
      components: {
        chart: {
          template: '#chart',
          props: ['chart'],
          data: function() {
            return {
              readme: ''
            };
          },
          computed: {
            baseUrl: function() {
              return e2d3.util.baseUrl(this.chart.path);
            },
            link: function() {
              return "chart.html#" + this.chart.path + "!" + this.chart.scriptType + "!" + this.chart.dataType;
            },
            coverBackground: function() {
              return {
                'background-image': 'url(' + this.baseUrl + '/thumbnail.png' + ')'
              };
            }
          },
          ready: function() {
            return d3.text(this.baseUrl + '/README.md', (function(_this) {
              return function(error, readme) {
                return _this.readme = marked(readme);
              };
            })(this));
          }
        }
      },
      ready: function() {
        return e2d3.api.topcharts().then((function(_this) {
          return function(charts) {
            var hasUncategorized;
            hasUncategorized = charts.some(function(chart) {
              return (chart.tags == null) || chart.tags.length === 0;
            });
            if (hasUncategorized) {
              _this.tags.push({
                id: 'uncategorized',
                label: 'Uncategorized',
                image: 'question'
              });
            }
            return _this.charts = charts;
          };
        })(this));
      },
      methods: {
        select: function(id) {
          this.selected = id;
          return sessionStorage.setItem('selected', id);
        }
      }
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,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Iiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4jIGNvbmZpZ1xuIyMjXG5yZXF1aXJlLmNvbmZpZ1xuICBwYXRoczogRTJEM19ERUZBVUxUX1BBVEhTXG4gIHNoaW06IEUyRDNfREVGQVVMVF9TSElNXG4gIG1hcDogRTJEM19ERUZBVUxUX01BUFxuICBjb25maWc6XG4gICAgdGV4dDpcbiAgICAgIHVzZVhocjogKCkgLT4gdHJ1ZVxuXG5yZXF1aXJlIFsnYm9vdHN0cmFwJywgJ2pxdWVyeScsICd2dWUnLCAnZDMnLCAnbWFya2VkJywgJ2UyZDMnLCAndWkvaTE4bicsICd1aS9zZWNyZXQnXSwgKGJvb3RzdHJhcCwgJCwgVnVlLCBkMywgbWFya2VkLCBlMmQzLCBpMThuLCBzZWNyZXQpIC0+XG5cbiAgZTJkMy5yZXN0b3JlQ2hhcnQoKVxuXG4gIHNlY3JldCAoKSAtPlxuICAgICQoJyNkZWxlZ2F0ZScpLnNob3coKVxuXG4gIGlmIGUyZDMudXRpbC5pc0RlbGVnYXRlTW9kZSgpXG4gICAgJCgnI2RlbGVnYXRlIGEnKS5odG1sKCc8aSBjbGFzcz1cImZhIGZhLXNpZ24tb3V0XCI+PC9pPiBMZWF2ZSBmcm9tIGRlbGVnYXRlIG1vZGUnKVxuICAgICQoJyNkZWxlZ2F0ZScpLnNob3coKVxuXG4gICQoJyNkZWxlZ2F0ZScpLm9uICdjbGljaycsIChlKSAtPlxuICAgIGUyZDMudXRpbC50b2dnbGVEZWxlZ2F0ZU1vZGUoKVxuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICBWdWUuY29uZmlnLmRlYnVnID0gdHJ1ZVxuICBuZXcgVnVlXG4gICAgZWw6ICdib2R5J1xuICAgIGRhdGE6XG4gICAgICBzZWxlY3RlZDogKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0gJ3NlbGVjdGVkJykgPyAncmVjb21tZW5kZWQnXG4gICAgICB0YWdzOiBbXG4gICAgICAgIHsgaWQ6ICdyZWNvbW1lbmRlZCcsIGxhYmVsOiAnUmVjb21tZW5kZWQnLCBpbWFnZTogJ3N0YXInIH0sXG4gICAgICAgIHsgaWQ6ICdzdGF0aXN0aWNzJywgbGFiZWw6ICdTdGF0aXN0aWNzJywgaW1hZ2U6ICdiYWxhbmNlLXNjYWxlJyB9LFxuICAgICAgICB7IGlkOiAnZXhhbXBsZScsIGxhYmVsOiAnRXhhbXBsZXMnLCBpbWFnZTogJ2dhdmVsJyB9LFxuICAgICAgICB7IGlkOiAnaGFja2F0aG9uJywgbGFiZWw6ICdIYWNrYXRob24nLCBpbWFnZTogJ2JvbHQnIH0sXG4gICAgICAgIHsgaWQ6ICdtYXAnLCBsYWJlbDogJ01hcCcsIGltYWdlOiAnbWFwLW1hcmtlcicgfSxcbiAgICAgICAgeyBpZDogJ21hcmF0aG9uJywgbGFiZWw6ICdNYXJhdGhvbicsIGltYWdlOiAnbWFwJyB9LFxuICAgICAgICB7IGlkOiAndGJkJywgbGFiZWw6ICdUbyBCZSBEZXZlbG9wZWQnLCBpbWFnZTogJ2JvbWInIH0sXG4gICAgICBdXG4gICAgICBjaGFydHM6IFtdXG5cbiAgICBjb21wdXRlZDpcbiAgICAgIHNlbGVjdGVkQ2hhcnRzOiAoKSAtPlxuICAgICAgICBAY2hhcnRzXG4gICAgICAgICAgLmZpbHRlciAoY2hhcnQpID0+XG4gICAgICAgICAgICBpZiBAc2VsZWN0ZWQgIT0gJ3VuY2F0ZWdvcml6ZWQnXG4gICAgICAgICAgICAgIGNoYXJ0LnRhZ3MubWFwKCh0KSAtPiB0Lm5hbWUpLmluZGV4T2YoQHNlbGVjdGVkKSAhPSAtMVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBjaGFydC50YWdzLmxlbmd0aCA9PSAwXG4gICAgICAgICAgLnNvcnQgKGMxLCBjMikgPT5cbiAgICAgICAgICAgIGlmIEBzZWxlY3RlZCAhPSAndW5jYXRlZ29yaXplZCdcbiAgICAgICAgICAgICAgb3JkZXIgPSAoY2hhcnQpID0+IGNoYXJ0LnRhZ3MuZmlsdGVyKCh0KSA9PiB0Lm5hbWUgPT0gQHNlbGVjdGVkKVswXS5vcmRlclxuICAgICAgICAgICAgICBvcmRlcihjMSkgLSBvcmRlcihjMilcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgMFxuXG4gICAgY29tcG9uZW50czpcbiAgICAgIGNoYXJ0OlxuICAgICAgICB0ZW1wbGF0ZTogJyNjaGFydCdcbiAgICAgICAgcHJvcHM6IFsnY2hhcnQnXVxuICAgICAgICBkYXRhOiAtPlxuICAgICAgICAgIHJlYWRtZTogJydcbiAgICAgICAgY29tcHV0ZWQ6XG4gICAgICAgICAgYmFzZVVybDogLT4gZTJkMy51dGlsLmJhc2VVcmwoQGNoYXJ0LnBhdGgpXG4gICAgICAgICAgbGluazogLT4gXCJjaGFydC5odG1sIyN7QGNoYXJ0LnBhdGh9ISN7QGNoYXJ0LnNjcmlwdFR5cGV9ISN7QGNoYXJ0LmRhdGFUeXBlfVwiXG4gICAgICAgICAgY292ZXJCYWNrZ3JvdW5kOiAtPiAnYmFja2dyb3VuZC1pbWFnZSc6ICd1cmwoJyArIEBiYXNlVXJsICsgJy90aHVtYm5haWwucG5nJyArICcpJ1xuICAgICAgICByZWFkeTogLT5cbiAgICAgICAgICBkMy50ZXh0IEBiYXNlVXJsICsgJy9SRUFETUUubWQnLCAoZXJyb3IsIHJlYWRtZSkgPT5cbiAgICAgICAgICAgIEByZWFkbWUgPSBtYXJrZWQgcmVhZG1lXG5cbiAgICByZWFkeTogLT5cbiAgICAgIGUyZDMuYXBpLnRvcGNoYXJ0cygpXG4gICAgICAgIC50aGVuIChjaGFydHMpID0+XG4gICAgICAgICAgaGFzVW5jYXRlZ29yaXplZCA9IGNoYXJ0cy5zb21lIChjaGFydCkgLT4gIWNoYXJ0LnRhZ3M/IHx8IGNoYXJ0LnRhZ3MubGVuZ3RoID09IDBcbiAgICAgICAgICBpZiBoYXNVbmNhdGVnb3JpemVkXG4gICAgICAgICAgICBAdGFncy5wdXNoIHsgaWQ6ICd1bmNhdGVnb3JpemVkJywgbGFiZWw6ICdVbmNhdGVnb3JpemVkJywgaW1hZ2U6ICdxdWVzdGlvbicgfVxuICAgICAgICAgIEBjaGFydHMgPSBjaGFydHNcblxuICAgIG1ldGhvZHM6XG4gICAgICBzZWxlY3Q6IChpZCkgLT5cbiAgICAgICAgQHNlbGVjdGVkID0gaWRcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSAnc2VsZWN0ZWQnLCBpZFxuIl19
