import React, { useState, useEffect } from 'react';

const WindowsAuthProvider = ({ children }) => {
  const [windowsUser, setWindowsUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    detectWindowsUser();
  }, []);

  const detectWindowsUser = async () => {
    try {
      // Try NTLM authentication detection
      const response = await fetch('localhost:3001/username', {
        credentials: 'same-origin',
        headers: {
          'Authorization': 'Negotiate'
        }
      });

      if (response.headers.get('WWW-Authenticate')?.includes('Negotiate')) {
        const userData = await response.json();
        setWindowsUser(userData);
      } else {
        // Fallback to Chrome Identity API
        await detectChromeIdentity();
      }
    } catch (err) {
      console.warn('NTLM detection failed:', err);
      await detectChromeIdentity();
    } finally {
      setLoading(false);
    }
  };

  const detectChromeIdentity = async () => {
    try {
      // Check if running in Chrome
      const isChrome = navigator.userAgent.includes('Chrome') && window.chrome;
      if (!isChrome) {
        throw new Error('Not running in Chrome browser');
      }

      // Try to get enterprise policies
      if (window.chrome.enterprise) {
        const policies = await new Promise((resolve) => {
          chrome.enterprise.platformKeys.getTokens((tokens) => {
            resolve(tokens);
          });
        });
        
        if (policies?.length > 0) {
          const domainUser = policies[0].enrollmentDomain;
          setWindowsUser({ domain: domainUser });
          return;
        }
      }

      // Try Windows native messaging
      if (window.chrome.runtime) {
        chrome.runtime.sendNativeMessage(
          'com.windows.identity',
          { type: 'GET_USER' },
          (response) => {
            if (response?.username) {
              setWindowsUser(response);
            } else {
              throw new Error('Native messaging failed');
            }
          }
        );
      }
    } catch (err) {
      setError('Could not detect Windows user');
      console.error('Chrome identity detection failed:', err);
    }
  };

  const getUserPrincipal = async () => {
    try {
      const response = await fetch('/auth/principal', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const principal = await response.json();
        return principal;
      }
      return null;
    } catch (err) {
      console.error('Failed to get user principal:', err);
      return null;
    }
  };

  if (loading) {
    return <div>Detecting Windows user...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <WindowsAuthContext.Provider 
      value={{ 
        windowsUser,
        isAuthenticated: !!windowsUser,
        getUserPrincipal
      }}
    >
      {children}
    </WindowsAuthContext.Provider>
  );
};

// Context for Windows authentication
const WindowsAuthContext = React.createContext({
  windowsUser: null,
  isAuthenticated: false,
  getUserPrincipal: () => Promise.resolve(null)
});

// Custom hook to use Windows auth
export const useWindowsAuth = () => {
  const context = React.useContext(WindowsAuthContext);
  if (!context) {
    throw new Error('useWindowsAuth must be used within WindowsAuthProvider');
  }
  return context;
};

// Example backend API route (Node.js/Express)
const windowsAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (authHeader?.startsWith('Negotiate')) {
    try {
      const sspi = require('node-sspi');
      const nodeSSPI = new sspi({
        retrieveGroups: true,
        authoritative: true
      });

      nodeSSPI.authenticate(req, res, (err) => {
        if (err) {
          res.status(401).send('Authentication failed');
          return;
        }

        const windowsAuth = req.connection.user;
        res.json({
          username: windowsAuth.name,
          domain: windowsAuth.domain,
          groups: windowsAuth.groups
        });
      });
    } catch (err) {
      next(err);
    }
  } else {
    res.setHeader('WWW-Authenticate', 'Negotiate');
    res.status(401).send('No credentials provided');
  }
};

export { WindowsAuthProvider, WindowsAuthContext, windowsAuthMiddleware };