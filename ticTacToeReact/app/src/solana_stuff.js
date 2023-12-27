import {
    Keypair, Connection, clusterApiUrl,
    LAMPORTS_PER_SOL, RpcResponseAndContext, SignatureResult
} from "@solana/web3.js";

import secret_x_json from "./keypair/player_x.json";
import secret_o_json from "./keypair/player_o.json";
import secret_token_owner_json from "./keypair/token_owner.json";

export const Participants = Object.freeze({
    X: Symbol("x"),
    O: Symbol("o"),
    TOKEN_OWNER: Symbol("token_owner")
});

/**
 * Get the keypair of the participant.
 * @param {Participants} f_participant
 * @returns {Keypair}
 */
export function getKp(f_participant) {
    let kp;
    switch (f_participant) {
        case Participants.X:
            const secret_x_a_u8 = Uint8Array.from(secret_x_json);
            kp = Keypair.fromSecretKey(secret_x_a_u8);
            break;
        case Participants.O:
            const secret_o_a_u8 = Uint8Array.from(secret_o_json);
            kp = Keypair.fromSecretKey(secret_o_a_u8);
            break;
        case Participants.TOKEN_OWNER:
            const secret_token_owner_a_u8 = Uint8Array.from(secret_token_owner_json);
            kp = Keypair.fromSecretKey(secret_token_owner_a_u8);
            break;
        default:
            throw "Unexpected argument. Needs to be of type 'Participant'.";
    }
    return kp;
}

export const SolanaConnections = Object.freeze({
    TESTNET: Symbol("testnet"),
    DEVNET: Symbol("devnet"),
    LOCAL: Symbol("local"),
});

/**
 * Get connection to Solana cluster
 * @param {SolanaConnections} f_solana_connection 
 * @returns {Connection}
 */
export function getSolanaConnection(f_solana_connection) {
    let url;
    switch (f_solana_connection) {
        case SolanaConnections.TESTNET:
            url = clusterApiUrl("testnet");
            break;
        case SolanaConnections.DEVNET:
            url = clusterApiUrl("devnet");
            break;
        case SolanaConnections.LOCAL:
            url = "http://localhost:8899";
            break;
        default:
            throw "Unexpected argument. Needs to be of type 'SolanaConnections'.";
    }
    const connection = new Connection(url);
    return connection;
}

/**
 * Check balance of account and airdrop if amount too low
 * @param {Keypair} f_kp 
 * @param {Connection} f_connection 
 * @returns {number}
 */
export async function checkBalanceAndAirdropIfNeeded(f_kp, f_connection) {
    let balance;
    try {
        balance = await f_connection.getBalance(f_kp.publicKey);
        console.log("Inital balance: ", balance);
        if (balance < LAMPORTS_PER_SOL) {
            // Request airdrop
            let airdrop_signature = await f_connection.requestAirdrop(
                f_kp.publicKey,
                2 * LAMPORTS_PER_SOL
            );
    
            const latest_block_hash = await f_connection.getLatestBlockhash();
    
            await f_connection.confirmTransaction({
            blockhash: latest_block_hash.blockhash,
            lastValidBlockHeight: latest_block_hash.lastValidBlockHeight,
            signature: airdrop_signature,
            });

            balance = await f_connection.getBalance(f_kp.publicKey);
        }
    } catch (e) {
        console.log(e);
    }
    
    return balance;


    // TODO:
    // let mint = await splToken.Token.createMint(connection, myKeypair, myKeypair.publicKey, null, 9, splToken.TOKEN_PROGRAM_ID);
    //
    // Get the token accont of this solana address, if it does not exist, create it
    // myToken = await mint.getOrCreateAssociatedAccountInfo(myKeypair.publicKey);
    //
    // Check if enough tokens are available, if not -> Mint 100 new tokens to the token address we just created
    // await mint.mintTo(myToken.address, myKeypair.publicKey, [], 1000000000);
  }