import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { HELIOS_TESTNET } from '../config/constants';
import { WalletState } from '../types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Helper function to ensure proper address checksum
const toChecksumAddress = (address: string): string => {
  try {
    return ethers.getAddress(address);
  } catch (error) {
    console.error('Invalid address format:', address);
    throw new Error(`Invalid address format: ${address}`);
  }
};
export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: '0',
    isConnected: false,
    isCorrectNetwork: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkNetwork = async () => {
    if (!window.ethereum) return false;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return chainId === HELIOS_TESTNET.chainId;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  };

  const switchToHelios = async () => {
    if (!window.ethereum) throw new Error('MetaMask not found');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: HELIOS_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [HELIOS_TESTNET],
        });
      } else {
        throw switchError;
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask.');
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        await switchToHelios();
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      
      setWalletState({
        address: accounts[0],
        balance: ethers.formatEther(balance),
        isConnected: true,
        isCorrectNetwork: true
      });

      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signMessage = async (message: string) => {
    if (!window.ethereum || !walletState.address) {
      throw new Error('Wallet not connected');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return await signer.signMessage(message);
  };

  const sendTransaction = async (to: string, amount: string) => {
    if (!window.ethereum || !walletState.address) {
      throw new Error('Wallet not connected');
    }

    // Ensure proper address checksum
    const checksummedTo = toChecksumAddress(to);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const tx = await signer.sendTransaction({
      to: checksummedTo,
      value: ethers.parseEther(amount)
    });

    return tx;
  };

  const updateBalance = async () => {
    if (!window.ethereum || !walletState.address) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(walletState.address);
      setWalletState(prev => ({
        ...prev,
        balance: ethers.formatEther(balance)
      }));
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletState({
          address: null,
          balance: '0',
          isConnected: false,
          isCorrectNetwork: false
        });
      } else {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return {
    walletState,
    isLoading,
    connectWallet,
    signMessage,
    sendTransaction,
    updateBalance,
    switchToHelios
  };
};