import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from './App';

describe('App', () => {
  it('renders app title', () => {
    render(<App />);
    
    expect(screen.getByText('Tango!')).toBeTruthy();
    expect(screen.getByText('Fun mini-games with household items')).toBeTruthy();
  });

  it('renders game mode buttons', () => {
    render(<App />);
    
    expect(screen.getByText('1 vs 1 Tango')).toBeTruthy();
    expect(screen.getByText('2 vs 2')).toBeTruthy();
    expect(screen.getByText('Co-Op')).toBeTruthy();
    expect(screen.getByText('Tournament')).toBeTruthy();
    expect(screen.getByText('Game Library')).toBeTruthy();
  });
  
  it('renders without crashing', () => {
    render(<App />);
  });
});
