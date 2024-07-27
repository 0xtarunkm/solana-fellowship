# Solterm

This is a Command Line Interface (CLI) application for managing Solana transactions. It allows you to create a new Solana keypair, request an airdrop of SOL, and transfer SOL between accounts.

## Features

- **Create New Solana Keypair**: Generate a new Solana keypair and display its public and private keys.
- **Airdrop SOL**: Request an airdrop of 1 SOL to a specified address.
- **Transfer SOL**: Transfer SOL from one account to another.
- **Exit**: Exit the application.

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)

## Installation

1. Clone the repository:

   ```sh
   git clone git@github.com:tarunclub/solana-fellowship.git
   cd solterm
   ```

2. Build the project
   ```sh
   cargo build --release
   ```
3. Run the project
   ```sh
    cargo run
   ```
