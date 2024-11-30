use anchor_lang::prelude::*;

pub const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

pub fn lamports_to_sol(lamports: u64) -> f64 {
    lamports as f64 / LAMPORTS_PER_SOL as f64
}

pub fn sol_to_lamports(sol: f64) -> u64 {
    (sol * LAMPORTS_PER_SOL as f64) as u64
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lamports_to_sol() {
        assert_eq!(lamports_to_sol(LAMPORTS_PER_SOL), 1.0);
        assert_eq!(lamports_to_sol(500_000_000), 0.5);
    }

    #[test]
    fn test_sol_to_lamports() {
        assert_eq!(sol_to_lamports(1.0), LAMPORTS_PER_SOL);
        assert_eq!(sol_to_lamports(0.5), 500_000_000);
    }
}