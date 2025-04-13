export interface User {
  wallet_address: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Merchant {
  uen: string;
  merchant_name: string;
  merchant_username: string;
  merchant_wallet_address: string;
  prefer_xsgd: boolean;
  is_vault_enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  transaction_hash: string;
  merchant_uen: string;
  user_wallet_address: string;
  amount: number;
  created_at: Date;
}

export interface TokenData {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  value: number;
  percentage: number;
}

export interface PortfolioData {
  tokens: TokenData[];
  totalValue: number;
}
