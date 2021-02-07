Title: Tesselation
Date: 2021-02-07
Category: Notes

Broken up into three stages:  
- Tesselation control shader (TCS)  
- Tesselation evaluation shader (TES)  

![qownnotes-media-jdiwDC]({static}/images/media/qownnotes-media-jdiwDC-9042.png)

The tesselation stage operates on *patches*.

> A GL_PATCHES primitive has no implied topology. It's up to your shader to interpret the order.

> When tessellation is active, the mode you use in your drawing commands should always
be GL_PATCHES.

### What does it do?

Tesselation breaks a larger primitive (patch) into smaller primitives, e.g. to add more detail.

### How do you pass vertices to the TCS?

Vertices are automatically passed to the TCS from the vertex shader _in groups_.

The number of vertices passed at a time is configured with `glPatchParameteri(GL_PATCH_VERTICES, <amount>);`

### What exactly does the TCS do?

The TCS is responsible for:

- Per patch inner and outer tesselation factors
- Position and other *attributes* for each *output control point*.
- Per-patch user-defined in-out variables.

### What are "tesselation factors"?

The tesselation factors are used by the fixed-function tesselation engine to determine in what way the patch will be broken up into smaller primitives.

### What is the output of a TCS?

The TCS outputs a new patch (a new collection of vertices). This new patch is preserved and sent to the TES after the tesselation engine runs. The tesselation engine does not modify this patch.

Per-patch variables can be declared in the TCS.

The layout of a patch can be defined here (as well as `glPatchParameteri`), but I assume they must match.

`layout (vertices = 4) out;`

### What is the output of the fixed function tesselation engine?

The tesselator outputs barycentric coordinates that determine where on the patch the new vertices are.

### Tesselation configuration

Different primitive modes can be used by the tesselator: triangles, quads, isolines. This also controls the interpretation of the gl_TessCoord in the TES.

When quads are chosen, the tesselator will generate quads then break them up into triangles.

### How do you set the tesselation levels?

`gl_TessLevelInner` is a 2-element array.

The first element should be set to the horizontal (u) direction, and the second element to the vertical (v) direction.

`gl_TessLevelOuter` has 4 elements for some reason.*****

![qownnotes-media-EbPbbv]({static}/images/media/qownnotes-media-EbPbbv-16827.png)

### Example TCS and TES

<img src="{static}/images/media/qownnotes-media-CEMyum-23824.png" width="600" />
<img src="{static}/images/media/qownnotes-media-SvSnSA-11250.png" width="600" />
<img src="{static}/images/media/qownnotes-media-SgLbfj-14420.png" width="600" />

From this example, you can deduce that the tesselation factors can be thoughts of as inverses.

5.0f = 1/5 = 5 triangles along this axis (divde the axis by five).

# Resources

- OpenGL Superbible 7th Edition  
- https://web.engr.oregonstate.edu/~mjb/cs519/Handouts/tessellation.1pp.pdf


