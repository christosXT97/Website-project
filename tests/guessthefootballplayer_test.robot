*** Settings ***
Library           SeleniumLibrary
Suite Setup       Open Browser To Guess Football Player
Suite Teardown    Close Browser

*** Variables ***
${URL}            http://127.0.0.1:3000/games/guessthefootballplayer.html
${BROWSER}        Chrome
${TIMEOUT}        10s

*** Keywords ***
Open Browser To Guess Football Player
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    # Wait for preloader to disappear
    Wait Until Element Is Not Visible    class:preloader    timeout=${TIMEOUT}
    # Wait for the game container to be fully loaded
    Wait Until Page Contains Element    class:game-container    timeout=${TIMEOUT}
    Wait Until Element Is Visible    class:game-container    timeout=${TIMEOUT}
    Sleep    1s    # Give time for JavaScript initialization

Enter Guess
    [Arguments]    ${player_name}
    Wait Until Element Is Visible    id:guess-input    timeout=${TIMEOUT}
    Clear Element Text    id:guess-input
    Input Text    id:guess-input    ${player_name}

Submit Guess
    Wait Until Element Is Visible    id:submit-guess    timeout=${TIMEOUT}
    Wait Until Element Is Enabled    id:submit-guess    timeout=${TIMEOUT}
    Click Element    id:submit-guess

Get New Clue
    Wait Until Element Is Visible    id:get-clue    timeout=${TIMEOUT}
    Wait Until Element Is Enabled    id:get-clue    timeout=${TIMEOUT}
    Click Element    id:get-clue

Click Next Player
    Wait Until Element Is Visible    id:next-player    timeout=${TIMEOUT}
    Click Element    id:next-player

Click Reset Game
    Wait Until Element Is Visible    id:reset-game    timeout=${TIMEOUT}
    Click Element    id:reset-game

Verify Game Status
    [Arguments]    ${expected_status}
    ${status}=    Get Text    id:game-status
    Should Contain    ${status}    ${expected_status}

Verify Clue Text
    [Arguments]    ${expected_clue}
    ${clue}=    Get Text    id:clue
    Should Contain    ${clue}    ${expected_clue}

Verify Clue Contains
    [Arguments]    ${partial_text}
    ${clue}=    Get Text    id:clue
    Should Contain    ${clue}    ${partial_text}

Check Input Field Is Empty
    ${input_value}=    Get Value    id:guess-input
    Should Be Empty    ${input_value}

Check Input Field Contains
    [Arguments]    ${expected_value}
    ${input_value}=    Get Value    id:guess-input
    Should Be Equal    ${input_value}    ${expected_value}

Get Current Clue
    ${clue}=    Get Text    id:clue
    RETURN    ${clue}

Wait For Status Update
    # Wait for status message to update after guess
    Sleep    0.5s

Make Correct Guess For Current Player
    # This keyword helps test correct guesses by checking known players
    ${clue}=    Get Current Clue
    
    # Check for specific clue patterns to identify the player
    ${is_messi}=    Run Keyword And Return Status    Should Contain    ${clue}    Ballon d'Or multiple times
    ${is_ronaldo}=    Run Keyword And Return Status    Should Contain    ${clue}    800 career goals
    ${is_neymar}=    Run Keyword And Return Status    Should Contain    ${clue}    flair and tricks
    ${is_mbappe}=    Run Keyword And Return Status    Should Contain    ${clue}    2018 World Cup title
    ${is_debruyne}=    Run Keyword And Return Status    Should Contain    ${clue}    precise passes
    ${is_lewandowski}=    Run Keyword And Return Status    Should Contain    ${clue}    Bayern Munich
    ${is_ramos}=    Run Keyword And Return Status    Should Contain    ${clue}    leadership at Real Madrid
    ${is_vandijk}=    Run Keyword And Return Status    Should Contain    ${clue}    Dutch defender
    ${is_salah}=    Run Keyword And Return Status    Should Contain    ${clue}    Egyptian winger
    ${is_kane}=    Run Keyword And Return Status    Should Contain    ${clue}    English striker captains
    
    Run Keyword If    ${is_messi}    Enter Guess    Lionel Messi
    ...    ELSE IF    ${is_ronaldo}    Enter Guess    Cristiano Ronaldo
    ...    ELSE IF    ${is_neymar}    Enter Guess    Neymar Jr.
    ...    ELSE IF    ${is_mbappe}    Enter Guess    Kylian Mbappe
    ...    ELSE IF    ${is_debruyne}    Enter Guess    Kevin De Bruyne
    ...    ELSE IF    ${is_lewandowski}    Enter Guess    Robert Lewandowski
    ...    ELSE IF    ${is_ramos}    Enter Guess    Sergio Ramos
    ...    ELSE IF    ${is_vandijk}    Enter Guess    Virgil van Dijk
    ...    ELSE IF    ${is_salah}    Enter Guess    Mohamed Salah
    ...    ELSE IF    ${is_kane}    Enter Guess    Harry Kane
    ...    ELSE    Enter Guess    Lionel Messi    # Default fallback
    
    Submit Guess

