'use strict';

let Oembed = require('./oembed');

class Ranker extends Oembed {
    static initClass() {
        this.prototype.className = "Ranker";
        this.Endpoint = "http://widget.ranker.com/oembed";
    }

    swap() {
      let matcher = /\/(\d+)/;
      let id = matcher.exec(this.href)[1];

      return this.$.ajax({
          url         : `${this.adapter.Endpoint}/${id}`,
          type        : 'GET',
          dataType    : 'json',
          data        :  _.extend(this.queryParams),

          success: (data, textStatus, jqXHR) => {
              this.embedData(data);
              super.swap();
          },

          error: (jqXHR, textStatus, errorThrown) => {
              // return console.log('[portable-hole oembed] error.', jqXHR);
              super.swap();
          }
      });
  }
};
Ranker.initClass();
module.exports = Ranker;
