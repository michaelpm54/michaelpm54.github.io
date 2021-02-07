Title: OpenMW
Date: 2021-02-07
Category: Notes

OpenMW
=

### Duration

When you see `duration` as a parameter in the code base, as you will on most if not all `update` functions, it's the frame time.  The amount of time that has passed in seconds (fractional) since the last frame. Also called `dt`.

### Pointers

A convention in the code base is to retrieve pointers or references to objects as needed through a singleton or other method.

For example:

``` c++
const auto player = MWBase::Environment::get().getWorld()->getPlayerPtr();
```

This is one way of avoiding passing many parameters around but incurs a small runtime cost.

# Animation

``` python
osg::Referenced: Animation: Class encapsulation animation behaviour
	World
	Parent
	ResourceSystem

	Construction:
		ResetAnimationTimers()
		CreateLightListCallback()

	Activate:
		ActivateSkeleton()

	LoadAllAnimationsInFolder(ModelName, BaseModelName):
		If ModelName.StartsWith("meshes"):
			ModelName.Replace("meshes", "animations")
		ModelName.SetLast3Chars("/")
		NormaliseFilename(ModelName)
		For File in ModelName.Path:
			If File.Name.Matches(ModelName):
				If File.Name.EndsWith(".kf"):
					AddSingleAnimSource(File.Name, BaseModelName)

	AddAnimSource(ModelName, BaseModelName):
		kfName = ModelName.Lowercase
		If kfName.EndsWith(".nif"):
			kfName.Replace(".nif", ".kf")
		AddSingleAnimSource(kfName, BaseModelName)
		If SettingsManager.UseAdditionalAnimSources:
			LoadAllAnimationsInFolder(kfName, BaseModelName)

	AddSingleAnimSource(kfName, BaseModelName):
		If kfName.DoesntExist():
			return
		AnimSrc = ResourceSystem.KeyFrameManager.Get(kfName)
		If AnimSrc.KeyFramesAreInvalid():
			return
		For Controller in AnimSrc.KeyFrames.Controllers:
			BoneName = Controller.Lowercase
			If BoneName in NodeMap:
				BlendMask = DetectBlendMask(NodeMap[BoneName])
				ClonedController = Controller.Copy()
				ClonedController.SetSource(AnimationTimer[BlendMask])
				AnimSrc.Controllers[BlendMask].Add(BoneName, ClonedController)
		AnimSources.Add(AnimSrc)
		RootNode.AssignControllers()
		If Not AccumulationRoot:
			AccumulationRoot = NodeMap["bip01"] If Exists Else NodeMap["root bone"]

	Play(Group, Prio, BlendMask, AutoDisable, SpeedMul, Start, Stop, StartPt, Loops, LoopFallback):
		If NoRoot and NoAnimSources:
			return
		If Group.Empty:
			return
		For State in AnimStates:
			If State.Prio == Prio:
				AnimStates.Remove(State)
		If AnimStates[Group]:
			AnimStates[Group].Prio = Prio
		For Src in AnimSources.Reverse():
			Pass				

/ActorAnimation is-a Animation: Class encapsulating animation behaviour specialised for Actors
	World
	Parent
	Resources
```

# AI

Generally the chain of execution for AI processing looks as follows.

``` Python
Actors.update:
	if not paused:
		for actor in actors:
			if aiEnabled and actor.inProcessingRange:
				if not cellChanged:
					if actor is not player:
						if actor.concious:
							actor.aiSequence.execute(dt)
```

Additionally, there's a parameter called `outOfRange` which lets the sequence decide whether to execute the package or not.  
If the actor that the package belongs to is out of range, the package wno't execute unless it has the "alwaysActive" flag set.

In every-day situations we write code where instructions are executed sequentially and then it finishes.  
Games are a bit different in that they execute similar code repeatedly in a loop. If we wanted an AI actor in our game
to go to `point X`, we can't just set their position to `point X` because they would teleport there instantly. We need to spread
out the action over several frames.

Following, some AI actions shouldn't happen instantly but over time. An example in OpenMW is the "avoid door" action.

This action tells the actor to avoid an opening door; to move out of the way of its collision geometry. It achieves this by implementing the behaviour
in a concrete class `AiAvoidDoor` of base class type `AiPackage`. This class is pushed to the front of a stack of `AiPackage`, using the `AiSequence` container class.

## AiSequence

Each creature in the OpenMW world world has an `AiSequence`.

The `AiSequence` class has various methods for probing the packages it contains.

The core of `AiSequence` is the `execute` method. This is the part that runs every frame. This function calls the `execute` function
of the current `AiPackage`. `AiPackage::execute` is slightly different in that it returns a boolean value which represents whether the package is finished or not.

## AiAvoidDoor

The default duration for AiAvoidDoor is 1 second. Upon each `execute` (update), the `mDuration` member is decremented by the frametime (time passed since the last frame). The frametime is normally less than a second. The conditions for returning `true` on `execute` are when 1 second has passed, or when the door has stopped moving. At this point the `AiSequence` which holds the `AiAvoidDoor` package removes it from the stack.

# ResourceSystem

The resource system is a container class for various managers. Namely, scenes, images, nif's, key frames, and also has a space for polymorphic resource managers.

# WindowManager

the WindowManager is *not* referring to the OS window (e.g. SDL, GLFW etc.) but to the stuff being rendered inside the window.

The ResourceSystem instance is passed to WindowManager in construction.  
Listed are the things WindowManager needs ResourceSystem for:

- Loading screen
- Main menu
- Inventory window
- Quest list
- Werewolf overlay(?)
- Player hit fader(?)
- Character creation menu
- Window icon
- Book art
- Cursors

