:- module(proylcc,
	[  
		put/8,
		findClue/3,
		gameInitialState/5
	]).

:-use_module(library(lists)).
:-use_module(library(clpfd)).
% 
%---------------------------------------------------------------------------------%
%
% replace(?X, +XIndex, +Y, +Xs, -XsY)
%
% XsY is the result of replacing the occurrence of X in position XIndex of Xs by Y.

replace(X, 0, Y, [X|Xs], [Y|Xs]).

replace(X, XIndex, Y, [Xi|Xs], [Xi|XsY]):-
    XIndex > 0,
    XIndexS is XIndex - 1,
    replace(X, XIndexS, Y, Xs, XsY).

%---------------------------------------------------------------------------------%
%
% put(+Content, +Pos, +RowsClues, +ColsClues, +Grid, -NewGrid, -RowSat, -ColSat).
%

put(Content, [RowN, ColN], RowsClues, ColsClues, Grid, NewGrid, RowSat, ColSat):-
	% NewGrid is the result of replacing the row Row in position RowN of Grid by a new row NewRow (not yet instantiated).
	replace(Row, RowN, NewRow, Grid, NewGrid),

	% NewRow is the result of replacing the cell Cell in position ColN of Row by _,
	% if Cell matches Content (Cell is instantiated in the call to replace/5).	
	% Otherwise (;)
	% NewRow is the result of replacing the cell in position ColN of Row by Content (no matter its content: _Cell).			
	(replace(Cell, ColN, _, Row, NewRow),
	Cell == Content
		;
	replace(_Cell, ColN, Content, Row, NewRow)),
	% Agregar en el informe porque usamos el transpose
	transpose(NewGrid, NewGridT),
	checkConditionState([RowN,ColN], RowsClues, ColsClues, NewGrid, NewGridT, RowSat, ColSat).

gameStatus([], [], 1).

gameStatus([R|_Rs], _C, 0) :-
	R == 0.

gameStatus(_R, [C|_Cs], 0) :-
	C == 0.

gameStatus([R|Rs], C, Res) :-
	R == 1,
	gameStatus(Rs, C, Res).

gameStatus(R, [C|Cs], Res) :-
	C == 1,
	gameStatus(R, Cs, Res).



% Predicate win condition
% Position: [Row, ColN]+, ClueRows [R|Rs]+, ClueColumns [C|Cs]+, list Rows NewGridR+, list columns NewGridC+, RowSat-, ColSat- 
checkConditionState([0, 0], [R|_RS], [C|_Cs], [NewGridR|_NewGridRs] , [NewGridC|_NewGridCs], RowSat, ColSat) :-
	findClue(R, NewGridR, RowSat),
	findClue(C, NewGridC, ColSat).

checkConditionState([RowN, ColN], [_R|Rs], ColsClues, [_NewGridR|NewGridRs], NewGridC, RowSat, ColSat) :-
	RowN > 0,
	RowNs is RowN - 1,
	checkConditionState([RowNs, ColN], Rs, ColsClues, NewGridRs, NewGridC, RowSat, ColSat).
	
checkConditionState([RowN, ColN], RowsClues, [_C|Cs], NewGridR, [_NewGridC|NewGridCs],  RowSat, ColSat) :-
	ColN > 0,
	ColNs is ColN - 1,
	checkConditionState([RowN, ColNs], RowsClues, Cs, NewGridR, NewGridCs, RowSat, ColSat).


% Rework cambiar nombres
% Caso no hay mas pistas
checkClue([],[],1).
checkClue([], [R|_Rs], 0) :-
    R == "#".
checkClue([], [_R|Rs], RowSat) :-
	checkClue([], Rs, RowSat).

% Caso terminaste de contar la pista actual
checkClue([0], [], 1).
checkClue([0|_Cs], [R|_Rs], 0) :-
    R == "#".
checkClue([0], [_R|Rs], RowSat) :-
    checkClue([], Rs, RowSat).
checkClue([0|Cs], [R|Rs], RowSat) :-
	findClue(Cs, [R|Rs], RowSat).

% Caso seguis en la pista actual
% Contas el #
checkClue([C|Cs], [R|Rs], RowSat) :-
    R == "#",
	C > 0,
	Cd is C - 1,
	checkClue([Cd|Cs], Rs, RowSat).
% No se cumple la pista
checkClue([_C|_Cs], [_R|_Rs], 0).


% Busca para checkear la pista
% Recorro toda la lista y no encuentro ningun '#'
findClue(_Clue,[],0).

% Encontras un '#' para empezar a checkear la pista
findClue(Clue, [R|Rs], RowSat):-
    R == "#",
	checkClue(Clue,[R|Rs] , RowSat).

% Buscas un '#' para checker la pista 
findClue(Clue, [_R|Rs], RowSat):-
	findClue(Clue,Rs,RowSat).

gameInitialState(RowClues, ColClues, Grid, RowsCluesState, ColsCluesState) :-
	transpose(Grid, GridT),
	initCluesState(RowClues, Grid, RowsCluesState),
	initCluesState(ColClues, GridT, ColsCluesState).

initCluesState([], [], []).
initCluesState([Clue|Clues], [Line|Lines], [ClueState|CluesStates]) :-
	findClue(Clue, Line, ClueState),
	initCluesState(Clues, Lines, CluesStates).