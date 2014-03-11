Hierarchical Text Classification
===============================
About
------------
This is our undergraduate final year project, Hierarchical Text Classification. The team members/contributors are 
*  Krishna Pingal B (me)
*  [Bosco Frank Paul] (https://github.com/boscofp)
*  John C F and 
*  Binu T Babu.


Our motivation for this came from lshtc(large scale hierarchical text classification) contests, so eventhough lshtc require in-depth knowledge of various machine learning algorithms, optimizations and a lot of mathematics. We figured we would be able to do Hierarchical Text Classification by leaving optimization and methods which are particularly targetting large input size.
Hierarchical text classification when done properly would allow humans to navigate through tons of data (text files) withought us being overwhelmed.

We are basing our work on a paper An Optimized K-Nearest Neighbor Algorithm
for Large Scale Hierarchical Text Classification:
Xiaogang Han , Junfa Liu , Zhiqi Shen , and Chunyan Miao
  

Disclaimer: To avoid future editing,everything will be written in past/present tense.

Development
-----------

## GIT
The preferred way to contribute to this repository is to fork the repository

1. Fork the project reository: click on the 'Fork' button near the top of the page. This creates a copy of the current image of the code under your account on the github server.

2. Clone this copy to your local disk:

           $ git clone https://github.com/krispingal/hier_txt_classifier</code>

3. Create a branch to hold your changes:

           $ git checkout -b my-feature

   and start making changes. Never work in the `master` branch

4. Work on this copy on your computer using Git to do the version control. When you are done editing do:

           $ git add modified_files
           $ git commit

   to record your changes in Git to your github account do:

           $ git push orign my-feature

Finally, go to the webpage of the forked repository in your account and click Pull Request to send your changes to the maintainers for review. This will send an email to the committers.

Disclaimer: This readme is based on the documentation of scikit-learn, which maintains a very good documentation.

Workflow
===========

We are using dataset provided by [lshtc] (http://lshtc.iit.demokritos.gr/) for their first competition, we will be working with their dry run dataset
which is a smaller compared to the actual one they use in the competition. In this dataset every document is represented as a feature vector, with features not occuring omitted. We are using slightly modified k nearest neighbour algorithm to classify the documents. Initially we used k in each hierarchical level to be <span style="white-space: nowrap; font-size: larger">
&radic;<span style="text-decoration:overline;">&nbsp;n/2 &nbsp;</span>. 

In the current model we are using validation to find the value of the parameter _k_ , since we are already given different validation sets apart from training set there is no need to use cross validation.

Lastly we are using PCA to reduce the number of dimensions within levels. Within each level there would be few dimensions which would not contribute to the classification and hence they are removed.

K Nearest Neighbour Algorithm
----------------------------

This is one of the simplest and most intuitive Machine Learning algorithms there is for classification. The rationale is as follows:-
 When a test data point is given we try to imagine the "smallest" hyper-sphere centered at this test point such that it includes the nearest _k_ training data points. Now we conduct a majority vote and our target point is assigned the class which majority of the included trainining points belong to.

To avoid a no-decision situation due to an equi-partition of votes we keep _k_ odd when no. of classes is even and even otherwise.
