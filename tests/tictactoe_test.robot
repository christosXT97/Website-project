*** Settings ***
Documentation     Test suite for Tic Tac Toe game
Library           SeleniumLibrary
Suite Setup       Open Browser To Game Page
Suite Teardown    Close All Browsers
Test Setup        Reload Page And Wait For Game

*** Variables ***
${BROWSER}        Chrome
${URL}            http://127.0.0.1:3000/games/tictactoe.html
${TIMEOUT}        10s
${DEBUG}          True    # Set to True for more verbose logging

*** Test Cases ***
Player X Should Win Horizontally
    [Documentation]    Test that player X can win by filling a horizontal row
    Run Keyword If     ${DEBUG}    Log To Console    Starting Player X Win Horizontally test
    Click Cell    0    # X plays top-left
    Cell Should Contain    0    X
    Click Cell    3    # O plays middle-left
    Cell Should Contain    3    O
    Click Cell    1    # X plays top-middle
    Cell Should Contain    1    X
    Click Cell    4    # O plays center
    Cell Should Contain    4    O
    Click Cell    2    # X plays top-right
    Cell Should Contain    2    X
    # Check win conditions - with more flexible checks
    Run Keyword If     ${DEBUG}    Log To Console    Checking win conditions
    Sleep    1s    # Give time for animations
    Check Win Message    X
    Check X Score    1
    Check O Score    0

Player O Should Win Vertically
    [Documentation]    Test that player O can win by filling a vertical column
    Run Keyword If     ${DEBUG}    Log To Console    Starting Player O Win Vertically test
    # Simple direct approach without intermediate checks
    Click Cell    0    # X plays top-left
    Click Cell    1    # O plays top-middle
    Click Cell    6    # X plays bottom-left
    Click Cell    4    # O plays center
    Click Cell    2    # X plays top-right
    Click Cell    7    # O plays bottom-middle
    # Check win conditions
    Run Keyword If     ${DEBUG}    Log To Console    Checking win conditions
    Sleep    1s    # Give time for animations
    Check Win Message    O
    Check X Score    0
    Check O Score    1

Player X Should Win Diagonally
    [Documentation]    Test that player X can win with a diagonal line
    Run Keyword If     ${DEBUG}    Log To Console    Starting Player X Win Diagonally test
    Click Cell    0    # X plays top-left
    Click Cell    1    # O plays top-middle
    Click Cell    4    # X plays center
    Click Cell    2    # O plays top-right
    Click Cell    8    # X plays bottom-right
    # Check win conditions
    Run Keyword If     ${DEBUG}    Log To Console    Checking win conditions
    Sleep    1s    # Give time for animations
    Check Win Message    X
    Check X Score    1
    Check O Score    0

Game Should End In Draw
    [Documentation]    Test that game can end in a draw
    Run Keyword If     ${DEBUG}    Log To Console    Starting Draw game test
    # Play a game that results in a draw
    Click Cell    0    # X plays top-left
    Click Cell    4    # O plays center
    Click Cell    8    # X plays bottom-right
    Click Cell    2    # O plays top-right
    Click Cell    6    # X plays bottom-left
    Click Cell    3    # O plays middle-left
    Click Cell    5    # X plays middle-right
    Click Cell    7    # O plays bottom-middle
    Click Cell    1    # X plays top-middle
    # Check draw conditions - more flexible check
    Run Keyword If     ${DEBUG}    Log To Console    Checking draw conditions
    Sleep    1s    # Give time for animations
    Check Draw Message
    Check X Score    0
    Check O Score    0

