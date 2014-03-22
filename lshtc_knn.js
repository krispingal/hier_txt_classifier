function get_leaf_cats(cat_id) {
  //return db.lshtc_cats.find({"ancestors": cat_id}, {"_id": 1}).map(function(x) {return x._id});
  /*
   * { _id: <cat_id>, children: [<cat_id>, <cat_id>, ...]}
   * for all cat_ids (including roots, internal nodes and leaves)
   * eg.:
   *   { _id: 1, [2, 10] }
   *   { _id: 2, [3, 5] }
   *   { _id: 3, [ ] }
   *   { _id: 5, [ ] }
   *   { _id: 10, [ ] }
   * here, 3, 5 and 10 are leaves, obviously
   * For "lshtc_cats" structured in this manner, the following code returns the leaf descendants:
   */
  var branched = db.lshtc_cats.findOne({"_id": cat_id}).children, leaves = [];
  while (branched.length > 0) {
    var results = db.runCommand({
      mapReduce: "lshtc_cats",
      map: function() {
        if (this.children.length > 0)
          emit("branched", {"cat_ids": this.children});
        else
          emit("leaves", {"cat_ids": [this._id]});
      },
      reduce: function(key, values) {
        return {cat_ids: Array.prototype.concat.apply(values[0].cat_ids, values.slice(1).map(function(x){ return x.cat_ids; }))};
      },
      query: {"_id": {$in: branched}}, 
      out: {inline: 1}
    }).results;
    branched = [];
    for (var i=0; i<results.length; i++) {
      var red = results[i];
      if (red._id == "branched")
        Array.prototype.push.apply(branched, red.value.cat_ids);
      else if (red._id == "leaves")
        Array.prototype.push.apply(leaves, red.value.cat_ids);
    }
  }
  return leaves;
}

function get_idf(feat_id, leaf_cats) {
  var n, nt;
  if (leaf_cats == null) {
    n = db.lshtc_task1.count();
    nt = db.lshtc_task1.count({"features.feat_id":feat_id});
  } else {
    if (leaf_cats.length == 0)
      return NaN; // (check using "isNaN")
    n = db.lshtc_task1.count({"cat_id": {$in: leaf_cats}});
    nt = db.lshtc_task1.count({"features.feat_id":feat_id, "cat_id": {$in: leaf_cats}});
  }
  return Math.log(n/nt); // if nt=0, this will return Infinity (check using "isFinite")
}

function process_doc_for_mapreduce(doc, leaf_cats) {
  var features = doc.features;
  var processed = {};
  features.forEach(function(f) {
    var idf = get_idf(f.feat_id, leaf_cats);
    if (idf == 0 || !isFinite(idf))
      return;
    processed[f.feat_id] = {"log_tf1": Math.log(f.freq+1), "idf": idf};
  });
  var doc_mod = 0;
  for (f in processed) {
    var w = processed[f].log_tf1 * processed[f].idf;
    doc_mod += w*w;
  };
  processed.mod = Math.sqrt(doc_mod);
  return processed;
}

function compute_cossim(doc, cat_id) {
  var leaf_cats, processed_doc, filter = {};
  if (cat_id == null) cat_id = 0;
  if (cat_id != 0) {
    leaf_cats = get_leaf_cats(cat_id);
    if (leaf_cats.length == 0) return -1;
    filter.cat_id = {$in: leaf_cats};
  }
  var processed_doc = process_doc_for_mapreduce(doc, leaf_cats)
  var scope = {"processed_doc": processed_doc},
    out = "mapReduce"+(new Date()).getTime();
  //db[out].ensureIndex({cossim: -1});
  db.runCommand({
    mapReduce: "lshtc_task1",
    map: function() {
      var key = this._id, value = {"cat_id": this.cat_id, "cossim": 0};
      var mod_this = 0;
      for (var i=0; i<this.features.length; i++) {
        var fi = this.features[i];
        if (processed_doc.hasOwnProperty(fi.feat_id)) {
          var w_target = processed_doc[fi.feat_id].log_tf1 * processed_doc[fi.feat_id].idf,
            w_this = Math.log(fi.freq+1) * processed_doc[fi.feat_id].idf;
          value.cossim += w_target*w_this;
          mod_this += w_this*w_this;
        }
      };
      mod_this = Math.sqrt(mod_this);
      value.cossim /= mod_this * processed_doc.mod;
      emit(key, value);
    },
    reduce: function(key, values) {
      return values[0];
    },
    out: out,
    query: filter,
    scope: scope
  });
  db.lshtc_cats.findOne({"_id": cat_id}).children.forEach(function(child_cat) {
    var leaves_of_child = get_leaf_cats(child_cat);
    leaves_of_child.forEach(function(leaf) {
      db[out].update({"value.cat_id": leaf}, {$set: {"value.cat_id": child_cat}}, {"multi": true});
    });
  });
  return out;
}

function knn(cossim_collection, cat_id, k) {
  var leaf_cats, filter = {};
  if (cat_id == null) cat_id = 0;
  if (cat_id != 0) {
    leaf_cats = get_leaf_cats(cat_id);
    if (leaf_cats.length == 0) return -1;
    filter.cat_id = {$in: leaf_cats};
  }
  if (k == null)
    k = Math.sqrt(db.lshtc_task1.count(filter)/2);
  print("k: " + k);
  var result = db[cossim_collection].aggregate([
                  { $sort: { "value.cossim": -1 } },
                  { $limit: k },
                  { $group: { _id: "$value.cat_id", total: { $sum: 1 }, c_sum: { $sum: "$value.cossim" }, c2_sum: { $sum: { $multiply: ["$value.cossim", "$value.cossim"] } } } },
                  { $project: { total: 1, c2_sum: 1, c_avg: { $divide: ["$c_sum", "$total"] } } },
                  { $sort: { "c2_sum": -1 } }
               ]).result;
  return result;
}
