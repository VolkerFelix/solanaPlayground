use anchor_lang::prelude::*;

pub mod game;
use game::Game;

declare_id!("4STVHcERmNuyqZK2254ZAdNDVsikgx9oTTH5sjhCc727");

#[program]
pub mod game_record {
    use super::*;

    pub fn setup_game(ctx: Context<SetupGame>) -> Result<()> {
        ctx.accounts
            .game
            .start([ctx.accounts.player_one.key(), ctx.accounts.player_two.key()]);

        Ok(())
    }

    pub fn reset_game(ctx: Context<Play>) -> Result<()> {
        ctx.accounts
            .game
            .reset();

        Ok(())
    }

    pub fn won_game(ctx:Context<Play>, f_winner: Pubkey) -> Result<()> {
        ctx.accounts
            .game
            .won(f_winner);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SetupGame<'info> {
    #[account(init, payer = player_one, space = 32 * 4)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player_one: Signer<'info>,
    pub player_two: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Play<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    // Both players need to agree (sign) to reset
    pub player_one: Signer<'info>,
    pub player_two: Signer<'info>
}