Reset Button Should Start New Round
    [Documentation]    Test that the reset button starts a new round while keeping scores
    Run Keyword If     ${DEBUG}    Log To Console    Starting Reset Game test
    # First win a game
    Click Cell    0    # X plays top-left
    Click Cell    3    # O plays middle-left
    Click Cell    1    # X plays top-middle
    Click Cell    4    # O plays center
    Click Cell    2    # X plays top-right
    # Check X won and got a point
    Run Keyword If     ${DEBUG}    Log To Console    Checking win before reset
    Sleep    1s    # Give time for animations
    Check Win Message    X
    Check X Score    1
    Check O Score    0
    # Now reset the game
    Run Keyword If     ${DEBUG}    Log To Console    Clicking reset button
    Click Button    id=reset-game
    Sleep    1s    # Give time for reset
    # Board should be empty
    Run Keyword If     ${DEBUG}    Log To Console    Checking board is empty
    Board Should Be Empty
    # Scores should be maintained
    Run Keyword If     ${DEBUG}    Log To Console    Checking scores after reset
    Check X Score    1
    Check O Score    0
    # Check next player - may be O (since X won) or X (depending on implementation)
    Check For Valid Turn Status

New Match Button Should Reset Everything
    [Documentation]    Test that the new match button resets both the board and scores
    Run Keyword If     ${DEBUG}    Log To Console    Starting New Match test
    # First win a game
    Click Cell    0    # X plays top-left
    Click Cell    3    # O plays middle-left
    Click Cell    1    # X plays top-middle
    Click Cell    4    # O plays center
    Click Cell    2    # X plays top-right
    # Check X won and got a point
    Run Keyword If     ${DEBUG}    Log To Console    Checking win before new match
    Sleep    1s    # Give time for animations
    Check X Score    1
    Check O Score    0
    # Now start a new match
    Run Keyword If     ${DEBUG}    Log To Console    Clicking new match button
    Click Button    id=new-match
    Sleep    1s    # Give time for reset
    # Board should be empty
    Run Keyword If     ${DEBUG}    Log To Console    Checking board is empty
    Board Should Be Empty
    # Scores should be reset
    Run Keyword If     ${DEBUG}    Log To Console    Checking scores after new match
    Check X Score    0
    Check O Score    0

*** Keywords ***
Open Browser To Game Page
    [Documentation]    Opens browser and navigates to the game page
    Run Keyword If     ${DEBUG}    Log To Console    Opening browser to game page
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Timeout    ${TIMEOUT}
    Wait Until Element Is Visible    css=.tictactoe-board    ${TIMEOUT}
    Run Keyword If     ${DEBUG}    Log To Console    Game page loaded

Reload Page And Wait For Game
    [Documentation]    Reloads the page and waits for game board to be visible
    Run Keyword If     ${DEBUG}    Log To Console    Reloading page
    Reload Page
    Set Selenium Timeout    ${TIMEOUT}
    Wait Until Element Is Visible    css=.tictactoe-board    ${TIMEOUT}
    Sleep    1s    # Allow time for JS to initialize
    Run Keyword If     ${DEBUG}    Log To Console    Page reloaded, game board visible

Click Cell
    [Documentation]    Clicks a cell on the board by index and waits
    [Arguments]    ${index}
    Run Keyword If     ${DEBUG}    Log To Console    Clicking cell ${index}
    ${cell_selector}=    Set Variable    css=.cell[data-index="${index}"]
    Wait Until Element Is Visible    ${cell_selector}    ${TIMEOUT}
    Click Element    ${cell_selector}
    Sleep    0.2s    # Small wait for animations/updates

Cell Should Contain
    [Documentation]    Verifies that a cell contains the expected mark
    [Arguments]    ${index}    ${value}
    Run Keyword If     ${DEBUG}    Log To Console    Checking cell ${index} contains ${value}
    ${cell_mark_selector}=    Set Variable    css=.cell[data-index="${index}"] .mark
    Wait Until Element Is Visible    ${cell_mark_selector}    ${TIMEOUT}
    ${cell_content}=    Get Text    ${cell_mark_selector}
    Run Keyword If     ${DEBUG}    Log To Console    Cell ${index} contains: "${cell_content}"
    Should Be Equal As Strings    ${cell_content}    ${value}

