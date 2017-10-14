import xhr from 'xhr';

class Api {
  constructor(url, context) {
    this.url = url;
    this.context = context;
    this.request = this.request.bind(this);
  }

  get(endpoint, callback) {
    this.request(xhr.get, endpoint, callback);
  }

  post(endpoint, body, callback) {
    this.request(xhr.post, endpoint, callback, body);
  }

  request(requestFn, endpoint, callback, body) {
    var options = {json: true};
    if (typeof body !== "undefined")
    {
      options.body = body;
    }
    callback = callback.bind(this.context);
    requestFn(this.url + endpoint,
      options,
      function(err, resp) {
        if (err) {
          console.error(err);
        }
        else {
          callback(resp);
        }
      });
  }
}

export default Api;