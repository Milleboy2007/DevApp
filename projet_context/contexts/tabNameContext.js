import React, { createContext, useContext, useState } from 'react';

// 1. On crée notre boîte de contexte
const TabNameContext = createContext();

// 2. On crée le Provider qui va distribuer les données
export const TabNameProvider = ({ children }) => {
    const [tabName, setTabName] = useState('');

    return (
        <TabNameContext.Provider value={{ tabName, setTabName }}>
            {children}
        </TabNameContext.Provider>
    );
};

// 3. Un petit hook personnalisé pour se connecter super facilement !
export const useTabNameContext = () => {
    return useContext(TabNameContext);
};