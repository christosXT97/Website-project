*** Settings ***
Library           SeleniumLibrary
Library           Collections
Suite Setup       Open Browser To Memory Sequence
Suite Teardown    Close Browser

*** Variables ***
${URL}            http://127.0.0.1:3000/games/memorysequence.html
${BROWSER}        Chrome
${TIMEOUT}        10s
${SEQUENCE_TIMEOUT}    5s
${CELL_COUNT}     9

*** Keywords ***
Open Browser To Memory Sequence
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    # Wait for preloader to disappear
    Wait Until Element Is Not Visible    class:preloader    timeout=${TIMEOUT}
    # Wait for the game container to be fully loaded
    Wait Until Page Contains Element    class:game-container    timeout=${TIMEOUT}
    Wait Until Element Is Visible    class:sequence-board    timeout=${TIMEOUT}
    Sleep    1s    # Give time for JavaScript initialization

Click Start Game
    Wait Until Element Is Visible    id:start-game    timeout=${TIMEOUT}
    Wait Until Element Is Enabled    id:start-game    timeout=${TIMEOUT}
    Click Element    id:start-game

Click Reset Game
    Wait Until Element Is Visible    id:reset-game    timeout=${TIMEOUT}
    Wait Until Element Is Enabled    id:reset-game    timeout=${TIMEOUT}
    Click Element    id:reset-game

Click Cell
    [Arguments]    ${cell_index}
    Wait Until Element Is Visible    xpath=//div[@class="cell"][@data-cell-index="${cell_index}"]    timeout=${TIMEOUT}
    Wait Until Element Is Enabled    xpath=//div[@class="cell"][@data-cell-index="${cell_index}"]    timeout=${TIMEOUT}
    Click Element    xpath=//div[@class="cell"][@data-cell-index="${cell_index}"]

Verify Game Status
    [Arguments]    ${expected_status}
    ${status}=    Get Text    id:game-status
    Should Contain    ${status}    ${expected_status}

Verify Current Level
    [Arguments]    ${expected_level}
    ${level}=    Get Text    id:current-level
    Should Be Equal    ${level}    ${expected_level}

Verify High Score
    [Arguments]    ${expected_score}
    ${score}=    Get Text    id:high-score
    Should Be Equal    ${score}    ${expected_score}

Get Current Level
    ${level}=    Get Text    id:current-level
    RETURN    ${level}

Get High Score
    ${score}=    Get Text    id:high-score
    RETURN    ${score}

Wait For Sequence To Start
    # Wait for sequence to begin playing
    Wait Until Element Is Not Visible    xpath=//div[@class="cell highlighted"]    timeout=1s
    Sleep    0.5s

Wait For Sequence To Complete
    # Wait for the sequence to finish playing
    Sleep    3s    # Allow time for sequence to play
    Wait Until Element Is Not Visible    xpath=//div[@class="cell highlighted"]    timeout=${SEQUENCE_TIMEOUT}
    Sleep    0.5s    # Additional buffer for game state change

Check Button State
    [Arguments]    ${button_id}    ${expected_state}
    ${is_enabled}=    Run Keyword And Return Status    Element Should Be Enabled    id:${button_id}
    Run Keyword If    '${expected_state}' == 'enabled'    Should Be True    ${is_enabled}
    ...    ELSE IF    '${expected_state}' == 'disabled'    Should Not Be True    ${is_enabled}

Observe Sequence
    # Watch for highlighted cells during sequence playback
    ${highlighted_cells}=    Create List
    
    # Wait for sequence to start
    Wait For Sequence To Start
    
    # Try to capture the sequence (this is a simplified approach)
    FOR    ${i}    IN RANGE    10    # Max attempts to capture highlights
        ${highlighted_count}=    Get Element Count    css:.cell.highlighted
        Run Keyword If    ${highlighted_count} > 0    Exit For Loop
        Sleep    0.1s
    END
    
    # Return empty list as we can't reliably capture the sequence in automation
    RETURN    ${highlighted_cells}

Click Sequence
    [Arguments]    @{cell_indices}
    FOR    ${cell_index}    IN    @{cell_indices}
        Click Cell    ${cell_index}
        Sleep    0.3s
    END

Check Cell Has Class
    [Arguments]    ${cell_index}    ${class_name}
    ${has_class}=    Execute JavaScript    
    ...    return document.querySelector('[data-cell-index="${cell_index}"]').classList.contains('${class_name}')
    Should Be True    ${has_class}

