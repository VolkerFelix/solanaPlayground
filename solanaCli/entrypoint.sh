#!/bin/bash

SOLANA_CLUSTER_IP=$1
HTTP_RPC_PORT=$2
CREATE_NEW_KEYPAIR=$3

# Check if local cluster is available
RETRIES=5
for i in $(seq 0 ${RETRIES})
do
    if [ ${i} -eq 5 ]; then
        echo "Error: Solana cluster cannot be reached."
        exit 1
    fi
    response=$(curl --write-out '%{http_code}' --silent --output /dev/null http://${SOLANA_CLUSTER_IP}:${HTTP_RPC_PORT} \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":1, "method":"getHealth"}')
    
    if [ ${response} == '200' ]; then
        echo "Success: Solana cluster available."
        break
    else
        sleep 1s
    fi
done

# Connect to local cluster
echo "Connecting to Solana local cluster ..."
solana config set --url http://${SOLANA_CLUSTER_IP}:${HTTP_RPC_PORT}

# Create new keypair if requested
if [ $3 == true ]; then
    echo "Creating new keypair ..."
    solana-keygen new --outfile keypair/keypair.json --no-bip39-passphrase
    chown volker:volker keypair/keypair.json
fi

# Keep container alive
read -p "I'm alive"
