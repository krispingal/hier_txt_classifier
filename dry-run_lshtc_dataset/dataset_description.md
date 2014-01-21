Dataset description
====================

Dataset Description

The data have been constructed by:

*    crawling Web pages that are found in the ODP and translating them into feature vectors (content vectors).

*    translating into feature vectors the ODP descriptions of Web pages and the categories (Web page and category description vectors).

*    splitting the set of Web pages into a training, a validation and a test set, per ODP category.

Two datasets will be used for the challenge: a large one (12294 categories) and a smaller one (1139 categories). The participants will get the chance to dry-run their classification methods on the smaller dataset. They will then be asked to train and tune their system using the training and validation parts of the larger set, and provide their classification results on the test part.

The directory of each dataset is composed of:

-  cat_hier.txt file.

-  Task1_Train:CrawlData_Test:CrawlData directory.

-  Task2_Train:RDFData_Test:CrawlData directory.

-  Task3_Train:CrawlData+RDFData_Test:CrawlData directory.

-  Task4_Train:CrawlData+RDFData_Test:CrawlData+RDFData directory.

The file cat_hier.txt contains the hierarchy information about the categories of the training set. Each line of this file is a set of ordered integers and corresponds to a branch of the hierarchy from the root to a leaf category. For example, the line:
1 5 8 10 92
correponds to a branch where 1 is the root category and 92 is the leaf category. The parent of category 92 is 10, the parent of category 10 is 8, the parent of 8 is 5, the parent of 5 is 1.

The directory of each Task  is composed of:

-  train.txt file (contains the Web page feature vectors in order to train the system).

-  classDescr.txt file (contains the category feature vectors in order to train the system, only in Tasks containing information from ODP descriptions of Web pages).

-  validation.txt file (contains the Web page feature vectors in order to tune the system).

-  test.txt file (contains the Web page feature vectors in order to test the system).

More information about the above files and for each task can be found here.

The format of each file follows the libSVM format:

-  Each line corresponds to a sparse vector (i.e. a document) and has the following format:

label feat:value ... feat:value \n

label is an integer and corresponds to the category of the vector (each vector corresponds to only one category).

The couple feat:value corresponds to a non-zero feature with index feat and value 'value'. feat is an integer and value is a double that corresponds to the term's frequency. The feat '0' is used for internal indexing and should be ignored by the participants.

For example:
5 0:10 8:1 18:2

corresponds to a vector whose features are all zeros except feature number 8 (with value 1) and feature number 18(with value 2). This vector belongs to category 5. Each feature number is associated to a stemmed word. The mapping between the integers and the stemmed words is different in each task. Therefore, the models trained on the training set of one task cannot be used on the test set of another.
The label of the test vectors that belong to the large dataset is set to 0, in order to prevent the participants from knowing the true category of the vectors.