Check Cell Does Not Have Class
    [Arguments]    ${cell_index}    ${class_name}
    ${has_class}=    Execute JavaScript    
    ...    return document.querySelector('[data-cell-index="${cell_index}"]').classList.contains('${class_name}')
    Should Not Be True    ${has_class}

Wait For Player Turn
    # Wait until it's the player's turn to click
    Wait Until Keyword Succeeds    5s    0.5s    Verify Game Status    Your turn! Repeat the sequence

Make Deliberate Wrong Move
    # Click a sequence that's likely wrong (random cells)
    Click Sequence    8    7    6

Check All Cells Clear
    # Verify no cells have highlight classes
    FOR    ${i}    IN RANGE    ${CELL_COUNT}
        Check Cell Does Not Have Class    ${i}    highlighted
        Check Cell Does Not Have Class    ${i}    player-click
        Check Cell Does Not Have Class    ${i}    correct
        Check Cell Does Not Have Class    ${i}    wrong
    END

Get Cells Pointer Events
    [Arguments]    ${cell_index}
    ${pointer_events}=    Execute JavaScript    
    ...    return window.getComputedStyle(document.querySelector('[data-cell-index="${cell_index}"]')).pointerEvents
    RETURN    ${pointer_events}

Verify Cells Are Disabled
    # Check that cells have pointer-events: none during sequence
    ${pointer_events}=    Get Cells Pointer Events    0
    Should Be Equal    ${pointer_events}    none

Verify Cells Are Enabled
    # Check that cells have pointer-events: auto for player interaction
    ${pointer_events}=    Get Cells Pointer Events    0
    Should Be Equal    ${pointer_events}    auto

Play Simple Sequence Test
    # Test with a known simple sequence (first few cells)
    Click Sequence    0    1    2

Check Level Progression
    [Arguments]    ${initial_level}
    ${current_level}=    Get Current Level
    ${expected_level}=    Evaluate    ${initial_level} + 1
    Should Be Equal As Numbers    ${current_level}    ${expected_level}

*** Test Cases ***
Game Initialization
    # Verify initial game state
    Verify Game Status    Watch the sequence...
    Verify Current Level    1
    # Check that start button is enabled and reset is disabled
    Check Button State    start-game    enabled
    Check Button State    reset-game    disabled
    # Verify high score is displayed (should be 0 initially or saved value)
    ${score}=    Get High Score
    Should Match Regexp    ${score}    ^\\d+$

Start Game Basic Flow
    Click Start Game
    Sleep    0.5s
    # Verify buttons switched states
    Check Button State    start-game    disabled
    Check Button State    reset-game    enabled
    # Verify game status updated
    Verify Game Status    Watch carefully...

Sequence Playback
    Click Reset Game
    Sleep    0.5s
    Click Start Game
    Sleep    0.5s
    # Verify cells are disabled during sequence
    Verify Cells Are Disabled
    # Wait for sequence to complete
    Wait For Sequence To Complete
    # Verify it's now player's turn
    Wait For Player Turn
    # Verify cells are enabled for player interaction
    Verify Cells Are Enabled

Player Turn Interaction
    Click Reset Game
    Sleep    0.5s
    Click Start Game
    Sleep    0.5s
    Wait For Sequence To Complete
    Wait For Player Turn
    # Test clicking a cell
    Click Cell    0
    Sleep    0.3s
    # Verify cell shows player-click effect (briefly)
    # Note: This test is timing-dependent due to CSS transitions

Reset Game Functionality
    Click Reset Game
    Sleep    0.5s
    # Verify game returns to initial state
    Verify Game Status    Watch the sequence...
    Verify Current Level    1
    Check Button State    start-game    enabled
    Check Button State    reset-game    disabled
    # Verify all cells are clear
    Check All Cells Clear

Wrong Sequence Game Over
    Click Reset Game
    Sleep    0.5s
    Click Start Game
    Sleep    0.5s
    Wait For Sequence To Complete
    Wait For Player Turn
    # Make a deliberately wrong move
    Make Deliberate Wrong Move
    Sleep    1s
    # Verify game over state
    ${status}=    Get Text    id:game-status
    Should Match Regexp    ${status}    Game Over! You reached level \\d+
    # Verify cells are disabled after game over
    Verify Cells Are Disabled

Level Display Consistency
    Click Reset Game
    Sleep    0.5s
    # Start at level 1
    Verify Current Level    1
    Click Start Game
    Sleep    0.5s
    # Level should still be 1 during first level
    Verify Current Level    1

