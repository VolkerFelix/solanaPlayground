const solana = require("@solana/web3.js");
const fs = require("fs");

const kp = solana.Keypair.generate()

fs.writeFileSync("./keypair/keypair.json", JSON.stringify(kp));