---
layout: post
title: 三种算法代码框架以及深度学习核心的引出
date: 2021-02-02 19:20:24.000000000 +09:00
tags: MachineLearning
---

```python
from sklearn.datasets import load_boston
import pandas as pd
import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt

data = load_boston() # type: ignore
# data.keys()
# print(data.keys())
dataframe = pd.DataFrame(data['data'])
dataframe.columns = data['feature_names']
# dataframe.head(5)
dataframe['price'] = data['target']
# dataframe.head(5)
# sns.heatmap(dataframe.corr(), annot=True, fmt='.1f')
# plt.scatter(dataframe["RM"], dataframe["price"])
# plt.show()
x = dataframe['RM']
y = dataframe['price']
history_notes = {_x: _y for _x, _y in zip(x, y)} # type: ignore

########################
## k_Neighbor-Nearest ##
########################


def knn(query_x, history, topn=3):
    sorted_notes = sorted(history_notes.items(),
                          key=lambda x_y: (x_y[0] - query_x) ** 2)
    similar_notes = sorted_notes[:topn]
    similar_ys = [y for _, y in similar_notes]
    return np.mean(similar_ys)


print(knn(6.5, history_notes, 3))

#####################
## Random Approach ##
#####################


def loss(y_hat, y):
    return np.mean((y_hat - y) ** 2)


import random
min_loss = float(1000)
best_k, best_b = None, None

for step in range(1000):
    min_v, max_v = -100, 100
    k, b = random.randrange(min_v, max_v), random.randrange(min_v, max_v)
    y_hats = [k * rm_i + b for rm_i in x] # type: ignore
    current_loss = loss(y_hats, y)

    if current_loss < min_loss:
        min_loss = current_loss
        best_k, best_b = k, b
        print(
            'At Step {}, we get function f(rm) = {} * rm + {}, and the loss now is {}'
            .format(step, k, b, current_loss))

# plt.scatter(x, y)
# plt.scatter(x, [best_k * rm + best_b for rm in x]) # type: ignore
# plt.show()


###################################
## Supervisor Monte Carlo method ##
###################################
def model(x, k, b):
    return x * k + b


def partial_k(k, b, x, y):
    return 2 * np.mean((k * x + b - y) * x)


def partial_b(k, b, x, y):
    return 2 * np.mean(k * x + b - y)


k, b = random.random(), random.random()
min_loss = float('inf')
# best_k, best_b = None, None
learning_rate = 1e-2
total_times = 5000

for step in range(total_times):
    k, b = k + (-1 * partial_k(k, b, x, y) * learning_rate), b + (
        -1 * partial_b(k, b, x, y) * learning_rate)
    y_hats = k * x + b # type:ignore
    current_loss = loss(y_hats, y)

    if current_loss < min_loss:
        min_loss = current_loss
        best_k, best_b = k, b
        print(
            'At Step {}, we get function f(rm) = {} * rm + {}, and the loss now is {}'
            .format(step, k, b, current_loss))

print(model(6, best_k, best_b))

# plt.scatter(x, y)
# plt.scatter(x, [best_k * rm + best_b for rm in x]) # type:ignore
# plt.show() # type:ignore
```


