import {
    Keypair, Connection, clusterApiUrl,
    LAMPORTS_PER_SOL,
    PublicKey
} from "@solana/web3.js";
import * as splToken from "@solana/spl-token";


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
}

/**
 * Init a new mint and an associanted token account
 * @param {Connection} f_connection 
 * @param {Keypair} f_token_owner 
 * @returns {[PublicKey, PublicKey]} PK of mint and token account
 */
export async function initMintAndTokenAccount(f_connection, f_token_owner) {
    let mint_pk;
    let token_account_pk;
    try {
        mint_pk = await splToken.createMint(
            f_connection,
            f_token_owner,
            f_token_owner.publicKey,
            null,
            9
        );
        console.log("Mint PK: ", mint_pk.toString());
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log("Waited 3s");
        token_account_pk = await splToken.getOrCreateAssociatedTokenAccount(
            f_connection,
            f_token_owner,
            mint_pk,
            f_token_owner.publicKey,
        );
    } catch (e) {
        console.log(e);
    }
    return [mint_pk, token_account_pk];
}

/**
 * Check amount of tokens in account and mint more if needed
 * @param {Connection} f_connection 
 * @param {Keypair} f_token_owner 
 * @param {PublicKey} f_mint_pk 
 * @param {PublicKey} f_token_account_pk 
 * @returns {number} Token amount
 */
export async function checkTokenAmountAndMintIfNeeded(f_connection, f_token_owner, f_mint_pk, f_token_account_pk) {
    let token_balance = await f_connection.getTokenAccountBalance(f_token_account_pk);
    if (token_balance < 5) {
        let mint_signature = await splToken.mintTo(
            f_connection,
            f_token_owner,
            f_mint_pk,
            f_token_account_pk,
            f_token_owner,
            2
        );

        const latest_block_hash = await f_connection.getLatestBlockhash();
        await f_connection.confirmTransaction({
        blockhash: latest_block_hash.blockhash,
        lastValidBlockHeight: latest_block_hash.lastValidBlockHeight,
        signature: mint_signature,
        });

        token_balance = await f_connection.getTokenAccountBalance(f_token_account_pk);
    }
    return token_balance;
}
