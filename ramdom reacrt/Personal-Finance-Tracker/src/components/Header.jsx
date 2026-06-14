```javascript
import React from 'react';
import { Wallet, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    
      
        
        
          Finance Tracker
        
        
          {isDark ? (
            
          ) : (
            
          )}
        
      
      
        Take control of your finances
      
    
  );
};

export default Header;
```