Title: Perspective projection
Date: 2021-02-07
Category: Notes

<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css"
      crossorigin="anonymous">

Aspect ratio scaling
---
The clipping plane ranges from -1 to 1, in both the x and y axes.  
To place a point into clip space we must place it into this range. This is done via the projection matrix.

The first thing to think about is how to scale the x and y of the point such that they are transformed equally. This doesn't matter yet, but it matters once it gets to screen space. If the width of the screen is greater than the height, things will be distorted.

To work around this, we multiply by the ratio of height to width, also known as the aspect ratio.

![media-NShPhN]({static}/images/media/media-NShPhN-326244303.tex)

Field of view scaling
---
Next, we want to scale the point by the field of view. If the FOV increases, the object shrinks so more objects can fit in and vice versa.

How we define the FOV factor is similar to the aspect ratio, except for a triangular volume rather than rectangular. What this means is that the ratio we use is that of the eye direction vector to the far plane. If we take the eye vector to be the adjacent and the far plane to be the opposite, it makes sense to use the tangent ratio.

The angle given to tan() will be defined by us. Normally it's between 30 and 90. It will be divided by 2 to get a line that goes straight through the centre of the field of view, which will serve as the adjacent.

In this example, the angle for the FOV is 45.

![media-ldBAkJ]({static}/images/media/media-ldBAkJ-1243425391.tex)

Consider what happens when we multiply our point by this ratio.

![media-TMrKuU]({static}/images/media/media-TMrKuU-1562425882.tex)  
![media-AutBkw]({static}/images/media/media-AutBkw-755129655.gif)  
![media-kCGCav]({static}/images/media/media-kCGCav-830416635.gif)

Now imagine we increase our field of view. The object should get smaller.

![media-bEaPKN]({static}/images/media/media-bEaPKN-1226970134.gif)  
![media-YMcoDp]({static}/images/media/media-YMcoDp-1623837701.gif)


This had the opposite effect. When we make objects bigger, or in real terms "increase the value of their coordinates", it results in less objects being able to fit into the field of view.

Thus, we take the inverse of the ratio to make things smaller.

![media-Kciocc]{static}/images/media/media-Kciocc-849714020.tex)

When I first saw this I was thinking "how did they know to do that?" but it's really just predicated on what we want to achieve. We define the rules here, and since we want things to shrink we take the inverse.

So at this point, we have two ratios that we concatenate then apply to our coordinates. First, the aspect ratio, then the FOV ratio. The order doesn't really matter as multiplication is commutative.

(h/w)(fov)x

View frustum scaling
---
This ratio scales a point based on where it is in the view frustum.

If you want to normalise a value ![media-zVnyCS]({static}/images/media/media-zVnyCS-608906270.tex)
 to the range of ![media-AyXwrX]({static}/images/media/media-AyXwrX-2053366328.tex)
 and ![media-pOAavh]({static}/images/media/media-pOAavh-938291603.tex)
, you do ![media-ELemnG]({static}/images/media/media-ELemnG-29763031.tex)
.


This can be seen when working with colours. Take the RGB value (255, 0, 0), which is red. Let's just look at the red component. OpenGL uses colour values between 0.0 and 1.0, so to put red into the correct range the formula is ![media-JjTABB](media/media-JjTABB-24709558.tex).

Now, on to how this relates. We have a near plane and a far plane that define our view frustum, as well as an angle.

Here are the values we will use for the distance from our eye.

![media-AJrYWO]({static}/images/media/media-AJrYWO-170814809.tex)  
![media-sKrUqK]({static}/images/media/media-sKrUqK-1211924406.tex)

The reason the near plane should be more than 0 is slightly complicated but boiled down, it avoids potential divides by 0 and the depth precision is better when working in a specific range, a sweet spot of near and far values, due to an optimisation that graphics APIs tend to use when dealing with the view frustum.

Okay, so to scale a point ![media-RInyDI]({static}/images/media/media-RInyDI-901650133.tex)
 inside the frustum the formula is ![media-pvpakC]({static}/images/media/media-pvpakC-1200974099.tex)
.

Depth scaling
---

The next part is to scale each coordinate based on its distance from the camera.

This is done by taking z to be the distance. Remember that OpenGL uses a right-handed coordinate system, meaning positive z values go towards the camera and negative z values go into the far horizon, away from the camera.

Of course, this only applies if we are looking into the negative z axis which we are by default.  If we are looking down a different axis, we are necessarily using a view matrix defined by, for example, glm::lookAt, but really it's just the inverse of the camera position and orientation. In this case the z axis will be modified but the depth scaling still works transparently.

So the way it is done is by normalising the z coordinate into view space. This means taking a z axis and putting it between 0 and 1 where 0 corresponds to znear and 1 corresponds to zfar.

## The z divide

There is actually something more trigonometrically fundamental to the z divide other than to scale the target coordinate by the distance from the camera.

Imagine a point at (0, 10, -30). Now imagine the right-triangle it makes to the camera. Scaling by z creates a smaller but proportionally equivalent triangle.

![qownnotes-media-NuQTVb]({static}/images/media/qownnotes-media-NuQTVb-880.png)

Thus, to place a point onto the 

### Z

Recall that the negative z axis extends away from the camera. We need to invert the z before we scale components by it, otherwise it would be the same as up-scaling them.

