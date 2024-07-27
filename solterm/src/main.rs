use bs58;
use solana_client::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use solana_sdk::signature::{Keypair, Signer};
use solana_sdk::system_instruction;
use solana_sdk::{message::Message, transaction::Transaction};
use std::io::{self, Write};
use std::str::FromStr;
use termion::event::Key;
use termion::input::TermRead;
use termion::raw::{IntoRawMode, RawTerminal};

const RPC_URL: &str = "https://api.devnet.solana.com";

fn create_keypair(stdout: &mut RawTerminal<std::io::Stdout>) -> io::Result<()> {
    let keypair = Keypair::new();
    writeln!(
        stdout,
        "{} New keypair created. Public key: {}",
        termion::cursor::Goto(1, 6),
        keypair.pubkey()
    )?;
    writeln!(stdout, "Secret key: {:?}", keypair.to_bytes())?;
    Ok(())
}

fn airdrop_sol(address: &str, stdout: &mut RawTerminal<std::io::Stdout>) -> io::Result<()> {
    let client = RpcClient::new(RPC_URL);
    let address = address.parse().unwrap();
    match client.request_airdrop(&address, 1_000_000_000u64) {
        Ok(s) => {
            write!(
                stdout,
                "{}Success! Check out your TX here:
                    https://explorer.solana.com/tx/{}?cluster=devnet\n{}",
                s.to_string(),
                address,
                termion::cursor::Hide
            )?;
        }
        Err(e) => println!("Oops, something went wrong: {}", e.to_string()),
    };
    Ok(())
}

fn transfer_sol(stdout: &mut RawTerminal<std::io::Stdout>) -> io::Result<()> {
    let client = RpcClient::new(RPC_URL);

    // Get sender's secret key
    let secret_key = read_input("\nEnter the sender's secret key (base58 encoded): ", stdout)?;
    let sender_keypair = match bs58::decode(&secret_key).into_vec() {
        Ok(sk) => match Keypair::from_bytes(&sk) {
            Ok(kp) => kp,
            Err(_) => {
                writeln!(stdout, "Invalid secret key format. Please try again.")?;
                return Ok(());
            }
        },
        Err(_) => {
            writeln!(stdout, "Invalid base58 encoding. Please try again.")?;
            return Ok(());
        }
    };

    // Get recipient's public key
    let recipient_pubkey = read_input("Enter the recipient's public key: ", stdout)?;
    let recipient_pubkey = match Pubkey::from_str(&recipient_pubkey) {
        Ok(pk) => pk,
        Err(_) => {
            writeln!(stdout, "Invalid public key format. Please try again.")?;
            return Ok(());
        }
    };

    // Get amount of SOL to transfer
    let amount = read_input("Enter the amount of SOL to transfer: ", stdout)?;
    let amount = match amount.parse::<f64>() {
        Ok(a) => (a * 1_000_000_000.0) as u64, // Convert SOL to lamports
        Err(_) => {
            writeln!(stdout, "Invalid amount. Please enter a valid number.")?;
            return Ok(());
        }
    };

    // Create the transfer instruction
    let instruction =
        system_instruction::transfer(&sender_keypair.pubkey(), &recipient_pubkey, amount);

    // Get recent blockhash
    let recent_blockhash = match client.get_latest_blockhash() {
        Ok(blockhash) => blockhash,
        Err(e) => {
            writeln!(stdout, "Failed to get recent blockhash: {}", e)?;
            return Ok(());
        }
    };

    // Create and sign the transaction
    let message = Message::new(&[instruction], Some(&sender_keypair.pubkey()));
    let transaction = Transaction::new(&[&sender_keypair], message, recent_blockhash);

    // Send and confirm transaction
    match client.send_and_confirm_transaction(&transaction) {
        Ok(signature) => {
            writeln!(
                stdout,
                "Transfer successful! Transaction signature: {}",
                signature
            )?;
            writeln!(
                stdout,
                "View the transaction: https://explorer.solana.com/tx/{}?cluster=devnet",
                signature
            )?;
        }
        Err(e) => writeln!(stdout, "Error sending transaction: {}", e)?,
    }

    Ok(())
}

fn read_input(prompt: &str, stdout: &mut RawTerminal<std::io::Stdout>) -> io::Result<String> {
    write!(stdout, "{}", termion::cursor::Show)?;
    write!(stdout, "{}", prompt)?;
    stdout.flush()?;

    let mut input = String::new();
    for c in io::stdin().keys() {
        match c? {
            Key::Char('\n') => break,
            Key::Char(c) => {
                input.push(c);
                write!(stdout, "{}", c)?;
                stdout.flush()?;
            }
            Key::Backspace => {
                input.pop();
                write!(
                    stdout,
                    "{} {}",
                    termion::cursor::Left(1),
                    termion::cursor::Left(1)
                )?;
                stdout.flush()?;
            }
            _ => {}
        }
    }
    write!(stdout, "{}", termion::cursor::Hide)?;
    Ok(input.trim().to_string())
}

fn main() -> io::Result<()> {
    let options = vec![
        "Create new Solana keypair",
        "Airdrop SOL",
        "Transfer SOL",
        "Exit",
    ];
    let mut selected = 0;
    let mut stdout = io::stdout().into_raw_mode()?;

    loop {
        write!(
            stdout,
            "{}{}{}",
            termion::clear::All,
            termion::cursor::Goto(1, 1),
            termion::cursor::Hide
        )?;
        for (i, option) in options.iter().enumerate() {
            write!(stdout, "{}", termion::cursor::Goto(1, (i + 1) as u16))?;
            if i == selected {
                write!(
                    stdout,
                    "{}> {}{}{}",
                    termion::color::Fg(termion::color::Green),
                    option,
                    termion::color::Fg(termion::color::Reset),
                    if i < options.len() - 1 { "    " } else { "" }
                )?;
            } else {
                write!(
                    stdout,
                    "  {}{}",
                    option,
                    if i < options.len() - 1 { "    " } else { "" }
                )?;
            }
        }
        stdout.flush()?;

        if let Some(Ok(key)) = io::stdin().keys().next() {
            match key {
                Key::Up => selected = (selected + options.len() - 1) % options.len(),
                Key::Down => selected = (selected + 1) % options.len(),
                Key::Char('\n') => {
                    match selected {
                        0 => {
                            write!(stdout, "{}", termion::cursor::Show)?;
                            create_keypair(&mut stdout)?;
                            write!(stdout, "{}", termion::cursor::Hide)?;
                        }
                        1 => {
                            let address =
                                read_input("\nEnter the recipient address: ", &mut stdout)?;
                            write!(
                                stdout,
                                "{}Airdropping 1 SOL to address: {}\n{}",
                                termion::cursor::Goto(7, 6),
                                address,
                                termion::cursor::Hide
                            )?;
                            stdout.flush()?;
                            airdrop_sol(&address, &mut stdout)?
                        }
                        2 => {
                            transfer_sol(&mut stdout)?;
                            stdout.flush()?;
                        }
                        3 => return Ok(()),
                        _ => unreachable!(),
                    }
                    writeln!(stdout, "\nPress any key to continue...")?;
                    stdout.flush()?;
                    io::stdin().keys().next();
                }
                _ => {}
            }
        }
    }
}
