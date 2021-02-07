Title: Barycentric coordinates
Date: 2021-02-07
Category: Notes

<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css"
      crossorigin="anonymous">

The point of barycentric coordinates is to be able to express a point in the affine plane in terms of other points.

![]({static}/images/barycentric.png)

$K \leftrightarrow  ({2 \over 11}, {3 \over 11}, {6 \over 11})$

This triple of numbers are barycentric coordinates.

Can be thought of as centre of mass.

<img src="{static}/images/barycentric2.png" height="250" />

The point C can be thought of as the weighting from A to B.
It is closer to A because it is weighted more heavily in favour of A.

Read the first and second lines of the Ex. carefully.

---

The $(1-\lambda)A + \lambda B$ notation comes from the fact that you want a point at $\lambda$ on the curve/line.

Take for example $1 \over 3$. It's closer to the start than the end, as it's only $1 \over 3$ in. It's $1 \over 3$ away from 0. On the other hand, it's $2 \over 3$ away from 1.

Given a vector $\bar{AB}$, the point $\lambda$ is at $A + \lambda \bar{AB}$ on the vector. In other words, start from $A$ and go along the vector $\lambda$ times its original length.
$$
\lambda = 0 \\
A + 0\bar{AB} = A
$$

$$
\lambda = 1 \\
A + 1\bar{AB} = A + \bar{AB}
$$

If you're walking along the vector by $\lambda$, to get to $\bar{AB}$ you must walk an additional length of $1 - \lambda$, whether it be positive or negative (if you walk too far initially, in the case that \lambda is >1).

So the remaining part segment of $\bar{AB}$ is $(1 - \lambda) \bar{AB}$.

The entire length of $\bar{AB}$ is:
$$
\lambda \bar{AB} + (1 - \lambda) \bar{AB}
$$

---

Worked example:

$$
A = (0.2, 1.0) \\
B = (1.0, 1.5)
$$

![]({static}/images/barycentric3.png)

$$
\lambda = 0.25 \\
\bar{AB} = (1 - 0.2, 1.5 - 1) \\
\bar{AB} = (0.8, 0.5) \\
\lambda \bar{AB} = A + 0.25 (0.8, 0.5) \\
\lambda \bar{AB} = A + (0.2, 0.125) \\
\lambda \bar{AB} = (0.2, 1.0) + (0.2, 0.125) \\
\lambda \bar{AB} = (0.4, 1.125) \\
$$

![]({static}/images/barycentric4.png)
