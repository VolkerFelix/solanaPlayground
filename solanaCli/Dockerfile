FROM ubuntu:latest

# ARG SOLANA_CLUSTER_IP
# ARG HTTP_RPC_PORT

RUN apt-get update -y
RUN apt-get install -y \
    wget \
    bzip2 \
    curl \
    nano

WORKDIR /home

RUN mkdir keypair

RUN mkdir .solana &&\
    cd .solana &&\
    wget https://github.com/solana-labs/solana/releases/download/v1.16.21/solana-release-x86_64-unknown-linux-gnu.tar.bz2 &&\
    tar -xf solana-release-x86_64-unknown-linux-gnu.tar.bz2

ENV PATH="${PATH}:/home/.solana/solana-release/bin"

RUN useradd volker

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD [ "SOLANA_CLUSTER_IP", "HTTP_RPC_PORT", "REQUEST_NEW_KEYPAIR" ]
