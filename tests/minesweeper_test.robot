*** Settings ***
Library           SeleniumLibrary
Suite Setup       Open Browser To Minesweeper
Suite Teardown    Close Browser

*** Variables ***
${URL}            http://127.0.0.1:3000/games/minesweeper.html
${BROWSER}        Chrome
${TIMEOUT}        10s

*** Keywords ***
Open Browser To Minesweeper
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    # Wait for preloader to disappear
    Wait Until Element Is Not Visible    class:preloader    timeout=${TIMEOUT}
    # Wait for the board to be fully loaded
    Wait Until Page Contains Element    id:minesweeper-board    timeout=${TIMEOUT}
    Wait Until Element Is Visible    id:minesweeper-board    timeout=${TIMEOUT}
    Sleep    1s    # Give a bit more time for any animations to complete

Click Cell
    [Arguments]    ${index}
    # Ensure the cell is clickable
    Wait Until Element Is Visible    xpath=(//div[@id="minesweeper-board"]/div)[${index}]    timeout=${TIMEOUT}
    Wait Until Element Is Enabled    xpath=(//div[@id="minesweeper-board"]/div)[${index}]    timeout=${TIMEOUT}
    # Create a JavaScript executor to click the cell
    Execute JavaScript    document.querySelectorAll('#minesweeper-board .cell')[${index} - 1].click()

Flag Cell
    [Arguments]    ${index}
    # Use JavaScript to simulate right-click
    Execute JavaScript    
    ...    const cell = document.querySelectorAll('#minesweeper-board .cell')[${index} - 1];
    ...    const event = new MouseEvent('contextmenu', {
    ...        bubbles: true,
    ...        cancelable: true,
    ...        view: window,
    ...        button: 2,
    ...        buttons: 2
    ...    });
    ...    cell.dispatchEvent(event);

Click Reset
    Wait Until Element Is Visible    id:reset-minesweeper    timeout=${TIMEOUT}
    Click Element    id:reset-minesweeper

Change Difficulty
    [Arguments]    ${difficulty}
    Wait Until Element Is Visible    id:difficulty    timeout=${TIMEOUT}
    Select From List By Value    id:difficulty    ${difficulty}

Verify Game Status
    [Arguments]    ${expected_status}
    ${status}=    Get Text    id:minesweeper-status
    Should Contain    ${status}    ${expected_status}

Check Cell Is Revealed
    [Arguments]    ${index}
    ${class}=    Execute JavaScript    return document.querySelectorAll('#minesweeper-board .cell')[${index} - 1].classList.contains('revealed')
    Should Be True    ${class}

Check Cell Has Flag
    [Arguments]    ${index}
    ${class}=    Execute JavaScript    return document.querySelectorAll('#minesweeper-board .cell')[${index} - 1].classList.contains('flag')
    Should Be True    ${class}

Check Cell Value
    [Arguments]    ${index}    ${expected_value}
    ${value}=    Execute JavaScript    return document.querySelectorAll('#minesweeper-board .cell')[${index} - 1].getAttribute('data-value')
    Should Be Equal    ${value}    ${expected_value}

Continue Playing
    # Continue clicking cells if game hasn't ended
    FOR    ${i}    IN RANGE    2    10
        Click Cell    ${i}
        Sleep    0.5s
        ${status}=    Get Text    id:minesweeper-status
        Exit For Loop If    '${status}'=='💥 Game Over!' or '${status}'=='🎉 You Win!'
    END

*** Test Cases ***
Start A Basic Game
    # Wait for the board to be fully loaded and interactive
    Sleep    1s
    Click Cell    1
    Sleep    0.5s
    Click Cell    2
    Sleep    0.5s
    # Verify first cell is revealed
    Check Cell Is Revealed    1

Flag A Cell
    Click Reset
    Sleep    0.5s
    Flag Cell    3
    Sleep    0.5s
    Check Cell Has Flag    3

Change Game Difficulty
    Change Difficulty    easy
    Sleep    0.5s
    # Verify mines count is updated for easy difficulty (10 mines)
    Page Should Contain    💣 Mines: 10

Play Until Win Or Loss
    Click Reset
    Sleep    0.5s
    # Click multiple cells to either win or encounter a mine
    Click Cell    1
    Sleep    0.5s
    # Check if game has ended
    ${status}=    Get Text    id:minesweeper-status
    Run Keyword If    '${status}'=='💥 Game Over!'    Log    Game lost - mine hit
    ...    ELSE IF    '${status}'=='🎉 You Win!'    Log    Game won
    ...    ELSE    Continue Playing

Continue Playing
    # Continue clicking cells if game hasn't ended
    FOR    ${i}    IN RANGE    2    10
        Click Cell    ${i}
        Sleep    0.5s
        ${status}=    Get Text    id:minesweeper-status
        Exit For Loop If    '${status}'=='💥 Game Over!' or '${status}'=='🎉 You Win!'
    END