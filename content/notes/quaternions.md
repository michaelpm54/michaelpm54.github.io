Title: Quaternions
Date: 2021-02-07
Category: Notes

<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css"
      crossorigin="anonymous">

- Have four scalar components: 3 imaginary and 1 real.
- Are therefore complex numbers.
- Can be used to represent orientations.
- Are used in animation to interpolate (SLERP: Spherical LERP) between orientations.

In animation, one quaternion keyframe is SLERP'd to another quaternion keyframe, and combined with scaling and position keyframes.

How are they combined?

---

## Rotation

Say we have an axis (1, 0, 0) that we will use for our bearing.  
What would this look like? It would be looking to the right from a global neutral perspective.  
A rotation of 32 degrees around this angle would look like this:

``` C++
float angle = rad(32);

float x = axis.x * sin(angle / 2);
float y = axis.y * sin(angle / 2);
float z = axis.z * sin(angle / 2);
float w = cos(angle / 2);
```

In other words, a quaternion (as defined in the code above) stores both an angle *and* an axis.  
Imagine you have the following quaternion: `[0.7, 0.0, 0.0, 0.7]`.

``` C++
x: 0.7

w: 0.7

Substituting from our above definition:

    float w = cos(angle / 2);

Solving:

    acos(0.7)   = angle / 2
    0.8 rad     = angle / 2
    0.8 rad * 2 = 1.6 rad
    angle = 1.6 rad
    angle = 90 deg
```

## Rotations around an arbitrary axis

$\bar{u} =$ a point or vector  
$\bar{v} =$ a unit vector  
$q$ is made up from $\bar{v}$

$$
\bar{u} = [a, b, c] \\
\bar{v} = [d, e, f]
$$

$$
\bar{u}^{\prime} = q\bar{u}q^{\ast}
$$

The reason you multiply by $q^*$ is because if you just did $q\bar{u}$ you would be rotating out of plane. You're rotating in the fourth dimension.

$
\bar{u} = (0, ai, bj, ck)
$

$
q = (\cos({\Theta \over 2}), d\sin({\Theta \over 2}), e\sin({\Theta \over 2}), f\sin({\Theta \over 2}))
$

The reason you multiply by $\sin({\Theta \over 2})$ is to make sure that $q$ remains a unit quaternion.

#### Example

$$
\bar{v} = [1, 1, 1] \\
\bar{v} = [{1 \over \sqrt{3}}, {1 \over \sqrt{3}}, {1 \over \sqrt{3}}] \\
\Theta = 120 ^\circ \\
Vector/point = [7, 2, 5]
$$

First you need to build the quaternion.  

$$
q = (\cos({\Theta \over 2}), d\sin({\Theta \over 2}), e\sin({\Theta \over 2}), f\sin({\Theta \over 2})) \\
q_0 = \cos({120 \over 2}) = 0.5 \\
q_1 = \sin({120 \over 2}) / (sqrt(3)) = 0.5 \\
q_2 = \sin({120 \over 2}) / (sqrt(3)) = 0.5 \\
q_3 = \sin({120 \over 2}) / (sqrt(3)) = 0.5 \\
q = (0.5, 0.5, 0.5, 0.5)
$$

Get $q^*$, which is $q$ except the complex part is inverted.

$$
q^* = (0.5, -0.5, -0.5, -0.5)
$$

Put $\bar{u}$ into quaternion form.

$$
\bar{u} = (0, 7, 2, 5)
$$

Multiply the quaternions.

---

In GLM, the convention is $[w, x, y, z]$ where $w$ is the real number.

### Usage

``` C++
glm::quat quat1;
quat1 = quat(w, x, y, z);

glm::vec3 euler_angles(90, 45, 0);
quat1 = quat(euler_angles);

quat1 = glm::quaternion::angleAxis(glm::degrees(angle), axis);
```

### Quaternion to Matrix

``` C++
glm::mat4 rotation_matrix = glm::quaternion::toMat4(quat1);

glm::mat4 model_matrix = translation_matrix * rotation_matrix * scale_matrix;
```

### Interpolation

``` C++
glm::quat interp_quat = glm::quaternion::mix(a, b, 0.5f);
```

### Find the rotation between two vectors

- a dot b = cos(theta)
- a cross b = axis

# Resources

- [Euler angles](Euler.md)

- [Math for Game Developers](https://www.youtube.com/channel/UCEhBM2x5MG9-e_JSOzU068w)

- [Tutorial 17 - Rotations](http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-17-quaternions/)

- [Rotating Objects Using Quaternions](https://www.gamasutra.com/view/feature/3278/rotating_objects_using_quaternions.php?print=1)

- [OpenGL Tutorial 17 - Rotations](http://www.opengl-tutorial.org/)

- [Rotations about an Arbitrary Axis using Quaternions](https://www.youtube.com/watch?v=PsBx8Kkhc5Y)
