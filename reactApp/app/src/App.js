import logo from './logo.svg';
import './App.css';
import { Keypair, Connection, PublicKey, Cluster, clusterApiUrl,
  LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction
} from "@solana/web3.js";

import * as buffer from "buffer";

import kp_a from "./keypair/keypair_a.json";
import kp_b from "./keypair/keypair_b.json";

window.Buffer = buffer.Buffer;

// Basic connection test
console.log("Basic connection test ...");
let health = await fetch('http://localhost:8899', {
  method: "POST",
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "getHealth"
  }),
  headers: {
    "Content-Type": "application/json"
  }
});
console.log("Health: ", health);

// Select Solana cluster
const SOLANA_CLUSTER_TESTNET = "testnet";
const network_testnet = clusterApiUrl(SOLANA_CLUSTER_TESTNET);
const SOLANA_CLUSTER_LOCAL = "http://localhost:8899";

// Use existing keypair
const secret_a = Uint8Array.from(kp_a);
const restored_kp_a = Keypair.fromSecretKey(secret_a);
console.log("Existing key: ", restored_kp_a);
console.log("Existing pub key: ", restored_kp_a.publicKey.toString());
// Create connection to cluster
let connection = new Connection(SOLANA_CLUSTER_LOCAL);
console.log("Connection: ", connection);
// Test connection
let block_height = await connection.getBlockHeight();
console.log("Block height: ", block_height);
// Airdrop some sol to the account
let airdropSignature = await connection.requestAirdrop(
  restored_kp_a.publicKey,
  2 * LAMPORTS_PER_SOL
);
console.log("Signature: ", airdropSignature);
let transaction_confirmation = await connection.confirmTransaction({ signature: airdropSignature });
console.log("Confirmation: ", transaction_confirmation);
// Check account. This takes a while to be updated!
let account_a = await connection.getAccountInfo(restored_kp_a.publicKey);
console.log("A: ", account_a);
// Transfer sol from A to B
const secret_b = Uint8Array.from(kp_b);
const restored_kp_b = Keypair.fromSecretKey(secret_b);
let account_b = await connection.getAccountInfo(restored_kp_b.publicKey);
console.log("B: ", account_b);
let transaction = new Transaction();
transaction.add(
  SystemProgram.transfer({
    fromPubkey: restored_kp_a.publicKey,
    toPubkey: restored_kp_b.publicKey,
    lamports: LAMPORTS_PER_SOL,
  }),
);
let result = await sendAndConfirmTransaction(connection, transaction, [restored_kp_a]);
console.log("Transaction result: ", result);
account_b = await connection.getAccountInfo(restored_kp_b.publicKey);
console.log("B after transfer: ", account_b);

const GetBalance = async(f_pubkey) => {
  let balance = await connection.getBalance(f_pubkey);
  console.log("Balance: ", balance);
  return (
    <div>
      <button>Test</button>
      <p>balance</p>
    </div>
  );
}

async function request_airdrop_to(f_pubkey, f_amount_sol) {
  let airdropSignature = await connection.requestAirdrop(
    f_pubkey,
    f_amount_sol * LAMPORTS_PER_SOL
  );
  return connection.confirmTransaction({ signature: airdropSignature });
}

async function transfer_from_a_to_b_sol(f_a_pk, f_b_pk, f_amount_sol) {
  let transaction = new Transaction();
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: f_a_pk,
      toPubkey: f_b_pk,
      lamports: f_amount_sol * LAMPORTS_PER_SOL,
    }),
  );
  return sendAndConfirmTransaction(connection, transaction, [f_a_pk]);
}

//let balance_b = await get_account_balance(restored_kp_b.publicKey);
//console.log(balance_b);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Solana Playground
        </p>
      </header>
      <div>
        {/* Continue with button here */}
      </div>
    </div>
  );
}

export default App;
