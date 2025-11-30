setConfig(config: GridieConfig) {
  this._id = config.id;
  this._headers = config.headers;
  this._body = config.body;
  this._originalBody = [...config.body];
  this._filteredBody = [...config.body];
  this._language = config.language || 'es';
  this._lang = getLanguage(this._language);
  this._config = {
    enableSort: config.enableSort ?? true,
    enableFilter: config.enableFilter ?? false,
    enablePagination: config.enablePagination ?? false,
    language: this._language,
  };
  this._sortingManager.clearAll();
  this._filteringManager.clearAll();
  this._selectedOperators.clear();
  this._headerFilterSearchValues.clear(); // ✅ AGREGADO
  this.render();
}

setData(config: { headers: (string | GridieHeaderConfig)[], data: any[] }) {
  this._headers = config.headers;
  this._body = config.data;
  this._originalBody = [...config.data];
  this._filteredBody = [...config.data];
  this._sortingManager.clearAll();
  this._filteringManager.clearAll();
  this._selectedOperators.clear();
  this._headerFilterSearchValues.clear(); // ✅ AGREGADO
  this.render();
}