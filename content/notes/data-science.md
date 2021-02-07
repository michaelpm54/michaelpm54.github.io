Title: Data science
Date: 2021-02-07
Category: Notes

Querying data via URL parameters and getting it as JSON.

Machine learning terms:

Training data is a set of observations.

Observation  
Observation  
Observation  
Observation  

In other words an observation is a row.

Inputs are features, outputs are targets.

Our hypothesis function takes in the features of observations and comes close to predicting their target.

training:
`GradientDescent(Cost(Hyp(Linear(w0, w1, bias)))`

prediction:
`Hyp(Linear(w0, w1, bias))`

# The Elements of Statistical Learning
## Data Mining, Inference, and Prediction

*Supervised* learning is based on labeled data and training data. *Unsupervised* is when an algorithm tries to extract features and information on its own.

In supervised, outcome guides the learning process.

The goal is to build a *prediction model*, also called *learner*, to accurately predict the outcome from unseen observations. I don't yet know what learner refers to.

It seems that the goal of unsupervised learning is less so to predict an outcome, but more to cluster and describe data, which is similar but I think slightly different.

An example of email classification [spam,email] is given where each word is its own feature. Example:

- George 1.5  
- You 2.0  
- Remove 0.2  
- Free 0.3  

In the example of spam email filtering, you would prefer to let some spam emails through than risk filtering out legitimate emails. The solution to this kind of problem will be presented later in the book.

The other type of outcome (other than classification) is quantitative, i.e. it predicts a number.

It's possible to assign a prediction of "don't know" to allow further classification by hand.

Some interchangeable terms:

In statistical literature, inputs and predictors.  
In pattern recognition, features.  

Outputs are called responses.

Types of prediction:

quantitative: regression  
qualitative: classification  

Inputs can also vary in type which can lead to different optimal prediction methods.

A third type of variable is *ordered categorical* where there is an ordering between the values but the proximity is irrelevant. For example [small, medium, large]. The proximity of large to medium doesn't indicate anything concrete, in relation to small and medium.