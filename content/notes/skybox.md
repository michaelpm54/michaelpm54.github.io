Title: Skybox
Date: 2021-02-07
Category: Notes

The concept behind rendering a skybox is to use a cubemap and only render what's necessary.

In the fragment shader instead of using texture coordinates you use a direction because that's what cubemaps use.

What you'll want to do is take the view matrix and cut off the translation so it's always around our head, the camera, but keep the rotation so it affects the cubemap's direction vectors.

The easy and visually correct way to render a skybox would be to render the cubemap first so transparent object rendered afterwards show the skybox through them.

The only problem at this point is that because the cube is rendered around our camera, we can't see anything else! So disable the depth test while we draw it.

This works, but is a bit inefficient because we render all parts of the skybox in our field of view, even if it will later be covered up by other geometry. A workaround is to render the skybox last.

By default, fragments the are higher or equal in depth to the existing value are discarded. This setting is called `GL_LESS`, as in "only fragments with a depth value LESS than the existing one pass".

<img src="{static}/images/media/qownnotes-media-VyHmYt-751286445.png" width="400" />

The camera is looking at the green box.  
- The orange box is obscured, so we shouldn't be able to see it.  
- Its depth value is greater, so we should discard it.  

These behaviours align.

When we draw the skybox last, we want to draw it in front of other geometry, but only where there is no other geometry.  By default, the depth buffer is filled with values of 1.0, i.e. where there is no other geometry, so we set glDepthFunc to `GL_LEQUAL`; where the depth value is less than or equal to the existing value, proceed with fragment processing. In order for this to work, we need to disable writing to the depth buffer so that we use the existing 1.0 value, so we set glDepthMask to `GL_FALSE`.
