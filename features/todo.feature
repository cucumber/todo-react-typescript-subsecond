Feature: Todo

  Scenario: Create Todo
    Given Sam has already added 1 todo
    When Sam adds "get milk"
    Then Sam should see "get milk" at the top

