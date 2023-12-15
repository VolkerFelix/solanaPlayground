import logo from './logo.svg';
import './App.css';
import { Keypair, Connection, PublicKey, Cluster, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Select Solana cluster
const SOLANA_CLUSTER = "testnet"
const network = clusterApiUrl(SOLANA_CLUSTER);
// Create new keypair
let keypair = Keypair.generate();
// Create connection
let connection = new Connection(network)
// Airdrop some sol to the account
let airdropSignature = await connection.requestAirdrop(
  keypair.publicKey,
  LAMPORTS_PER_SOL
);

await connection.confirmTransaction({ signature: airdropSignature });

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
