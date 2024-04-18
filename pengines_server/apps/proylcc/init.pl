:- module(init, [ init/3 ]).

/**
 * init(-RowsClues, -ColsClues, Grid).
 * Predicate specifying the initial grid, which will be shown at the beginning of the game,
 * including the rows and columns clues.
 */

init(
[[2,1,2],[2,1,2],[1,1,2],[1,3,1],[2,5],[2,1,1],[4,1],[4,1]],% RowsClues
[[1,1,2],[5,2],[1,3],[7],[1,2],[3],[3,1,2],[6]], 	% ColsClues

[
[ _, _, _, _, _, _, _, _],
[ _, _, _, _, _, _, _, _],
[ _, _, _, _, _, _, _, _],
[ _, _, _, _, _, _, _, _],
[ _, _, _, _, _, _, _, _],
[ _, _, _, _, _, _, _, _],
[ _, _, _, _, _, _, _, _],
[ _, _, _, _, _, _, _, _]
]
).