Cell Should Not Contain
    [Documentation]    Verifies that a cell does not contain a specific mark
    [Arguments]    ${index}    ${value}
    Run Keyword If     ${DEBUG}    Log To Console    Checking cell ${index} does not contain ${value}
    ${count}=    Get Element Count    css=.cell[data-index="${index}"] .mark
    Run Keyword If    ${count} > 0    Element Should Not Contain    css=.cell[data-index="${index}"] .mark    ${value}

Check X Score
    [Documentation]    Verifies Player X's score
    [Arguments]    ${expected_score}
    Run Keyword If     ${DEBUG}    Log To Console    Checking Player X score is ${expected_score}
    ${score_element}=    Set Variable    css=.player-x .score
    Wait Until Element Is Visible    ${score_element}    ${TIMEOUT}
    ${actual_score}=    Get Text    ${score_element}
    Run Keyword If     ${DEBUG}    Log To Console    Player X score: ${actual_score}
    Should Be Equal As Strings    ${actual_score}    ${expected_score}

Check O Score
    [Documentation]    Verifies Player O's score
    [Arguments]    ${expected_score}
    Run Keyword If     ${DEBUG}    Log To Console    Checking Player O score is ${expected_score}
    ${score_element}=    Set Variable    css=.player-o .score
    Wait Until Element Is Visible    ${score_element}    ${TIMEOUT}
    ${actual_score}=    Get Text    ${score_element}
    Run Keyword If     ${DEBUG}    Log To Console    Player O score: ${actual_score}
    Should Be Equal As Strings    ${actual_score}    ${expected_score}

Check Win Message
    [Documentation]    Checks if the win message is displayed for the specified player
    [Arguments]    ${player}
    Run Keyword If     ${DEBUG}    Log To Console    Checking win message for Player ${player}
    ${status_element}=    Set Variable    id=game-status
    Wait Until Element Is Visible    ${status_element}    ${TIMEOUT}
    ${status_text}=    Get Text    ${status_element}
    Run Keyword If     ${DEBUG}    Log To Console    Game status text: "${status_text}"
    Should Contain    ${status_text}    Player ${player} wins
    
Check Draw Message
    [Documentation]    Checks if the draw message is displayed
    Run Keyword If     ${DEBUG}    Log To Console    Checking for draw message
    ${status_element}=    Set Variable    id=game-status
    Wait Until Element Is Visible    ${status_element}    ${TIMEOUT}
    ${status_text}=    Get Text    ${status_element}
    Run Keyword If     ${DEBUG}    Log To Console    Game status text: "${status_text}"
    Should Contain    ${status_text}    draw

Check For Valid Turn Status
    [Documentation]    Checks if the turn status shows a valid player's turn
    Run Keyword If     ${DEBUG}    Log To Console    Checking for valid turn status
    ${status_element}=    Set Variable    id=game-status
    Wait Until Element Is Visible    ${status_element}    ${TIMEOUT}
    ${status_text}=    Get Text    ${status_element}
    Run Keyword If     ${DEBUG}    Log To Console    Game status text: "${status_text}"
    # Check for either X or O turn message
    ${contains_x}=    Run Keyword And Return Status    Should Contain    ${status_text}    Player X
    ${contains_o}=    Run Keyword And Return Status    Should Contain    ${status_text}    Player O
    ${valid_turn}=    Evaluate    ${contains_x} or ${contains_o}
    Should Be True    ${valid_turn}    Game status should show either Player X or Player O's turn

Board Should Be Empty
    [Documentation]    Verifies that the board is empty
    Run Keyword If     ${DEBUG}    Log To Console    Checking if board is empty
    ${cells}=    Get WebElements    css=.cell
    ${cell_count}=    Get Length    ${cells}
    Run Keyword If     ${DEBUG}    Log To Console    Found ${cell_count} cells
    
    FOR    ${index}    IN RANGE    ${cell_count}
        ${mark_count}=    Get Element Count    css=.cell[data-index="${index}"] .mark
        Run Keyword If     ${DEBUG}    Log To Console    Cell ${index} has ${mark_count} marks
        Should Be Equal As Integers    ${mark_count}    0    Cell should be empty
    END