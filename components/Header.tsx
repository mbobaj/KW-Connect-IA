import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <div className="p-2 bg-card rounded-lg">
                    <svg className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3V21M16 3L8 12L16 21" />
                        <line x1="16" y1="12" x2="22" y2="12" />
                        <line x1="20" y1="10" x2="20" y2="14" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">KW-Connect</h1>
                    <p className="text-text-secondary">Hogar - Santiago, Chile</p>
                </div>
            </div>
            <div className="p-3 bg-card rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
            </div>
        </header>
    );
};

export default Header;
