use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, spl_token};
use anchor_spl::associated_token::AssociatedToken;
use spl_token::state::{Mint, Account as TokenAccount};
use utils::{lamports_to_sol, sol_to_lamports, LAMPORTS_PER_SOL};

// Custom Utility functions
mod utils;

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
       keywords: Vec<String>,
       methodology: Vec<String>,
       version: String,
       token_symbol: String,
   ) -> Result<()> {
       require!(token_symbol.len() <= 10, ErrorCode::SymbolTooLong);
       
       // Create the mint account
       let ix = spl_token::instruction::initialize_mint(
           &ctx.accounts.token_program.key(),
           &ctx.accounts.mint.key(),
           &ctx.accounts.authority.key(),
           None,
           6,
       )?;

       anchor_lang::solana_program::program::invoke(
           &ix,
           &[
               ctx.accounts.mint.to_account_info(),
               ctx.accounts.rent.to_account_info(),
           ],
       )?;

       // Create the token account
       let ix = spl_token::instruction::initialize_account(
           &ctx.accounts.token_program.key(),
           &ctx.accounts.token_account.key(),
           &ctx.accounts.mint.key(),
           &ctx.accounts.authority.key(),
       )?;

       anchor_lang::solana_program::program::invoke(
           &ix,
           &[
               ctx.accounts.token_account.to_account_info(),
               ctx.accounts.mint.to_account_info(),
               ctx.accounts.authority.to_account_info(),
               ctx.accounts.rent.to_account_info(),
           ],
       )?;

       let research = &mut ctx.accounts.research;
       let clock: Clock = Clock::get().unwrap();

       // Set research metadata
       research.title = title;
       research.abstract_text = abstract_text;
       research.researchers = researchers;
       research.institution = institution;
       research.field = field;
       research.keywords = keywords;
       research.status = ResearchStatus::Ongoing;
       research.start_date = clock.unix_timestamp;
       research.version = version;
       research.last_updated = clock.unix_timestamp;
       research.authority = ctx.accounts.authority.key();
       research.mint = ctx.accounts.mint.key();

       // Set token-specific data
       research.token_symbol = Some(token_symbol);
       let price = sol_to_lamports(0.001);
       research.token_price = Some(price);

       // Mint initial supply of tokens (1 billion with 6 decimals)
       token::mint_to(
           CpiContext::new(
               ctx.accounts.token_program.to_account_info(),
               token::MintTo {
                   mint: ctx.accounts.mint.to_account_info(),
                   to: ctx.accounts.token_account.to_account_info(),
                   authority: ctx.accounts.authority.to_account_info(),
               },
           ),
           1_000_000_000,
       )?;

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
       ResearchStatus::Ongoing
   }
}

#[account]
#[derive(Default)]
pub struct Research {
   pub title: String,                
   pub abstract_text: String,        
   pub researchers: Vec<String>,     
   pub institution: String,          
   pub field: String,                  
   pub keywords: Vec<String>,        
   pub status: ResearchStatus,       
   pub start_date: i64,              
   pub completion_date: Option<i64>, 
   
   pub version: String,              
   pub last_updated: i64,            
   pub authority: Pubkey,            
   pub mint: Pubkey,                 

   // Token-specific fields
   pub token_symbol: Option<String>, 
   pub token_price: Option<u64>,     

   // Optional fields
   pub methodology: Option<Vec<String>>,     
   pub subfields: Option<Vec<String>>,     
   pub publication_doi: Option<String>,  
   pub citation_count: Option<u32>,      
   pub impact_factor: Option<f64>,       
   pub funding_source: Option<String>,   
   pub grant_amount: Option<u64>,        
   pub grant_id: Option<String>,         
   pub dataset_location: Option<String>, 
   pub dataset_size: Option<String>,     
   pub dataset_format: Option<String>,   
}

#[derive(Accounts)]
pub struct InitializeResearch<'info> {
   #[account(
       init,
       payer = authority,
       space = 8 +    
               200 +  // title
               1000 + // abstract
               400 +  // researchers
               200 +  // institution
               100 +  // field
               300 +  // subfields
               200 +  // keywords
               1 +    // status
               8 +    // start_date
               9 +    // completion_date
               500 +  // methodology
               20 +   // version
               8 +    // last_updated
               32 +   // authority
               32 +   // mint
               10 +   // token_symbol
               8 +    // token_price
               1000   // additional space for optional fields
   )]
   pub research: Account<'info, Research>,

   /// CHECK: We're about to initialize this as a mint
   #[account(mut)]
   pub mint: AccountInfo<'info>,

   /// CHECK: We're about to initialize this as a token account
   #[account(mut)]
   pub token_account: AccountInfo<'info>,

   #[account(mut)]
   pub authority: Signer<'info>,

   pub token_program: Program<'info, Token>,
   pub associated_token_program: Program<'info, AssociatedToken>,
   pub system_program: Program<'info, System>,
   pub rent: Sysvar<'info, Rent>,
}

#[error_code]
pub enum ErrorCode {
   #[msg("Symbol must be 10 characters or less")]
   SymbolTooLong,
}