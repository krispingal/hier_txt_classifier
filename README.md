Hierarchical Text Classification
===============================
About
------------
This is our undergraduate final year project, Hierarchical Text Classification. The team members/contributors are 
*  Krishna Pingal B (me)
*  [Bosco Frank Paul] (https://github.com/boscofp)
*  [John C F] (https://github.com/critechar) and 
*  Binu T Babu.


Our motivation for this came from lshtc(large scale hierarchical text classification) contests, so eventhough lshtc require in-depth knowledge of various machine learning algorithms, optimizations and a lot of mathematics. We figured we would be able to do Hierarchical Text Classification by leaving optimization and methods which are particularly targetting large input size.
Hierarchical text classification when done properly would allow humans to navigate through tons of data (text files) withought us being overwhelmed.

We are basing our work on a paper An Optimized K-Nearest Neighbor Algorithm
for Large Scale Hierarchical Text Classification:
Xiaogang Han , Junfa Liu , Zhiqi Shen , and Chunyan Miao
  

Disclaimer: To avoid future editing, everything will be written in past/present tense.

Development
-----------

## GIT
The preferred way to contribute to this repository is to fork the repository

1. Fork the project reository: click on the 'Fork' button near the top of the page. This creates a copy of the current image of the code under your account on the github server.

2. Clone this copy to your local disk:

        $ git clone https://github.com/krispingal/hier_txt_classifier

3. Create a branch to hold your changes:

        $ git checkout -b my-feature

   and start making changes. Never work in the `master` branch

4. Work on this copy on your computer using Git to do the version control. When you are done editing do:

        $ git add modified_files
        $ git commit

   to record your changes in Git to your github account do:

        $ git push orign my-feature

Finally, go to the webpage of the forked repository in your account and click Pull Request to send your changes to the maintainers for review. This will send an email to the committers.

## MongoDB
A MongoDB database consists of several "collection"s (analogous to a table)
A "collection" consists of several "document"s (analogous to a row)
A "document" is a list of "key":"value" pairs (a key is analogous to a column)
"Key" is always a string.
"Value" can be a boolean, number, string, document (yes!), or an array of those types!
An typical document looks like this:

	{ "_id": 2983,
	  "name": "John",
	  "date_of_birth": {"year":1992, "month": 11, "day": 24}, 
	  "purchase_history": [
	    {"item": "Pencil", "price": 10, "timestamp": 23482473},
	    {"item": "Eraser", "price": 8, "timestamp": 23412321}
	  ]
	}

To know more about MongoDB, visit: http://docs.mongodb.org/manual/crud/

Compiling and Running
---------------------
The following libraries are required to run the C code files:
* https://github.com/mongodb/libbson
* https://github.com/mongodb/mongo-c-driver

Compiling:

	gcc lshtc2json.c -o lshtc2json
	gcc lshtc_cats2json.c -o lshtc_cats2json
	gcc json2mongo.c -o json2mongo $(pkg-config --libs --cflags libmongoc-1.0)

Start the mongo server

	$ mongod --dbpath=/some/dir/ --logpath=some/file

read a libsvm formatted document and convert to json format

	$ ./lshtc2json lshtc_dataset/Task1_Train\:CrawlData_Test\:CrawlData/train.txt > lshtc1_train.json

read a json formatted document and put it into database (database name is hardcoded, collection name is the first command line argument)

	$ ./json2mongo lshtc_task1 lshtc1_train.json

read the lshtc cat_heir.txt and convert to json format

	$ ./lshtc_cats2json lshtc_dataset/cat_hier.txt > lshtc_cat_heir.json
	$ ./json2mongo lshtc_cats_init lshtc_cat_heir.json

Start the mongo client

	$ mongo

Run the following commands to make some final touches to the database

	> show dbs         # list databases
	> use htc          # switch to database 'htc'
	> load("lshtc_init.js")

Testing:

	> db.getCollectionNames()
	> db.lshtc_task1.count({"features.feat_id": 839458})         # get the number of documents containing feat_id '839458'
	> db.lshtc_task1.findOne()
	> db.lshtc_cats_init.count({"ancestors.0": 1})
	> db.lshtc_cats.findOne()

Classifying
-----------
Start the mongo server and load the test dataset into the db:

	$ ./lshtc2json lshtc_dataset/Task1_Train\:CrawlData_Test\:CrawlData/test.txt > lshtc1_test.json
	$ ./json2mongo lshtc_test1 lshtc1_test.json

Start the mongo client and:

	> load("lshtc_knn.js")
	true
	> var out, cat_id=0
	> var doc=db.lshtc_test1.findOne()
	> out=compute_cossim(doc, cat_id)
	mapReduce1395390365812
	> knn(out, cat_id)
	k: 47.23875527572673
	[
		{
			"_id" : 1,
			"total" : 27,
			"c2_sum" : 3.3731694953635945,
			"c_avg" : 0.3462507215492252
		},
		{
			"_id" : 22639,
			"total" : 4,
			"c2_sum" : 0.41033324462350407,
			"c_avg" : 0.318781542036322
		},
		{
			"_id" : 41212,
			"total" : 4,
			"c2_sum" : 0.39882385043730106,
			"c_avg" : 0.31546754218093637
		},
		...
	]
	> cat_id=1
	> out=compute_cossim(doc, cat_id)
	mapReduce1395391159844
	> knn(out, cat_id)
	k: 20.024984394500787
	[
		{
			"_id" : 2,
			"total" : 7,
			"c2_sum" : 1.138873490235482,
			"c_avg" : 0.38851140580335003
		},
		{
			"_id" : 3261,
			"total" : 6,
			"c2_sum" : 0.8659020449130634,
			"c_avg" : 0.37734207578694506
		},
		{
			"_id" : 11131,
			"total" : 3,
			"c2_sum" : 0.4295867396261398,
			"c_avg" : 0.3753356137719844
		},
		...
	]
	> cat_id=2
	> out=compute_cossim(doc, cat_id)
	mapReduce1395391252682
	k: 3.605551275463989
	[
		{
			"_id" : 3,
			"total" : 1,
			"c2_sum" : 0.4569582935197736,
			"c_avg" : 0.6759869033640915
		},
		{
			"_id" : 577,
			"total" : 2,
			"c2_sum" : 0.36755177193145644,
			"c_avg" : 0.4286188254043739
		}
	]
	> cat_id=3
	> out=compute_cossim(doc, cat_id)
	mapReduce1395392140461
	> knn(out, cat_id)
	k: 3.24037034920393
	[
		{
			"_id" : 20,
			"total" : 3,
			"c2_sum" : 0.8595426913788144,
			"c_avg" : 0.5174953004609085
		}
	]
	> knn(out, cat_id)
	k: 2.1213203435596424
	[
		{
			"_id" : 141923,
			"total" : 1,
			"c2_sum" : 0.49083146351922957,
			"c_avg" : 0.7005936507842685
		},
		{
			"_id" : 29,
			"total" : 1,
			"c2_sum" : 0.1817827677586174,
			"c_avg" : 0.4263599040231356
		}
	]
	> doc.cat_id
	29

So the document is classified into category 141923, though its original category is 29 (missed at the last level of classification)
