FROM ubuntu:latest

ARG SOLANA_CLUSTER_IP
ARG HTTP_RPC_PORT

RUN apt-get update
RUN apt-get -y install \
wget \
bzip2

RUN mkdir ~/.solana
WORKDIR /home/.solana

RUN wget https://github.com/solana-labs/solana/releases/download/v1.16.21/solana-release-x86_64-unknown-linux-gnu.tar.bz2
RUN tar -xf solana-release-x86_64-unknown-linux-gnu.tar.bz2

ENV PATH="${PATH}:/home/.solana/solana-release/bin"

CMD [ "solana config set --url http://${SOLANA_CLUSTER_IP}:${HTTP_RPC_PORT}}" ]
