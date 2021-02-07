Title: Euler angles
Date: 2021-02-07
Category: Notes

<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css"
      crossorigin="anonymous">

- Yaw - X axis
- Pitch - Y axis
- Roll - Z axis

the goal is to have a vector that represents a front/facing vector of unit length:
$\hat{v} = (x, y, z)$

We can feed this vector to pointing functions such as `glm::lookAt` or `Quaternion.LookAt` in Unity.

$$
x = |v|\cos(yaw)
$$

In this case, $|v|$ is $1$ so it becomes

$$
x = \cos(yaw)
$$

Similarly looking from above, Z can be thought of as

$$
z = \sin(roll)
$$

And finally

$$
y = \sin(pitch)
$$

But we need to simulate what actually happens, and these formulae alone aren't enough.

What isn't modelled is what happens to $x$ as $pitch$ changes. As your camera points up and up, the pitch increases but the $x$ stays the same, which ultimately affects the end $\hat{v}$.

Imagine the pitch is completely vertical:

$$
pitch = 90° \\
\sin(90°) = 1
$$

Say we have the facing vector $\hat{v} = (0.5, 1, 0)$.  
This isn't actually a valid unit vector because $|(0.5, 1, 0)| \approx 1.12$. 
When modifying the $y$ component, the other two values need to be scaled accordingly.

$$
x = \cos(yaw) \cos(pitch) \\
y = \sin(pitch) \\
z = \sin(yaw) \cos(pitch)
$$

Which would produce $|(0.5, 1, 0)| \approx 1.12$.
