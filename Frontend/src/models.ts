export interface User{
    id:number;
    username: string;
    password: string;
}

export interface Token{
    refresh: string;
    access: string;
}

export interface Wallet{
    id: number;
    user: User;
    name: string;
    balance: number;
    currency: string;
}

export interface Category{
    id: number;
    user: User;
    name: string;
    is_income: boolean;
}

export interface Budget{
    id:number;
    user: User;
    wallet: Wallet;
    amount: number;
    month: string;
}

export interface Transaction{
    id:number;
    user: User;
    wallet: Wallet;
    category: Category;
    amount: number;
    description: string;
    date : string;
    is_income: boolean;
}