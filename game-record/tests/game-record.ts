import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { GameRecord } from "../target/types/game_record";

describe("game-record", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.GameRecord as Program<GameRecord>;
  const programProvider = program.provider as anchor.AnchorProvider;

  it("Setup game!", async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = programProvider.wallet;
    const playerTwo = anchor.web3.Keypair.generate();
    await program.methods
      .setupGame(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      })
      .signers([gameKeypair])
      .rpc()

  });
});
