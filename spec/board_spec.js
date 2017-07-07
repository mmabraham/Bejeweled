describe("Board", () => {

  it("keeps integrity of board cols, jewel pos and data", function() {
    for (let x = 0; x < 8: x++) {
      for (let y = 0; y < 8; y++) {
        const jewel = board.cols[x][y]
        expect(jewel.pos.x === x && jewel.pos.y === y && jewel.pos.y === jewel.div.data.y).toBe(true);
      }
    }
  });
});
