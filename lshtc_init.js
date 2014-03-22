// Be sure to use htc!

print("Ensuring lshtc_task1 'features.feat_id' index...");
db.lshtc_task1.ensureIndex( { "features.feat_id": 1 } ); // create an index to optimise searching

print("Creating lshtc_cats...");
var root_cats = db.lshtc_cats_init.distinct("dfs.0");
db.lshtc_cats.save({"_id": 0, "children": root_cats});
var cats_info = root_cats.map(function(cat){ return [cat, 0]; });
while (cats_info.length > 0) {
  var cat_info = cats_info.shift();
  var cat = cat_info[0], level = cat_info[1] + 1;
  var children = db.lshtc_cats_init.distinct("dfs."+level, {"dfs": cat})
  if (children.length > 0) {
    children.forEach(function(x) {
      db.lshtc_cats.update({"_id": cat}, {$addToSet: {"children": x}}, {upsert: true});
      cats_info.push([x, level]);
    });
  } else db.lshtc_cats.update({"_id": cat}, {$set: {"children": [ ]}}, {upsert: true});
}

//print("Ensuring lshtc_cats 'children' index...");
//db.lshtc_cats.ensureIndex( { "children": 1 } );

print("Done!\n");
