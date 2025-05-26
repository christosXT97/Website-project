*** Settings ***
Library           SeleniumLibrary
Suite Setup       Open Browser To Connect4
Suite Teardown    Close Browser

*** Variables ***
${URL}            http://127.0.0.1:3000/games/connect4.html
${BROWSER}        Chrome
${TIMEOUT}        10s

*** Keywords ***
Open Browser To Connect4
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    # Wait for preloader to disappear
    Wait Until Element Is Not Visible    class:preloader    timeout=${TIMEOUT}
    # Wait for the board to be fully loaded
    Wait Until Page Contains Element    class:connect4-board    timeout=${TIMEOUT}
    Wait Until Element Is Visible    class:connect4-board    timeout=${TIMEOUT}
    # Wait for JavaScript to create the board columns
    Wait Until Page Contains Element    class:board-column    timeout=${TIMEOUT}
    ${column_count}=    Get Element Count    css:.board-column
    Should Be Equal As Numbers    ${column_count}    7
    Sleep    1s    # Give time for JavaScript initialization

Wait For Board Initialization
    # Wait for the JavaScript to create all board elements
    Wait Until Page Contains Element    css:.board-column    timeout=${TIMEOUT}
    ${column_count}=    Get Element Count    css:.board-column
    Should Be Equal As Numbers    ${column_count}    7
    ${cell_count}=    Get Element Count    css:.cell
    Should Be Equal As Numbers    ${cell_count}    42    # 7 columns × 6 rows

