'use strict';

const Oembed = require('./oembed');

class Ranker extends Oembed {
  swap() {
    let matcher = /\/(\d+)/;
    let id = matcher.exec(this.href)[1];

    return this.$.ajax({
      url: `${this.adapter.Endpoint}/${id}`,
      type: 'GET',
      dataType: 'json',
      data: _.extend(this.queryParams),

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

Ranker.prototype.className = "Ranker";
Ranker.Endpoint = "https://widget.ranker.com/oembed";

module.exports = Ranker;