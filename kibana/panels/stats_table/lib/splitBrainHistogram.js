/**
 * ELASTICSEARCH CONFIDENTIAL
 * _____________________________
 *
 *  [2014] Elasticsearch Incorporated All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Elasticsearch Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Elasticsearch Incorporated.
 */



define(function (require) {
  'use strict';
  var _ = require('lodash');
  var config = require('config');

  return function ($http, dashboard, persistent_field)  {
    persistent_field = _.isUndefined(persistent_field) ? 'node.ip_port' : persistent_field;
    return function (nodes, to) {
      var body = {
        query: {
          filtered: {
            filter: {
              range: {
                '@timestamp': {
                  from: to+'-10m/m',
                  to: to+'/m'
                }
              }
            }
          }
        },
        facets: { }
      };

      _.each(nodes, function (node) {
        body.facets[node] = {
          date_histogram: {
            key_field: '@timestamp',
            value_field: '@timestamp',
            interval: 'minute'
          },
          facet_filter: {
            bool: {
              must: [
                {
                  term: {}
                },
                {
                  term: { "node.master": true }
                }
              ]
            }
          }
        };
        // ah JavaScript, you're so adorable.
        body.facets[node].facet_filter.bool.must[0].term[persistent_field] = node;
      });

      var url = config.elasticsearch+'/'+dashboard.indices.join(',')+'/node_stats/_search?search_type=count';
      return $http.post(url, body).then(function (resp) {
        return resp.data;
      });

    };
  };
});
