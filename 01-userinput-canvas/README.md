## Notes

Consideration:
- Input buffer and vector dimension have constant sizes.
- Give feedback starting from the first vector on.
- For every continuous vector (node in path), use O(1) update-operations.
- Web/HTML coordinates, inversed y-axis: x↦ y↧



History:
 * ~~Calculate linear regression for every vector.~~
  * easy solution only in functional 2D (with special cases)
  * impractical calculation for more dimensions
 * ~~Calculate average node and average progression vector~~
  * faster and easier algorithm
  * complexity linear to dimension
 * Just calculate average node
  * substitude dedicated computation for **average progression vector**
  * use difference of *current* and *previous* **average node**

---

### Determine path rotation

In 2D:

Q1 x↑ y↓ | Q2 x↑ y↑
-------- | --------
**Q4 x↓ y↓** | **Q3 x↓ y↑**


Observe quadrant-movement:
- Clockwise **⟳** ..→ 4 → 1 → 2 → 3 → 4 → 1 →..
- Counterclockwise **⟲** ..→ 4 → 3 → 2 → 1 → 4 → 3 →..