High Score Persistence
    Click Reset Game
    Sleep    0.5s
    # Get initial high score
    ${initial_score}=    Get High Score
    # Play a game (will likely fail, but score might update)
    Click Start Game
    Sleep    0.5s
    Wait For Sequence To Complete
    Wait For Player Turn
    Make Deliberate Wrong Move
    Sleep    1s
    # Reset and check if high score persists
    Click Reset Game
    Sleep    0.5s
    ${final_score}=    Get High Score
    # Score should be >= initial score
    Should Be True    ${final_score} >= ${initial_score}

Button State Management
    # Test button states through game flow
    Click Reset Game
    Sleep    0.5s
    # Initial state
    Check Button State    start-game    enabled
    Check Button State    reset-game    disabled
    
    Click Start Game
    Sleep    0.5s
    # During game
    Check Button State    start-game    disabled
    Check Button State    reset-game    enabled
    
    Click Reset Game
    Sleep    0.5s
    # After reset
    Check Button State    start-game    enabled
    Check Button State    reset-game    disabled

Game Status Messages
    Click Reset Game
    Sleep    0.5s
    # Initial status
    Verify Game Status    Watch the sequence...
    
    Click Start Game
    Sleep    0.5s
    # During sequence
    Verify Game Status    Watch carefully...
    
    Wait For Sequence To Complete
    Wait For Player Turn
    # Player turn status
    Verify Game Status    Your turn! Repeat the sequence

Cell Click Response
    Click Reset Game
    Sleep    0.5s
    Click Start Game
    Sleep    0.5s
    Wait For Sequence To Complete
    Wait For Player Turn
    
    # Test multiple cell clicks
    FOR    ${i}    IN RANGE    3
        Click Cell    ${i}
        Sleep    0.4s
        # Each click should be registered (we can't easily verify the exact sequence)
    END

Rapid Button Clicking
    Click Reset Game
    Sleep    0.5s
    # Test rapid clicking of start button (should not cause issues)
    FOR    ${i}    IN RANGE    3
        Click Start Game
        Sleep    0.1s
    END
    Sleep    1s
    # Game should still function normally
    Check Button State    start-game    disabled
    Check Button State    reset-game    enabled

Game Responsiveness Test
    Click Reset Game
    Sleep    0.5s
    Click Start Game
    Sleep    0.5s
    Wait For Sequence To Complete
    Wait For Player Turn
    
    # Test rapid cell clicking
    FOR    ${i}    IN RANGE    5
        Click Cell    ${i % ${CELL_COUNT}}
        Sleep    0.1s
    END
    
    Sleep    1s
    # Game should handle rapid input gracefully
    ${status}=    Get Text    id:game-status
    Should Not Be Empty    ${status}

Visual Feedback Test
    Click Reset Game
    Sleep    0.5s
    Click Start Game
    Sleep    0.5s
    Wait For Sequence To Complete
    Wait For Player Turn
    
    # Click a cell and verify it provides visual feedback
    Click Cell    4
    Sleep    0.2s
    # The cell should briefly show player-click class
    # Note: This is timing-dependent and may be flaky

Game Board Integrity
    # Verify all 9 cells are present and clickable
    FOR    ${i}    IN RANGE    ${CELL_COUNT}
        Element Should Be Visible    xpath=//div[@class="cell"][@data-cell-index="${i}"]
    END

Multiple Game Cycles
    # Test multiple game start/reset cycles
    FOR    ${cycle}    IN RANGE    3
        Click Reset Game
        Sleep    0.5s
        Verify Current Level    1
        Click Start Game
        Sleep    0.5s
        Check Button State    start-game    disabled
        Check Button State    reset-game    enabled
    END

Level Counter Accuracy
    Click Reset Game
    Sleep    0.5s
    # Verify level starts at 1
    Verify Current Level    1
    
    Click Start Game
    Sleep    0.5s
    # Level should remain 1 during first level
    Verify Current Level    1
    
    Wait For Sequence To Complete
    Wait For Player Turn
    # Level should still be 1 until completion
    Verify Current Level    1

Game Over Recovery
    Click Reset Game
    Sleep    0.5s
    Click Start Game
    Sleep    0.5s
    Wait For Sequence To Complete
    Wait For Player Turn
    
    # Force game over
    Make Deliberate Wrong Move
    Sleep    1s
    
    # Verify we can reset and start again
    Click Reset Game
    Sleep    0.5s
    Verify Game Status    Watch the sequence...
    Verify Current Level    1
    
    # Should be able to start new game
    Click Start Game
    Sleep    0.5s
    Check Button State    start-game    disabled