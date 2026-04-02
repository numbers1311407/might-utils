## Might Utils

Going through a bit of a pivot, updating soon.

### Todos

- rethink the party finder result format and memory usage during recursion. There are a relatively
  small set of roster characters in memory which could just be referencded by sorted arrays of ids,
  instead of copying them many thousands of times.
  
### Tag rules and functionality rework

1. Rules become set of "and" and/or "or" tag sets, we can use react query builder. Most rules will
be simple but this will allow for arbtrary complexity. some examples (users can go as convoluted
as they desire, and the UI should be intuitive enough for them to understand implicitly)

((char=geese) and (warden=1 or warden=2)) or (char=snarf and warden=2))
(tagged=dps and tagged=petclass)
(level=67 and warden=2) or level=68 or level=69

2. Each of these rules also has a range. We may minimally validate that rules are impossible with
   certain counts, or we may not. This would detect itself for us in searches without having to
   analyze the combination, as we would just warn up front if no characters pass a given rule, to
   make it easier to identify why results are limited.

3. In the finder, we optimize by going through every rule in the whole set gainst every character
   in the pool, and track in a map of refs to each character. So essentially each rule knows which
   roster characters pass before the recursion even starts. Some preoptimization might be done here,
   and importantly we should probably report here on rules zero or perhaps very few characters
   pass, to help users understand rules that might be problematic.
   
4. Finally when we get to checking parties, each rule at that size range counts every slot that
   has passed their test to ensure it's in it's range.  This is just O(n) partyIds.has(slotId) til
   the count reaches min range (and stays in it, if there's a max).  This is far less counting and
   should be a lot faster. 1 pass over each rule with 1 likely shot circuited pass over their passed
   slots.
   
This seems like a big win for both UX and performance.

### Potential Feature Roadmap

- react-query for a caching layer for results

  May or may not be worthwhile as the queries are so configuration heavy, but at a minimum it
  would debounce rapid finds triggered by extra renders for free
