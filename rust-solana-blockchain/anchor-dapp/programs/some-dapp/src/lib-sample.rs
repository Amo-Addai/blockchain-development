use anchor_lang::prelude::*;

declare_id!("..");

#[program]
pub mod somedapp {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
