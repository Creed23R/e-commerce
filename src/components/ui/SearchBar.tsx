import React, { useState } from 'react';
import { Input } from './input';

interface SearchBarProps {
    onSearch: (term: string) => void;
    placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = 'Buscar...' }: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-md">
            <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="flex-1 h-10 rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <button
                type="submit"
                className="inline-flex items-center justify-center rounded-r-md h-10 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                Buscar
            </button>
        </form>
    );
};
