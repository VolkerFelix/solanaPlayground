import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { GameRecord } from "../target/types/game_record";
import { expect } from "chai";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";

describe("game-record", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.GameRecord as Program<GameRecord>;
  const programProvider = program.provider as anchor.AnchorProvider;

  it("Setup game and reset it!", async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = programProvider.wallet;
    const playerTwo = anchor.web3.Keypair.generate();
    await program.methods
      .setupGame()
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
        playerTwo: playerTwo.publicKey,
      })
      .signers([playerTwo, gameKeypair]) // gameKeypair: New game account is created and this needs to be signed.
      .rpc()

    let gameState = await program.account.game.fetch(gameKeypair.publicKey);
    expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey]);
    expect(gameState.state).to.eql({ active: {} });

    await program.methods
      .resetGame()
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
        playerTwo: playerTwo.publicKey,
      })
      .signers([playerTwo]) // Signer is playerOne, which is the program provider and automatically signs all transactions
      .rpc()

      gameState = await program.account.game.fetch(gameKeypair.publicKey);
      expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey]);
      expect(gameState.state).to.eql({ notStarted: {} });
  });

  it("Setup game and win it!", async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = programProvider.wallet;
    const playerTwo = anchor.web3.Keypair.generate();
    await program.methods
      .setupGame()
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
        playerTwo: playerTwo.publicKey,
      })
      .signers([playerTwo, gameKeypair]) // gameKeypair: New game account is created and this needs to be signed.
      .rpc()

    let gameState = await program.account.game.fetch(gameKeypair.publicKey);
    expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey]);
    expect(gameState.state).to.eql({ active: {} });

    await program.methods
      .wonGame(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
        playerTwo: playerTwo.publicKey,
      })
      .signers([playerTwo]) // Signer is playerOne, which is the program provider and automatically signs all transactions
      .rpc()

      gameState = await program.account.game.fetch(gameKeypair.publicKey);
      expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey]);
      expect(gameState.state).to.eql({ won: { winner: playerTwo.publicKey } });
  });

  it("Setup game, tie and reset it!", async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = programProvider.wallet;
    const playerTwo = anchor.web3.Keypair.generate();
    await program.methods
      .setupGame()
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
        playerTwo: playerTwo.publicKey,
      })
      .signers([playerTwo, gameKeypair]) // gameKeypair: New game account is created and this needs to be signed.
      .rpc()

    let gameState = await program.account.game.fetch(gameKeypair.publicKey);
    expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey]);
    expect(gameState.state).to.eql({ active: {} });

    await program.methods
      .tieGame()
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
        playerTwo: playerTwo.publicKey,
      })
      .signers([playerTwo]) // Signer is playerOne, which is the program provider and automatically signs all transactions
      .rpc()

      gameState = await program.account.game.fetch(gameKeypair.publicKey);
      expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey]);
      expect(gameState.state).to.eql({ tie: {} });

      await program.methods
      .resetGame()
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
        playerTwo: playerTwo.publicKey,
      })
      .signers([playerTwo]) // Signer is playerOne, which is the program provider and automatically signs all transactions
      .rpc()

      gameState = await program.account.game.fetch(gameKeypair.publicKey);
      expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey]);
      expect(gameState.state).to.eql({ notStarted: {} });
  });
});
