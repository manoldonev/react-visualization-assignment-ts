## Task

Develop a simple web app that interactively visualizes a set of objects.
Each object has three properties:

- Color: blue, green, or orange
- Size: small or large
- Dot: whether it has a dot (circle) in the middle or not

Given a list of 21 objects, the application visualizes them in a 3x7 grid as shown below:

![initial state](/assets/01.png)

In general the list of objects can be received from a server, however, in this task we simply assume it is fixed upfront. Initially all the objects are unselected (visualized with a slight transparency) and the user can click on each object to select it. For example clicking on one of the small orange boxes will result in the following state:
![selected orange object](/assets/02.png)

Selected objects should stay highlighted as shown above (unless deselected). Further, after an object was selected, the statistics at the top should reflect this change. For example, the "Small Target" statistic shows the percentage of selected object that are small. Because we selected a single object and that object is small, this statistic now shows 100%:
![small target visualization](/assets/03.png)

If we would select another object, say large blue square, then the statistic would look as follows:
![multi select orange and blue targets](/assets/04.png)

In this case, 1 out of 2 selected objects are small so the "Small Target" statistic is 50%

## Task Addon #1

Extend the application with "Orange Target" statistic.

## Task Addon #2

Extend the application with Undo / Redo functionality.
