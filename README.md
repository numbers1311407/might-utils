## Might Utils

Work in progress companion app for EQ Might, providing a set of tools to make your might experience more convenient, helping to figure out the might score you need and then helping to
manage parties that satisfy that score.

### FINAL Release checklist
- **Help Modal**
  - The entire help page should live in a modal, which opens to the current page help via routing
  - Then we put a help ? button in the header
  - On first routing to a page it will auto-open help if it exists, once, track this
  - Include footer link to stop auto-showing help, on check, save the setting and show a confirmation dialog pointing out the help icon.
  - The modal could include screenshots, etc. It should try to be comprehensive.
  **404 page**
  - A dead simple 404 page, no frills. 404 link to home.
- **Instance Data**
  - Do one more round of research for lower tier dungeons, trios, duos
  
### Post MVP Roadmap

- **Known Bugs**
  - "Copy" forms with name validation fail silently if the name duplication suffix makes the attribute invalid
- **Generator Rules Transparencys**
  - The rules feel like a black box in the generator as all you have to go on is name, and worse, rulesets are combined and you have no
    high level view of ruels at each group size like you do per ruleset in the rules editor, even if you leave the search to inspect it.
  - There needs to be a rules breakdown on the search page, likely very similar to the ruleset editor view, probably in a tab.
- **Party Undo**
  - Implement undo for party changes
  - Use GFS backup rotation for previous snapshots and allow users to go "back", or back 10 minutes, back and hour, etc.
- **Roster tags form squish**
  - Move the tag forms to the roster page and kill the tags editor
- **Multiple: for finder purposes each warden rank should be opt-in**
  - Character warden options shouldn't be a fixed range, it should be possible to toggle specific warden levels on or off. This would be possible with the reintroduction of name rules but it would be a very clunky and expensive approach for what should be a reduction in complexity via voluntary pool shrinking.
- **Roster negative tags**
  - Add a 2nd hidden tags array to chars for "negative tags" allowing a revert of class tags
  - These tags are never shown to the user but are used to scrub the tag list of class tags for use/display
  - The tag input just makes the class tags toggleable, when they're toggled off that inserts the negative tag
- **TagsInput Autocomplete**
  - Combobox behavior for the TagsInput that has a searchable list of all applied tags collected from class tags & roster
- **Roster: Alt tags**
  - Allow a toggle of a 2nd tag set which functions as an alternate character which can itself be activated or deactivate in the roster
  - Negative tags feels natural for this it's very likely the alt character will have unorthodoxed tags
 
### Nice to haves (future work)

- **Tag Rules: Prettify**
  - decorate the rules human output with JSX to colorize keywords and so on.
  - RQB has NO validation. it should at least test for blank fields and no rules.
- **Roster: Character portraits**
  - baldur's gate style 2 portrait options to use in small UI besides the class icons to
    distinguish between members of the same class. There are plenty of places where you want
    to show a list of party characters which would love a more concise way to display them
    not reliant on hover behavior. Having a library of various D&D class looking icons to
    select from (or even to "upload" your own) would be very cool for this.
- **Multiple: Might Button QoL**
  - bigger increment buttons for the might inputs +100/-100, etc, this will be
    particularly useful on the calculator pages where people are fishing and wanting
    to just click buttons.