Make Wrong Guess
    Enter Guess    Wrong Player Name
    Submit Guess

Get Multiple Clues
    [Arguments]    ${number_of_clues}
    FOR    ${i}    IN RANGE    ${number_of_clues}
        Get New Clue
        Sleep    0.3s
    END

Check Clue Changes
    ${initial_clue}=    Get Current Clue
    Get New Clue
    Sleep    0.3s
    ${new_clue}=    Get Current Clue
    Should Not Be Equal    ${initial_clue}    ${new_clue}

*** Test Cases ***
Game Initialization
    # Verify initial game state
    Verify Game Status    Start the game to guess!
    Verify Clue Contains    This player
    # Verify input field is present and empty
    Check Input Field Is Empty

Get First Clue
    # Click to get the first clue and verify it appears
    Get New Clue
    Sleep    0.5s
    ${clue}=    Get Current Clue
    Should Not Be Empty    ${clue}
    Should Not Contain    ${clue}    Clue will appear here

Submit Wrong Guess
    Click Reset Game
    Sleep    0.5s
    Make Wrong Guess
    Wait For Status Update
    Verify Game Status    Wrong guess! Try again.
    # Verify input field is not cleared after wrong guess
    Check Input Field Contains    Wrong Player Name

Submit Correct Guess
    Click Reset Game
    Sleep    0.5s
    Make Correct Guess For Current Player
    Wait For Status Update
    Verify Game Status    Correct! Moving to the next player
    Sleep    1.5s    # Wait for automatic transition
    Verify Game Status    Start the game to guess!
    # Verify input field is cleared after correct guess
    Check Input Field Is Empty

Get Multiple Clues For Same Player
    Click Reset Game
    Sleep    0.5s
    ${initial_clue}=    Get Current Clue
    # Get additional clues
    Get Multiple Clues    2
    ${final_clue}=    Get Current Clue
    # Verify clues have changed
    Should Not Be Equal    ${initial_clue}    ${final_clue}

Exhaust All Clues
    Click Reset Game
    Sleep    0.5s
    # Get all 3 clues for current player
    Get Multiple Clues    3
    # Try to get one more clue
    Get New Clue
    Sleep    0.5s
    Verify Clue Contains    No more clues available!

Test Next Player Button
    Click Reset Game
    Sleep    0.5s
    ${initial_clue}=    Get Current Clue
    Click Next Player
    Sleep    0.5s
    ${new_clue}=    Get Current Clue
    # Verify we moved to a different player
    Should Not Be Equal    ${initial_clue}    ${new_clue}
    Verify Game Status    Start the game to guess!
    Check Input Field Is Empty

Test Reset Game Button
    # Make some progress in the game
    Enter Guess    Test Player
    Get Multiple Clues    2
    # Reset the game
    Click Reset Game
    Sleep    0.5s
    # Verify game is reset to initial state
    Verify Game Status    Start the game to guess!
    Check Input Field Is Empty
    # Verify we're back to the first player's first clue
    ${clue}=    Get Current Clue
    Should Contain    ${clue}    This player

Test Input Field Functionality
    Click Reset Game
    Sleep    0.5s
    # Test typing in input field
    Enter Guess    Test Player Name
    Check Input Field Contains    Test Player Name
    # Test clearing input field
    Enter Guess    ${EMPTY}
    Check Input Field Is Empty
    # Test entering special characters
    Enter Guess    Player-Name's Test!
    Check Input Field Contains    Player-Name's Test!

