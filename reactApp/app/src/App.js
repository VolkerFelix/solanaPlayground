import logo from './logo.svg';
import './App.css';
import { Keypair, Connection, PublicKey, Cluster, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

import kp from "./keypair/keypair.json"

// Debug
console.log("Debugging ...")
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
const secret = Uint8Array.from(kp)
const restored_kp = Keypair.fromSecretKey(secret);
console.log("Existing key: ", restored_kp)
console.log("Existing pub key: ", restored_kp.publicKey.toString())
// Create connection to cluster
let connection = new Connection(SOLANA_CLUSTER_LOCAL);
console.log("Connection: ", connection);
// Test
let test = await connection.getBlockHeight();
console.log("Block height: ", test);
// Airdrop some sol to the account
let airdropSignature = await connection.requestAirdrop(
  restored_kp.publicKey,
  2 * LAMPORTS_PER_SOL
);
console.log("Signature:", airdropSignature);
let transaction_confirmation = await connection.confirmTransaction({ signature: airdropSignature });
console.log("Confirmation: ", transaction_confirmation)
// Check account. This takes a while to be updated!
let balance = await connection.getAccountInfo(restored_kp.publicKey);
console.log(balance)

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
