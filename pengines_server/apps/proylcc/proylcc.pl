:- module(proylcc,
	[  
		put/8,
		gameInitialState/5
	]).

:-use_module(library(lists)).
:-use_module(library(clpfd)).

%---------------------------------------------------------------------------------%
%
% replace(?X, +XIndex, +Y, +Xs, -XsY)
%
% XsY is the result of replacing the occurrence of X in position XIndex of Xs by Y.

replace(X, 0, Y, [X|Xs], [Y|Xs]).
replace(X, XIndex, Y, [Xi|Xs], [Xi|XsY]):-
	XIndex > 0, XIndexS is XIndex - 1, 
	replace(X, XIndexS, Y, Xs, XsY).

%---------------------------------------------------------------------------------%
%
% put(+Content, +Pos, +RowsClues, +ColsClues, +Grid, -NewGrid, -RowSat, -ColSat).
%
put(Content, [RowN, ColN], RowsClues, ColsClues, Grid, NewGrid, RowSat, ColSat):-
	% NewGrid is the result of replacing the row Row in position RowN of Grid by a new row NewRow (not yet instantiated).

	replace(Row, RowN, NewRow, Grid, NewGrid), % NewRow is the result of replacing the cell Cell in position ColN of Row by _,
	% if Cell matches Content (Cell is instantiated in the call to replace/5).	
	% Otherwise (;)
	% NewRow is the result of replacing the cell in position ColN of Row by Content (no matter its content: _Cell).			
	
	(
		replace(Cell, ColN, _, Row, NewRow), Cell == Content;
		replace(_Cell, ColN, Content, Row, NewRow)), % Agregar en el informe porque usamos el transpose
		
	transpose(NewGrid, NewGridT), 
	checkConditionState([RowN, ColN], RowsClues, ColsClues, NewGrid, NewGridT, RowSat, ColSat).

%---------------------------------------------------------------------------------%
%
% gameStatus(+RowsClues, +ColsClues, -Status)
%
gameStatus([], [], 1).
gameStatus([0|_Rs], _C, 0).
gameStatus(_R, [0|_Cs], 0).
gameStatus([1|Rs], C, Res) :-
	gameStatus(Rs, C, Res).
gameStatus(R, [1|Cs], Res) :-
	gameStatus(R, Cs, Res).




%---------------------------------------------------------------------------------%
%
% checkConditionState(+Position, +RowsClues, +ColClues, +Grid, +GridT, -RowSat, -ColSat).
%
checkConditionState([0, 0], [R|_RS], [C|_Cs], [NewGridR|_NewGridRs], [NewGridC|_NewGridCs], RowSat, ColSat) :-
	findClue(R, NewGridR, RowSat), 
	findClue(C, NewGridC, ColSat).
checkConditionState([RowN, ColN], [_R|Rs], ColsClues, [_NewGridR|NewGridRs], NewGridC, RowSat, ColSat) :-
	RowN > 0, RowNs is RowN - 1, 
	checkConditionState([RowNs, ColN], Rs, ColsClues, NewGridRs, NewGridC, RowSat, ColSat).
checkConditionState([RowN, ColN], RowsClues, [_C|Cs], NewGridR, [_NewGridC|NewGridCs], RowSat, ColSat) :-
	ColN > 0, ColNs is ColN - 1, 
	checkConditionState([RowN, ColNs], RowsClues, Cs, NewGridR, NewGridCs, RowSat, ColSat).

%---------------------------------------------------------------------------------%
%
% findClue(+Clue, +Line, -Sat)

findClue([], [], 1).
findClue([0], [], 1).
findClue(_Clue, [], 0).
findClue(Clue, [Cell|Cells], Sat) :-
	Cell == "#", 
	checkClue(Clue, [Cell|Cells], Sat).
findClue(Clue, [_Cell|Cells], Sat) :-
	findClue(Clue, Cells, Sat).

%---------------------------------------------------------------------------------%
%
% checkClue(+Clue, +Line, -Sat)
checkClue([0|_Clues], [Cell|_Cells], 0) :-
	Cell == "#".
checkClue([0|Clues], Line, Sat) :-
	findClue(Clues, Line, Sat).
checkClue([Clue|Clues], [Cell|Cells], Sat) :-
	Cell == "#", Clue > 0, ClueD is Clue - 1, 
	checkClue([ClueD|Clues], Cells, Sat).

checkClue(_Clues, _Line	, 0).


%---------------------------------------------------------------------------------%
%
% gameInitialState(+RowClues, +ColClues, +Grid, -RowsCluesState, -ColsCluesState).
gameInitialState(RowClues, ColClues, Grid, RowsCluesState, ColsCluesState) :-
	transpose(Grid, GridT), 
	initCluesState(RowClues, Grid, RowsCluesState), 
	initCluesState(ColClues, GridT, ColsCluesState).

%---------------------------------------------------------------------------------%
%
% initCluesState(+Clues, +Grid, -CluesStates)

initCluesState([], [], []).
initCluesState([Clue|Clues], [Line|Lines], [ClueState|CluesStates]) :-
	findClue(Clue, Line, ClueState), 
	initCluesState(Clues, Lines, CluesStates).


%Second phase nonogram solver
% Preguntar si podemos usar los metodos de lista
solveNonogram(RowClues, ColClues, SolvedGrid) :-
	emptyGrid(RowClues, ColClues, SolvedGrid), 
	solveRows(RowClues, SolvedGrid), 
	transpose(SolvedGrid, SolvedGridT), 
	checkCols(ColClues, SolvedGridT).
	

% Brute force
solveRows(RowClues, Grid):-
	% partialSolutions(RowClues, Grid),

	generateSolutions(RowClues, Grid).

generateSolutions([RowC|[]],[GridR|[]]).
generateSolutions([RowC|RowsC], [Row|GridRs]):-
	completeRow(RowC, Row), 
	generateSolutions(RowsC, GridRs).



% Second version
completeRow([],Cells, Cells).

completeRow([0|Clues], [Cell|Cells], R):-
	completeRow(Clues, Cells, R). 

% Paint
completeRow([Clue|Clues], [Cell|Cells], R):-
	completeClue(Clue,[Cell|Cells],C,R),
	completeRow(Clues, C,C).

% If fail jump a cell
completeRow([Clue|Clues], [Cell|Cells], [Cell|Cells]):-
	completeRow([Clue|Clues], Cells, Cells). 

completeClue(0,[],[],[]).
completeClue(0,[_Cell|Cells],Cells,Cells2).
completeClue(Clue,[Cell|Cells],Path,["#"|Cells]):-
    Clue>0,
    ClueD is Clue - 1,
    completeClue(ClueD, Cells, Path, Cells).


% L=length of row, P = sum of clues, E = space between clues
% L-(P+E) = S
% partialSolutions([RowC|RowsC],[GridR|GridRs]).
emptyGrid(RowClues, ColClues, SolvedGrid) :-
	length(RowClues, N), 
	length(ColClues, M), 
	createGrid(N, M, SolvedGrid).

createGrid(0,_,[]).
createGrid(N, M, [Row|Rest]) :-
	N > 0, 
	createRow(M, Row), Ns is N - 1, 
	createGrid(Ns, M, Rest).

createRow(0,[]).
createRow(M, [[]|Rest]) :-
	M > 0, Ms is M - 1, 
	createRow(Ms, Rest).



%


