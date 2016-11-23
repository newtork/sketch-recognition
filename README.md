# Sketch Recognition
*A testing ground for various sequence matching algorithms.*

## Milestones

A simple list to keep myself reminded.

### Done

☑ User/Web prototype for free data input
 * Make 2D drawing generally accessible to algorithms, by substituting plane/space coordinates to discrete angular information.
 * Use the advantage of not caring about initial input rotation or continous input sampling or scale.


![Explanation so far](https://raw.githubusercontent.com/newtork/sketch-recognition/master/01-userinput-canvas/canvas-input.png)

*red:* user drawn path

*blue:* delayed projection at every node of path

(*turquoise:* distance between nodes)

---

### Upcoming
 * Fully implement multi-dimensional featureset.

☐ Record matchable patterns
 * [Das Haus vom Nikolaus](https://de.wikipedia.org/wiki/Haus_vom_Nikolaus)
 * Numbers 0-9
 * Alphabet A-Za-z

☐ Write sequence matching algorithm: DTW
 * "walking" approach (online, dynamic programming, no matrices)
 * "accelerated" approach (skip overweighted values)
 * "multisample" approach (fuzzy detection)
 
☐ Consider other algorithms
 * LCS
 
☐ Output and status reports
 * offline - website / html
 * online - SOAP, JSON
