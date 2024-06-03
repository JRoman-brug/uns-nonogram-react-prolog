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
	% TODO: cambiar el predicado a cluesStates
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
	solveNonogram(RowClues, ColClues, Grid, SolvedGrid) :-
		partialSolutions(RowClues, ColClues, Grid, PartialGrid),
		generateSolutions(RowClues, PartialGrid, SolvedGrid),
		checkWin(RowClues, ColClues, SolvedGrid).


	% Brute force
	solveRows(RowClues, Grid, SolvedGrid) :-
		generateSolutions(RowClues, Grid, SolvedGrid).

	generateSolutions([RowC|[]],[GridR|[]], [SolvedRow|[]]):-
		completeRow(RowC, GridR, SolvedRow).
	generateSolutions([RowC|RowsC], [Row|GridRs], [SolvedRow|Rs]):-
		completeRow(RowC, Row, SolvedRow), 
		generateSolutions(RowsC, GridRs, Rs).


	% ------------------------------- completeRow/3 ---------------------------------------------------
	completeRow([], [], []).
	completeRow([0], [], []).
	completeRow(Clues, Row, Res) :-
		completeClue(Clues, Row, Res).
	completeRow(Clues, [Cell|Cells], [_|Res]) :-
		Cell \== "#",
		completeRow(Clues, Cells, Res).

	% ------------------------------- completeClue/3 ---------------------------------------------------
	completeClue([0], [], []).
	completeClue([0|Clues], [Cell|Cells], [_|Rs]) :-
		Cell \== "#",
		completeRow(Clues, Cells, Rs).
	completeClue([Clue|Clues], [Cell|Cells], ["#"|Rs]) :-
		Cell \== "X", Clue > 0, ClueD is Clue - 1, 
		completeClue([ClueD|Clues], Cells, Rs).



	% L=length of row, P = sum of clues, E = space between clues
	% L-(P+E) = S
	% partialSolutions([RowC|RowsC],[GridR|GridRs]).

	checkWin(RowClues, ColClues, Grid) :-
		transpose(Grid, GridT),
		checkLines(RowClues, Grid), 
		checkLines(ColClues, GridT).

	checkLines([], []).
	checkLines([C|Cs], [L|Ls]) :-
		findClue(C, L, R),
		R==1,
		checkLines(Cs, Ls).

	partialSolutions(RowsC, ColsC, [Row|Rows], PartialGrid) :-
		length(Row, RowLength),
		generatePartialLines(RowsC, [Row|Rows], RowLength, PartialRows),
		transpose(PartialRows, PartialRowsT),
		length([Row|Rows], ColLength),
		generatePartialLines(ColsC, PartialRowsT, ColLength, PartialCols),
		transpose(PartialCols, PartialGrid).

	generatePartialLines([], [], _, []).
	generatePartialLines([Clue|Clues], [Line|Lines], Length, [PLine|PLines]) :-	
		cluesLength(Clue, P),
		S is Length - P,
		generateLine(Clue, Line, S, S, PLine),
		generatePartialLines(Clues, Lines, Length, PLines).

	generateLine([], Line, _, _, Line).
	generateLine([0|[]], [], _, _, []).
	generateLine([0|Clues], [Cell|Cells], S, _, [Cell|PCells]) :-
		generateLine(Clues, Cells, S, S, PCells).
	generateLine([Clue|Clues], [_Cell|Cells], S, 0, ["#"|PCells]) :-
		Clue > 0,
		ClueD is Clue - 1,
		generateLine([ClueD|Clues], Cells, S, 0, PCells).
	generateLine([Clue|Clues], [Cell|Cells], S, ST, [Cell|PCells]) :-
		Clue > 0,
		ST > 0,
		ClueD is Clue - 1,
		STD is ST - 1,
		generateLine([ClueD|Clues], Cells, S, STD, PCells).

	cluesLength([Clue|[]], Clue) :- !.
	cluesLength([Clue|Clues], L) :-
		cluesLength(Clues, Ls),
		L is Clue + 1 + Ls.

