use anchor_lang::prelude::*;

use crate::game::errors::GameError;

#[account]
pub struct Game {
    players: [Pubkey; 2],
    state: GameState,
}

impl Game {
    pub fn start(&mut self, f_players: [Pubkey; 2]) -> Result<()> {
        require!(self.state == GameState::NotStarted, GameError::GameAlreadyStarted);
        self.players = f_players;
        self.state = GameState::Active;

        Ok(())
    }

    pub fn reset(&mut self) -> Result<()> {
        require!(self.state == GameState::Active, GameError::GameNotActive);
        self.state = GameState::NotStarted;

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum GameState {
    NotStarted,
    Active,
    Tie,
    Won { winner: Pubkey },
}