The wndow manager has a map of GUI states. It could conceivably be a vector to be more efficient but I suppose a map better represents what it is and the gains would be practically nonexistent.

On `WindowManager::initUI`, which is called only once in `Engine::prepareEngine`, the map of GUI mode states is populated with `GuiModeState`s. A `GuiModeState` wraps a `WindowBase` to provide some extra functionality.

Not every `WindowBase` is converted to a `GuiModeState`.

Example: The main menu is a gui mode state.

``` C++
MainMenu* menu = new MainMenu(w, h, mResourceSystem->getVFS(), mVersionDescription);
mGuiModeStates[GM_MainMenu] = GuiModeState(menu);
mWindows.push_back(menu);
```

On the other hand, the stats window isn't.

``` C++
mStatsWindow = new StatsWindow(mDragAndDrop);
mWindows.push_back(mStatsWindow);
```
Crucially, a gui mode state can hold a list of windows. For example {TODO: INSERT EXAMPLE HERE}.

## WindowManager::update(float frameDuration)

The list of windows in each state is updated, as well as various other things.

# osgViewer

The viewer provides a window(?) for the 3D environment that OSG uses, as well as the scene graph(?).

An instance is created in `Engine::go()`.

Next, an instance of the concrete `World` class is created.

``` C++
mEnvironment.setWorld( new MWWorld::World (mViewer, rootNode, mResourceSystem.get()[...]);
```

Note that `World` takes the viewer as a parameter. The viewer comes with its own camera implementation.

# World

## Info

The world is instantiated in `Engine::prepareEngine()`.

The bulk of the world implementation in OpenMW is defined in apps/openmw/mwworld/worldimp.cpp (as the name would suggest.)

The world serves as a container and controller for the various systems of the OpenMW world, such as physics, rendering, the player, navigation, weather, etc.

The world in worldimp.{cpp,h } is an implementation of the base class `MWBase::World`.

The RenderingManager is initialised in `World::World()`

For some reason, `World::setupPlayer()` is called immediately after construction instead of in the constructor.

## Enable/disable

When an item reference is enabled or disabled, it is first enabled itself and then gets added to the scene if the following conditions are met:

- The item's cell exists in the scene
- The number of items in the scene is more than zero

The same is true for disabling an item, except it is removed.

## Player

The player holds a LiveCellRef<ESM::NPC> called `mPlayer`. On construction of Player, the LiveCellRef is instantiated with a type or key of "player".

`MWWorld::Class` has a method called `registerClass`. At some point, I assume `ESM::NPC` gets registered with "player".

The mClass pointer member of `LiveCellRefBase` gets set to `&Class::get("player")`, whcih evaluates to `ESM::NPC`.

## Moving of objects

``` C++
MWWorld::Ptr World::moveObject(const Ptr &ptr, CellStore* newCell, float x, float y, float z, bool movePhysics)
```
### How does the player move in the world?

Let's go with the basic action of holding the "W" key to move forward.  

First of all, on key press the stack looks like this:

`Engine::frame -> InputManager::update -> ActionManager::update -> Player::setForwardBackward`

Then to add the movement to a queue each frame:

`Engine::frame -> MechanicsManager::update -> Actors::update -> CharacterController::update -> World::queueMovement`

Then on update:

`Engine::frame -> World::updatePhysics -> World::doPhysics -> PhysicsSystem::applyQueuedMovement -> MovementSolver::move`

#### apps/openmw/mwinput/bindingsmanager.cpp
A map of OpenMW-defined actions (enum) is mapped to an SDL scancode.  
The `A_MoveForward` action is mapped to `SDL_SCANCODE_W`.

#### apps/openmw/mwinput/actionmanager.cpp  
in `ActionManager::update`, the bindings manager is tested for the `A_MoveForward` action. If it's active, the player's "move forward" flag is set. In real terms this means `Player::MWWorld::Npc::MWMechanics::Movement::mPosition[1]` gets set to 1.0f.

This is done via `ptr.getClass().getMovementSettings(ptr).mPosition[1] = value;`.

---

Next comes the update portion.

Each Actor has a CharacterController. This controller is updated by way of:

`Engine::frame -> MechanicsManager::update -> Actors::update`

#### apps/openmw/engine.cpp

`Engine::frame` calls `World::updatePhysics`.

#### apps/openmw/mwworld/worldimp.cpp

`World::updatePhysics` calls `World::doPhysics` if not paused.

`World::doPhysics` calls `PhysicsSystem::applyQueuedMovement`.

#### apps/openmw/mwphysics/physicssystem.cpp

`PhysicsSystem::applyQueuedMovement` iterates the movement queue and calls `MovementSolver::move` on each actor, which returns the calculated position after movement.

# MainMenu

Upon construction, the first thing the MainMenu does is call its base class constructor, `WindowBase` with the name of the OpenMW main menu layout file; `openmw_mainmenu.layout`. This file only adds some version text in the bottom right of the window.

Continuing in the `MainMenu` constructor, the member `mVersionText` widget is found by name (matched in the .layout file mentioned above), then the actual text is set.

MainMenu contains map of buttons, indexable by the button name (string).

They are inserted into the map each time `MainMenu::update()` is called, and their highlight/normal/pushed properties are set, by way of texture names. Then the click callback is assigned.

# Scene

The scene instance exists in `World`.

The cell grid is a 3x3 grid of cells that surround the player. Processing is done on these cells, and not the ones outside (barring special circumstances?)

## Terrain

A call to `changeCellGrid` is made if the player crosses a threshold when moving through the world. After a list of cells to load is collected, they are loaded through `loadCell` one by one.

 -> Scene::loadCell

# Resources

- https://github.com/OpenMW/openmw