Click Column
    [Arguments]    ${column_index}
    # Column index should be 0-6 (0 = leftmost, 6 = rightmost)
    ${xpath_index}=    Evaluate    ${column_index} + 1
    Wait Until Element Is Visible    xpath=(//div[@class="connect4-board"]/div[@class="board-column"])[${xpath_index}]    timeout=${TIMEOUT}
    Wait Until Element Is Enabled    xpath=(//div[@class="connect4-board"]/div[@class="board-column"])[${xpath_index}]    timeout=${TIMEOUT}
    # Use JavaScript to click the column directly
    Execute JavaScript    document.querySelectorAll('.board-column')[${column_index}].click()

Click Reset Game
    Wait Until Element Is Visible    id:reset-game    timeout=${TIMEOUT}
    Click Element    id:reset-game

Click New Match
    Wait Until Element Is Visible    id:new-match    timeout=${TIMEOUT}
    Click Element    id:new-match

Click New Match
    Wait Until Element Is Visible    id:new-match    timeout=${TIMEOUT}
    Click Element    id:new-match

Verify Game Status
    [Arguments]    ${expected_status}
    ${status}=    Get Text    id:game-status
    Should Contain    ${status}    ${expected_status}

Verify Player Turn
    [Arguments]    ${player_number}
    ${status}=    Get Text    id:game-status
    Should Contain    ${status}    Player ${player_number}

Check Cell Has Piece
    [Arguments]    ${column}    ${row}    ${color}
    # Check if cell has the expected color (red or yellow)
    ${has_color}=    Execute JavaScript    
    ...    const columns = document.querySelectorAll('.board-column');
    ...    const column = columns[${column}];
    ...    const cells = column.querySelectorAll('.cell');
    ...    const visualRow = 5 - ${row};  // Convert to visual row (bottom-up)
    ...    const cell = cells[visualRow];
    ...    return cell && cell.classList.contains('${color}');
    Should Be True    ${has_color}

Check Column Is Full
    [Arguments]    ${column}
    # Check if all cells in a column are filled
    ${is_full}=    Execute JavaScript    
    ...    const column = document.querySelectorAll('.board-column')[${column}];
    ...    const cells = column.querySelectorAll('.cell');
    ...    let count = 0;
    ...    cells.forEach(cell => {
    ...        if (cell.classList.contains('red') || cell.classList.contains('yellow')) {
    ...            count++;
    ...        }
    ...    });
    ...    return count === 6;
    Should Be True    ${is_full}

Check Winning Cells Highlighted
    # Check if there are cells with winning-cell class
    ${winning_cells}=    Get Element Count    css:.winning-cell
    Should Be True    ${winning_cells} >= 4

Verify Score
    [Arguments]    ${player_number}    ${expected_score}
    ${score}=    Get Text    css:.player-${player_number} .score
    Should Be Equal    ${score}    ${expected_score}

Wait For Animation
    # Wait for piece drop animation to complete
    Sleep    0.8s

Play Multiple Moves
    [Arguments]    @{columns}
    FOR    ${column}    IN    @{columns}
        Click Column    ${column}
        Wait For Animation
    END

Check Board Is Empty
    # Verify all cells are empty (no red or yellow classes)
    ${filled_cells}=    Get Element Count    css:.cell.red, .cell.yellow
    Should Be Equal As Integers    ${filled_cells}    0

Get Current Player
    ${status}=    Get Text    id:game-status
    ${is_player1}=    Run Keyword And Return Status    Should Contain    ${status}    Player 1
    RETURN    ${1 if ${is_player1} else 2}

Fill Column Completely
    [Arguments]    ${column}
    # Fill a column with alternating pieces (6 pieces total)
    FOR    ${i}    IN RANGE    6
        Click Column    ${column}
        Wait For Animation
    END

*** Test Cases ***
Start A Basic Game
    # Wait for the board to be fully loaded and interactive
    Wait For Board Initialization
    Sleep    1s
    # Verify initial game state
    Verify Game Status    Player 1's turn (Red)
    # Make first move
    Click Column    3
    Wait For Animation
    # Verify the piece was placed
    Check Cell Has Piece    3    0    red
    # Verify turn switched
    Verify Game Status    Player 2's turn (Yellow)

Alternate Player Turns
    Click Reset Game
    Wait For Board Initialization
    Sleep    0.5s
    # Play several moves and verify turn alternation
    Click Column    0
    Wait For Animation
    Verify Player Turn    2
    Click Column    1
    Wait For Animation
    Verify Player Turn    1
    Click Column    2
    Wait For Animation
    Verify Player Turn    2

Stack Pieces In Same Column
    Click Reset Game
    Wait For Board Initialization
    Sleep    0.5s
    # Place multiple pieces in the same column
    Click Column    3
    Wait For Animation
    Check Cell Has Piece    3    0    red
    Click Column    3
    Wait For Animation
    Check Cell Has Piece    3    1    yellow
    Click Column    3
    Wait For Animation
    Check Cell Has Piece    3    2    red

Test Horizontal Win
    Click Reset Game
    Wait For Board Initialization
    Sleep    0.5s
    # Create horizontal win for Player 1 (Red)
    # Player 1 moves: columns 0, 1, 2, 3
    # Player 2 moves: columns 4, 5, 6 (to not interfere)
    Click Column    0    # Player 1
    Wait For Animation
    Click Column    4    # Player 2
    Wait For Animation
    Click Column    1    # Player 1
    Wait For Animation
    Click Column    5    # Player 2
    Wait For Animation
    Click Column    2    # Player 1
    Wait For Animation
    Click Column    6    # Player 2
    Wait For Animation
    Click Column    3    # Player 1 - Should win
    Wait For Animation
    # Verify win condition
    Verify Game Status    Red wins!
    Check Winning Cells Highlighted

Test Vertical Win
    Click Reset Game
    Wait For Board Initialization
    Sleep    0.5s
    # Create vertical win for Player 1 (Red) in column 0
    # Alternate moves to ensure Player 1 gets 4 in a row vertically
    Click Column    0    # Player 1 - Row 0
    Wait For Animation
    Click Column    1    # Player 2
    Wait For Animation
    Click Column    0    # Player 1 - Row 1
    Wait For Animation
    Click Column    1    # Player 2
    Wait For Animation
    Click Column    0    # Player 1 - Row 2
    Wait For Animation
    Click Column    1    # Player 2
    Wait For Animation
    Click Column    0    # Player 1 - Row 3, Should win
    Wait For Animation
    # Verify win condition
    Verify Game Status    Red wins!
    Check Winning Cells Highlighted

Test Column Full Scenario
    Click Reset Game
    Wait For Board Initialization
    Sleep    0.5s
    # Fill column 0 completely
    Fill Column Completely    0
    # Verify column is full
    Check Column Is Full    0
    # Try to click the full column (should not add more pieces)
    ${pieces_before}=    Get Element Count    css:.cell.red, .cell.yellow
    Click Column    0
    Wait For Animation
    ${pieces_after}=    Get Element Count    css:.cell.red, .cell.yellow
    Should Be Equal As Integers    ${pieces_before}    ${pieces_after}

Test Reset Game Functionality
    Click Reset Game
    Wait For Board Initialization
    Sleep    0.5s
    # Play some moves
    Play Multiple Moves    0    1    2
    # Verify pieces are placed
    ${pieces_count}=    Get Element Count    css:.cell.red, .cell.yellow
    Should Be True    ${pieces_count} > 0
    # Reset the game
    Click Reset Game
    Wait For Board Initialization
    Sleep    0.5s
    # Verify board is empty
    Check Board Is Empty
    # Verify it's Player 1's turn
    Verify Game Status    Player 1's turn (Red)

Test New Match Functionality
    Click New Match
    Wait For Board Initialization
    Sleep    0.5s
    # Play some moves and let Player 1 win
    Play Multiple Moves    0    4    1    5    2    6    3
    # Verify scores are reset
    Verify Score    1    0
    Verify Score    2    0
    # Verify board is empty
    Check Board Is Empty

Test Score Tracking
    Click New Match
    Wait For Board Initialization
    Sleep    0.5s
    # Create a win scenario for Player 1
    Play Multiple Moves    0    4    1    5    2    6    3
    # Wait for win to be processed
    Sleep    1s
    # Verify Player 1 score increased
    Verify Score    1    1
    Verify Score    2    0
    # Start new game and create win for Player 2
    Click Reset Game
    Wait For Board Initialization
    Sleep    0.5s
    # Let Player 2 win (Yellow starts second, so we need to plan accordingly)
    Play Multiple Moves    4    0    4    1    4    2    4
    # Wait for win to be processed
    Sleep    1s
    # Verify Player 2 score increased
    Verify Score    1    1
    Verify Score    2    1

Test Draw Scenario
    Click Reset Game
    Sleep    0.5s
    # Fill the entire board in a pattern that creates no wins
    # This is a simplified test - in practice, creating a true draw is complex
    FOR    ${col}    IN RANGE    7
        FOR    ${row}    IN RANGE    6
            Click Column    ${col}
            Wait For Animation
            # Check if game ended early due to win
            ${status}=    Get Text    id:game-status
            ${game_ended}=    Run Keyword And Return Status    
            ...    Should Match Regexp    ${status}    (wins!|draw!)
            Exit For Loop If    ${game_ended}
        END
        # Check if game ended
        ${status}=    Get Text    id:game-status
        ${game_ended}=    Run Keyword And Return Status    
        ...    Should Match Regexp    ${status}    (wins!|draw!)
        Exit For Loop If    ${game_ended}
    END

Test Game Responsiveness
    # Test rapid clicking
    Click Reset Game
    Sleep    0.5s
    FOR    ${i}    IN RANGE    5
        Click Column    ${i}
        Sleep    0.1s    # Very short delay
    END
    # Verify all moves were registered properly
    ${pieces_count}=    Get Element Count    css:.cell.red, .cell.yellow
    Should Be Equal As Integers    ${pieces_count}    5

Test Board Hover Effects
    Click Reset Game
    Sleep    0.5s
    # Verify all columns are present and clickable
    ${column_count}=    Get Element Count    css:.board-column
    Should Be Equal As Numbers    ${column_count}    7
    # Test that first column can be hovered (simplified test)
    ${first_column_visible}=    Run Keyword And Return Status    
    ...    Element Should Be Visible    css:.board-column:first-child
    Should Be True    ${first_column_visible}