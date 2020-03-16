Feature: Todo

  Scenario: Create Todo
    Given there is already 1 todo
    When I add "get milk"
    Then the text of the 2nd todo should be "get milk"
