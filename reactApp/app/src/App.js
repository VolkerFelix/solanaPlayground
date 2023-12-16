import logo from './logo.svg';
import './App.css';
import { Keypair, Connection, PublicKey, Cluster, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Select Solana cluster
const SOLANA_CLUSTER = "testnet"
const network = clusterApiUrl(SOLANA_CLUSTER);
// Create new keypair
let keypair = Keypair.generate();
console.log("Pub key: ", keypair.publicKey.toString())
// Create connection
let connection = new Connection('http://172.17.0.1:8899', 'confirmed')
//let connection = new Connection(network)
console.log(connection)
// Test
let test = await connection.getBlockHeight()
console.log("Block height: ", test)
// let balance = await connection.getAccountInfo(keypair.publicKey)
// console.log(balance)
// Airdrop some sol to the account
let airdropSignature = await connection.requestAirdrop(
  keypair.publicKey,
  1
);
console.log("Signature:", airdropSignature)

await connection.confirmTransaction({ signature: airdropSignature });
balance = await connection.getBalance(keypair.publicKey)
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
