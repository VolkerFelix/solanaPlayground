FROM ubuntu:latest

RUN apt-get update
RUN apt-get -y install wget

RUN mkdir ~/.solana
RUN cd ~/.solana

# Download and unzip binary
RUN wget https://github.com/solana-labs/solana/releases/download/v1.16.21/solana-release-x86_64-unknown-linux-gnu.tar.bz2
RUN tar -xf solana-release-x86_64-unknown-linux-gnu.tar.bz2

ENV SOLANA_HOME "SOLANA_HOME:~/.solana/solana-release"
ENV PATH "PATH:/${SOLANA_HOME}/bin"