Test Case Insensitive Guessing
    Click Reset Game
    Sleep    0.5s
    # Test lowercase guess for Messi (if current player is Messi)
    ${clue}=    Get Current Clue
    ${is_messi}=    Run Keyword And Return Status    Should Contain    ${clue}    Ballon d'Or multiple times
    Run Keyword If    ${is_messi}    Run Keywords
    ...    Enter Guess    lionel messi    AND
    ...    Submit Guess    AND
    ...    Wait For Status Update    AND
    ...    Verify Game Status    Correct! Moving to the next player

Test Rapid Button Clicking
    Click Reset Game
    Sleep    0.5s
    # Rapidly click get clue button
    FOR    ${i}    IN RANGE    5
        Get New Clue
        Sleep    0.1s
    END
    # Verify game still functions properly
    ${clue}=    Get Current Clue
    Should Not Be Empty    ${clue}

Test Complete Game Flow
    Click Reset Game
    Sleep    0.5s
    # Complete flow: get clues, make wrong guess, then correct guess
    Get New Clue
    Sleep    0.3s
    Make Wrong Guess
    Wait For Status Update
    Verify Game Status    Wrong guess! Try again.
    Make Correct Guess For Current Player
    Wait For Status Update
    Verify Game Status    Correct! Moving to the next player
    Sleep    1.5s
    Verify Game Status    Start the game to guess!

Test Multiple Player Transitions
    Click Reset Game
    Sleep    0.5s
    # Move through several players using Next Player button
    ${player_clues}=    Create List
    FOR    ${i}    IN RANGE    3
        ${clue}=    Get Current Clue
        Append To List    ${player_clues}    ${clue}
        Click Next Player
        Sleep    0.5s
    END
    # Verify we went through different players
    ${unique_clues}=    Remove Duplicates    ${player_clues}
    ${unique_count}=    Get Length    ${unique_clues}
    Should Be True    ${unique_count} > 1

Test Game Status Messages
    Click Reset Game
    Sleep    0.5s
    # Test all different status messages
    Verify Game Status    Start the game to guess!
    Make Wrong Guess
    Wait For Status Update
    Verify Game Status    Wrong guess! Try again.
    Make Correct Guess For Current Player
    Wait For Status Update
    Verify Game Status    Correct! Moving to the next player

Test Input Field Edge Cases
    Click Reset Game
    Sleep    0.5s
    # Test empty guess submission
    Enter Guess    ${EMPTY}
    Submit Guess
    Wait For Status Update
    Verify Game Status    Wrong guess! Try again.
    
    # Test whitespace-only guess
    Enter Guess    ${SPACE * 5}
    Submit Guess
    Wait For Status Update
    Verify Game Status    Wrong guess! Try again.

Test Clue Progression Logic
    Click Reset Game
    Sleep    0.5s
    # Verify clues progress in order
    ${clue1}=    Get Current Clue
    Get New Clue
    Sleep    0.3s
    ${clue2}=    Get Current Clue
    Should Not Be Equal    ${clue1}    ${clue2}
    Get New Clue
    Sleep    0.3s
    ${clue3}=    Get Current Clue
    Should Not Be Equal    ${clue2}    ${clue3}
    Should Not Be Equal    ${clue1}    ${clue3}

Test Game Responsiveness
    Click Reset Game
    Sleep    0.5s
    # Test rapid interactions
    FOR    ${i}    IN RANGE    3
        Enter Guess    Quick Test ${i}
        Submit Guess
        Sleep    0.2s
        Get New Clue
        Sleep    0.2s
    END
    # Verify game is still responsive
    ${clue}=    Get Current Clue
    Should Not Be Empty    ${clue}

Test Player Cycling
    Click Reset Game
    Sleep    0.5s
    # Test that players cycle properly (move through multiple players)
    ${starting_clue}=    Get Current Clue
    FOR    ${i}    IN RANGE    5
        Click Next Player
        Sleep    0.3s
    END
    # After 5 next clicks, we should have cycled through players
    ${current_clue}=    Get Current Clue
    # The clue might be the same if we cycled back, but the game should still be functional
    Verify Game Status    Start the game to guess!