# Object space
Essentially centered in the object. Extremely relevant when applying rotations *around* a point on the object, as rotations are of course done relative to the origin of object space.

The set of transformations applied to an object in object space is called the *object transformation matrix*.

> If you wanted to pre-compute the first rotation such that the rotation vector aligns with the z axis, you would have to create a second object space (more on this later).

# World space

### Space station and planet

The example given is of a space station orbiting a planet. The space station first applies its own rotation about itself [object space], then applies a translation about the planet [world space].

World space *can* be thought of as just another object space, where every transformation in the space is relative to the origin of the space. By combining the two spaces of object and world, you are in fact creating a new space.

The new space can be thought of like this. By default, after applying the object transformation matrix, the object now sits at 0 in world space. In a planet (assuming the origin is the center of the planet), the space station would be sitting in the core of the planet. Not good. You need to translate the space such that the origin sits where you want the space station to sit. An interesting note. What you are really doing is creating a transformation. You are creating the transformation which results in a certain space. You are *NOT* moving an object. You are moving the space.

Any object put into this space assumes the space's frame of reference. The space station assumes an origin equal to the space's origin.

To summarise, you create a new object space that sits thousands of metres into the sky, and apply that transformation to the space station.

# Types of affine transformations

## Translation

$$
\begin{bmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
t_x & t_y & t_z & 1 \\
\end{bmatrix}
$$

$$
[x, y, z, 1]\begin{bmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
t_x & t_y & t_z & 1 \\
\end{bmatrix} \\
=
[1x + 0x + 0x + t_xx, 0y + 1y + 0y + t_yy, 0z + 0z + 1z + t_zz, 0 + 0 + 0 + 1] \\
= [x + t_xx, y + t_yy, z + t_zz, 1]
$$

## Scaling

$$
\begin{bmatrix}
s_x & 0 & 0 & 0 \\
0 & s_y & 0 & 0 \\
0 & 0 & s_z & 0 \\
0 & 0 & 0 & 1 \\
\end{bmatrix} \\
= [s_xx, s_yy, s_zz, 1]
$$

The basis vectors themselves are the things being scaled, which has the desired effect on the point with which the matrix is multiplied.

![]({static}/images/transforms.png)

As shown in the image, scaling transformations move things unless they are around the origin.

A convention is to translate the object so that its centre lies on the origin, scale, then undo the translation.

<img src="{static}/images/transforms2.png" width="600" />

# Rotation matrices

The goal is to calculate a position $P_{1}$ from the combination of a point $P_{0}$ and an angle $\Theta$.

Let $r$ be the length of the vector.

$$
P_{0} = (x_{0}, y_{0}) \\
$$

---

Using SOH CAH TOA,  $x_{0}$ = CAH

$$
{ \cos(\Theta) = {Adj \over Hyp} } \\
$$
Substituting
$$
{ \cos(\Theta) = {x \over r} } \\
$$
Rearranging and simplifying
$$
{ {x r \over r} = r \cos(\Theta) } \\
$$
$$
{ x = r \cos(\Theta) } \\
$$

---

And $y_{0}$ = SOH

$$
{ \sin(\Theta) = {Opp \over Hyp} } \\
$$
Substituting
$$
{ \sin(\Theta) = {y \over r} } \\
$$
Rearranging and simplifying
$$
{ {y r \over r} = r \sin(\Theta) } \\
$$
$$
{ y = r \sin(\Theta) } \\
$$

---

In summary,

$$
P_{0} = (r \cos(\Theta), r \sin(\Theta))
$$

---

Now imagine you want to rotate $P_{0}$ by $\phi$ degrees.  
$P_{0}$ is already at an angle of $\Theta$ degrees so the new angle can be considered to be $\Theta + \Phi$. The length is the same.

We can repeat the process for the new angle.

$$
P_{1} = (r \cos(\Theta + \Phi), r \sin(\Theta + \Phi))
$$

Using an identity (sum and difference) we end up with:

$$
P_{1} = (\cos(\Phi) - \sin(\Phi), \cos(\Phi) + \sin(\Phi))
$$

The reason this is preferable is we don't need to know $\Theta$.

Placed into a matrix it looks as follows:
$$
\begin{bmatrix}
\cos(\Phi) & - \sin(\Phi)\\
\sin(\Phi) & \cos(\Phi) \\
\end{bmatrix}
$$

## Rotation around an arbitrary axis

The strategy for this is as follows:

- Translate the point to the origin
- Transform the axis such that it aligns with a standard axis
- Rotate
- Undo the translation
- Undo the axis transformation

# Coordinate systems
## Cartesian
<x, y>

## Polar
<r, angle>

From cartesian to polar:

r = sqrt(x^2 + y^2)
angle = tan^-1(y / x)

## Spherical

# Resources
- https://www.youtube.com/watch?v=ih20l3pJoeU
- http://learnwebgl.brown37.net/08_projections/projections_perspective.html
- Book: Mathematics for Game Developers
- [Rotations](Rotation.md)
- [YouTube - Moving objects in space](https://www.youtube.com/watch?v=wArGifkRD2A&list=PL_w_qWAQZtAZhtzPI5pkAtcUVgmzdAP8g&index=3)
- [OpenGL Tutorial 17 - Rotations](http://www.opengl-tutorial.org/)

