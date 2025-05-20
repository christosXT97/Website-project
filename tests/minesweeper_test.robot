*** Settings ***
Library           SeleniumLibrary
Suite Setup       Open Browser To Minesweeper
Suite Teardown    Close Browser

*** Variables ***
${URL}            http://127.0.0.1:3000/games/minesweeper.html

*** Keywords ***
Open Browser To Minesweeper
    Open Browser    ${URL}    Chrome
    Maximize Browser Window
    Wait Until Page Contains Element    id:minesweeper-board

Click Cell
    Click Element    xpath=//div[@id="minesweeper-board"]/div[1]

Click Reset And Verify
    Click Element    id:reset-minesweeper
    Page Should Contain    Minesweeper

*** Test Cases ***
Start A Basic Game
    Click Cell
    Click Element    xpath=//div[@id="minesweeper-board"]/div[2]

Reset Game
    Click Reset And Verify

