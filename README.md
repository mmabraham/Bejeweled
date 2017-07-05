## Bejeweled

### Background

Bejeweled is a single player tile-matching puzzle game. The goal is to accumulate points by matching 3 or more jewels in the same column or row. Every time there is a match, all jewels in the match are removed from the grid to be replace by the jewels above them. matched are made by swapping 2 ajacent jewels.

### Functionality & MVP  

- [ ] rendering a game board
- [ ] swapping two adjacent jewels (If it would result in a match)
- [ ] replacement of matched jewels with those above them
- [ ] accumulation of points dependant on size of matches

### Wireframes

This app will consist of a main canvas for the game board, game controls,
and a progress bar.

![wireframes](wireframe.jpg)

### Architecture and Technologies

This project will be implemented with the following technologies:

- vanilla `JavaScript` for game logic,
- `HTML5 canvas` for rendering the game board ,

Every type of jewel will be a class that inherits from Jewel and will have a method to draw its shape.
the board with contain a nested array of columns of jewel objects.
The canvas will have a click listener using arithmatic to determine the selected jewel. once two jewels are selected, they will switch, using an animation frame.
The game class will keep track of the general game logic.

### Implementation Timeline

**Day 1**: Setup project directory with html layout, canvas and enough js to allow for interactivity.

- Render all jewel types in canvas.
- Enable switching any 2 jewels (no logic yet)

**Day 2**: Implement game logic and matching animation.

- Only persist swaps that complete a match.
- remove matched jewels from the board.
- animate the falling of the remaining jewels

**Day 3**: Add game controls

- implement point system
- progress bar and timer
- levels

### Bonus features

- [ ] add gem types for later levels
- [ ] hint button
- [ ] reset board in absence of possible matches
- [ ] bonus special affect jewels
- [ ] normal and timed game modes
