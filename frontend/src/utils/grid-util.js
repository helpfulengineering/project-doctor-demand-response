let GridUtil = {
    transformGridParams: function(params) {
        let sort = {};
        if(params.sortModel.length > 0) {
          sort[params.sortModel[0].colId] = params.sortModel[0].sort === 'asc' ? 1 : -1;
        }

        let keys = Object.keys(params.filterModel);
        let filter = {};
        if(keys.length > 0) {
            
            filter.field_name = keys[0];
            filter.filter_text = params.filterModel[keys[0]].filter;
        }
        let search = {
          "sort": sort,
          "startRow": params.startRow,
          "endRow": params.endRow,
          "filter": filter
        };

        return search;
    }
}

export default GridUtil;