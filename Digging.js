const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let isDigging = false;

const dig = async (bot) => {
  try {
    while (isDigging) {
      const block = bot.blockAtCursor(5);

      if (!block) {
        await sleep(100);
      } else {
        await bot.dig(block, "игнор блок", "игнор блок2");
      }
    }
  } catch (error) {
    console.error("An error occurred while digging:", error);
  }
};

module.exports = {
  dig,
  setIsDigging: (value) => { isDigging = value; },
};