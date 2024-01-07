use anchor_lang::error_code;

#[error_code]
pub enum GameError {
    GameAlreadyStarted,
    GameNotActive,
    OnePlayerDidNotAgreeToReset
}