use anchor_lang::prelude::*;

declare_id!("Cheg7SgQmMGzNwBfGL7jWCVjRaVQityvRfjLsqzTAkV2");

#[program]
pub mod research_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, title: String, summary: String, institutions: String,field:String, keywords: String) -> Result<()> {
        let research_account = &mut ctx.accounts.research_account;
        research_account.authority = ctx.accounts.user.key();

        research_account.title = title;
        research_account.summary = summary;
        research_account.institutions = institutions;
        research_account.field = field;
        research_account.keywords = keywords;
        Ok(())
    }

    // pub fn add_research(ctx: Context<AddResearch>, research_data: String) -> Result<()> {
    //     let research_account = &mut ctx.accounts.research_account;
    //     Ok(())
    // }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 200, // discriminator + pubkey + string space
    )]
    pub research_account: Account<'info, ResearchAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddResearch<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub research_account: Account<'info, ResearchAccount>,
    pub authority: Signer<'info>,
}

#[account]
pub struct ResearchAccount {
    pub authority: Pubkey,
    pub title: String,
    pub summary: String,
    pub institutions: String,
    pub field: String,
    pub keywords: String
}
