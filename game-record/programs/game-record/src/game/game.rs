use anchor_lang::prelude::*;

use crate::game::errors::GameError;

#[account]
pub struct Game {
    pub players: [Pubkey; 2],
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
        self.state = GameState::NotStarted;

        Ok(())
    }

    pub fn won(&mut self, f_winner: Pubkey) -> Result<()> {
        self.state = GameState::Won { winner: f_winner };

        Ok(())
    }

    pub fn tie(&mut self) -> Result<()> {
        self.state = GameState::Tie;

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