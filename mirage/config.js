const includesCaseInsensitive = (haystack, needle) => {
  haystack = (haystack || '').toLowerCase();
  needle = (needle || '').toLowerCase();
  return haystack.includes(needle);
};

export default function mirageConfig() {
  this.post('/users');
  this.post('/oauth/token', () => {
    return {
      access_token: 'fake_access_token',
      token_type: 'bearer',
      expires_in: 7200,
      created_at: 1531855327,
    };
  });

  this.get('/todos', (schema, request) => {
    const searchText = request.queryParams['filter[search]'];
    if (searchText) {
      return schema.todos.where(todo =>
        includesCaseInsensitive(todo.name, searchText),
      );
    } else {
      return schema.todos.all();
    }
  });
  this.post('/todos');
  this.get('/todos/:id');
  this.patch('/todos/:id');

  this.get('/categories');
  this.get('/categories/:id');
  this.post('/categories');
  this.patch('/categories/:id');
  this.delete('/categories/:id');

  // These comments are here to help you get started. Feel free to delete them.
  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */
  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing
  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  */
}
