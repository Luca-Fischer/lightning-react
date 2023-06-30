#!/bin/bash

mkdir "Library/Application Support/lnd${1}"
cd "Library/Application Support/lnd${1}"
result=$(( ${1} + 10000 ))
resultRpc=$(( ${1} + 5000 ))
echo "[Application Options]
listen=0.0.0.0:${result}
rpclisten=0.0.0.0:${resultRpc}
restlisten=0.0.0.0:${1}


[Bitcoin]
bitcoin.active=1
bitcoin.regtest=1
bitcoin.node=bitcoind

[Bitcoind]
bitcoind.rpchost=localhost
bitcoind.rpcuser=bitcoinrpc
bitcoind.rpcpass=NnwCXg1_B27q-84v0RnFQfd3iNIl75M-E-mtYAo-ddQ
bitcoind.zmqpubrawblock=tcp://127.0.0.1:28332
bitcoind.zmqpubrawtx=tcp://127.0.0.1:28333" > lnd.conf

lnd --lnddir="$HOME/Library/Application Support/lnd${1}"
