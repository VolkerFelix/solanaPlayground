use anchor_lang::prelude::*;

pub mod game;
use game::Game;

declare_id!("4STVHcERmNuyqZK2254ZAdNDVsikgx9oTTH5sjhCc727");

#[program]
pub mod game_record {
    use super::*;

    pub fn setup_game(ctx: Context<SetupGame>, f_player_two: Pubkey) -> Result<()> {
        ctx.accounts
            .game
            .start([ctx.accounts.player_one.key(), f_player_two]);

        Ok(())
    }

    pub fn reset_game(ctx: Context<ResetGame>) -> Result<()> {
        ctx.accounts
            .game
            .reset();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SetupGame<'info> {
    #[account(init, payer = player_one, space = 32 * 3)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player_one: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct ResetGame<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>
}