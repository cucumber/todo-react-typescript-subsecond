Feature: Todo

  Scenario: Create Todo
    Given there is already 1 todo
    When Sam adds "get milk"
    Then Sam should see "get milk" at the top

  Scenario: Create Todo II
    Given there are already 2 todos
    When Sam adds "get milk"
    Then Sam should see "get milk" at the top

  Scenario: Create Todo III
    Given there are already 3 todos
    When Sam adds "get milk"
    Then Sam should see "get milk" at the top
