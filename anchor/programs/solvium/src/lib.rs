use anchor_lang::prelude::*;
use anchor_spl::token::Token;

declare_id!("Cheg7SgQmMGzNwBfGL7jWCVjRaVQityvRfjLsqzTAkV2");

#[program]
pub mod solvium {
    use super::*;

    pub fn initialize_research(
        ctx: Context<InitializeResearch>,
        title: String,
        abstract_text: String,
        researchers: Vec<String>,
        institution: String,
        field: String,
        subfields: Vec<String>,
        keywords: Vec<String>,
        methodology: Vec<String>,
        version: String,
    ) -> Result<()> {
        let research = &mut ctx.accounts.research;
        let clock: Clock = Clock::get().unwrap();

        research.title = title;
        research.abstract_text = abstract_text;
        research.researchers = researchers;
        research.institution = institution;
        research.field = field;
        research.subfields = subfields;
        research.keywords = keywords;
        research.status = ResearchStatus::Ongoing;
        research.start_date = clock.unix_timestamp;
        research.methodology = methodology;
        research.version = version;
        research.last_updated = clock.unix_timestamp;
        research.authority = ctx.accounts.authority.key();
        research.mint = ctx.accounts.mint.key();

        Ok(())
    }

    pub fn update_metadata(
        ctx: Context<UpdateMetadata>,
        field_name: String,
        new_value: String,
    ) -> Result<()> {
        let research = &mut ctx.accounts.research;
        let clock: Clock = Clock::get().unwrap();

        match field_name.as_str() {
            "title" => research.title = new_value,
            "abstract" => research.abstract_text = new_value,
            "institution" => research.institution = new_value,
            "field" => research.field = new_value,
            "version" => research.version = new_value,
            _ => return Err(ErrorCode::InvalidField.into()),
        }

        research.last_updated = clock.unix_timestamp;
        Ok(())
    }

    pub fn update_status(ctx: Context<UpdateStatus>, new_status: ResearchStatus) -> Result<()> {
        let research = &mut ctx.accounts.research;
        let clock: Clock = Clock::get().unwrap();

        research.status = new_status.clone();
        research.last_updated = clock.unix_timestamp;

        if matches!(new_status, ResearchStatus::Completed) {
            research.completion_date = Some(clock.unix_timestamp);
        }

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ResearchStatus {
    Ongoing,
    Completed,
    PeerReview,
    Published,
}

impl Default for ResearchStatus {
    fn default() -> Self {
        ResearchStatus::Ongoing  // This sets "Ongoing" as the default value
    }
}

#[account]
#[derive(Default)]
pub struct Research {
    pub title: String,                // 200
    pub abstract_text: String,        // 1000
    pub researchers: Vec<String>,     // 400
    pub institution: String,          // 200
    pub field: String,                // 100
    pub subfields: Vec<String>,       // 300
    pub keywords: Vec<String>,        // 200
    pub status: ResearchStatus,       // 1
    pub start_date: i64,              // 8
    pub completion_date: Option<i64>, // 9
    pub methodology: Vec<String>,     // 500
    pub version: String,              // 20
    pub last_updated: i64,            // 8
    pub authority: Pubkey,            // 32
    pub mint: Pubkey,                 // 32

    // Optional fields
    pub publication_doi: Option<String>,  // 100
    pub citation_count: Option<u32>,      // 4
    pub impact_factor: Option<f64>,       // 8
    pub funding_source: Option<String>,   // 200
    pub grant_amount: Option<u64>,        // 8
    pub grant_id: Option<String>,         // 100
    pub dataset_location: Option<String>, // 200
    pub dataset_size: Option<String>,     // 50
    pub dataset_format: Option<String>,   // 50
}

#[derive(Accounts)]
pub struct InitializeResearch<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + // discriminator
                200 + // title
                1000 + // abstract
                400 + // researchers
                200 + // institution
                100 + // field
                300 + // subfields
                200 + // keywords
                1 + // status
                8 + // start_date
                9 + // completion_date
                500 + // methodology
                20 + // version
                8 + // last_updated
                32 + // authority
                32 + // mint
                1000, // additional space for optional fields
    )]
    pub research: Account<'info, Research>,

    /// CHECK: We're just reading the mint account
    #[account(mut)]
    pub mint: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateMetadata<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub research: Account<'info, Research>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateStatus<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub research: Account<'info, Research>,

    pub authority: Signer<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid field name provided")]
    InvalidField,
    #[msg("Unauthorized access")]
    Unauthorized,
}
