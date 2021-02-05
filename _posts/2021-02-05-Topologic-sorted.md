---
layout: post
title: 拓扑排序的代码实现
date: 2021-02-05 19:10:24.000000000 +09:00
tags: MachineLearning
---

```python
# by defining a dictionary, classfying the both inputs (keys) and outputs (values)

from functools import reduce
import random


def topologic(graph):
    '''
    {
        node:[node1, node2, ..., node]


        x: [linear],
        k: [linear],
        b: [linear],
        Linear: [sigmoid],
        sigmoid: [loss],
        y: [linear],
    }
    '''

    sorted_node = []

    while graph:
        # n = graph.pop(n) # 如何图不是空的，就在图里找一个节点
        # pass # 图为空，结束
        # e.g. simple_graph = {'a': [1, 2], 'b': [2, 3]} # a simple example for graph
        # reduce(lambda a, b: a + b, list(simple_graph.values())) #通过 reduce 函数将列表加起来

        all_nodes_have_inputs = reduce(lambda a, b: a + b,
                                       list(graph.values()))

        all_nodes_have_outputs = list(graph.keys())

        # There is the example to help understand how to get #all_nodes_only_have_inputs#
        # list_a = [1, 2, 3]
        # list_b = [2, 3, 4]
        # # Using Set to process this problem, there are some operations for sets, e.g.
        # set(list_a) | set(list_b) # 取并集
        # set(list_a) & set(list_b) # 取交集
        # set(list_a) - set(list_b) # Only in a, not in b

        all_nodes_only_have_outputs_no_inputs = set(
            all_nodes_have_outputs) - set(all_nodes_have_inputs)

        # If have found only outputs nodes, not inputs, in another word, found the node at the edge, randomly pick one, and pop it from graph to sorted_node
        if all_nodes_only_have_outputs_no_inputs:
            node = random.choice(list(all_nodes_only_have_outputs_no_inputs))
            graph.pop(node)
            sorted_node.append(node)
            # 遍历 graph, delete the links about the sorted_node
            for _, links in graph.items():
                if node in links: links.remove(node)
        else:
            raise TypeError(
                "This Graph has circle, can't adopt topological order")
    return sorted_node


x, k, b, linear, sigmoid, y, loss = 'x', 'k', 'b', 'linear', 'sigmoid', 'y', 'loss'

test_graph = {
    x: [linear],
    k: [linear],
    b: [linear],
    linear: [sigmoid],
    sigmoid: [loss],
    y: [loss],
}

print(topologic(test_graph))
```
