import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Square from '../src/components/Square';

// Mock CSS modules
jest.mock('../src/styles/Square.module.css', () => ({
  square: 'square',
  light: 'light',
  dark: 'dark',
  selected: 'selected',
  possibleMove: 'possibleMove',
}));

describe('Square Component', () => {
  test('renders with correct classes for light square', () => {
    const mockClick = jest.fn();
    const { container } = render(
      <Square 
        square="a1" 
        isLight={true} 
        isSelected={false} 
        isPossibleMove={false} 
        onClick={mockClick} 
      />
    );
    
    const squareElement = container.firstChild;
    expect(squareElement).toHaveClass('square');
    expect(squareElement).toHaveClass('light');
    expect(squareElement).not.toHaveClass('dark');
    expect(squareElement).not.toHaveClass('selected');
    expect(squareElement).not.toHaveClass('possibleMove');
  });
  
  test('renders with correct classes for dark square', () => {
    const mockClick = jest.fn();
    const { container } = render(
      <Square 
        square="a2" 
        isLight={false} 
        isSelected={false} 
        isPossibleMove={false} 
        onClick={mockClick} 
      />
    );
    
    const squareElement = container.firstChild;
    expect(squareElement).toHaveClass('square');
    expect(squareElement).toHaveClass('dark');
    expect(squareElement).not.toHaveClass('light');
  });
  
  test('renders with selected class when isSelected is true', () => {
    const mockClick = jest.fn();
    const { container } = render(
      <Square 
        square="a3" 
        isLight={true} 
        isSelected={true} 
        isPossibleMove={false} 
        onClick={mockClick} 
      />
    );
    
    const squareElement = container.firstChild;
    expect(squareElement).toHaveClass('selected');
  });
  
  test('renders with possibleMove class when isPossibleMove is true', () => {
    const mockClick = jest.fn();
    const { container } = render(
      <Square 
        square="a4" 
        isLight={true} 
        isSelected={false} 
        isPossibleMove={true} 
        onClick={mockClick} 
      />
    );
    
    const squareElement = container.firstChild;
    expect(squareElement).toHaveClass('possibleMove');
  });
  
  test('calls onClick handler when clicked', () => {
    const mockClick = jest.fn();
    const { container } = render(
      <Square 
        square="a5" 
        isLight={true} 
        isSelected={false} 
        isPossibleMove={false} 
        onClick={mockClick} 
      />
    );
    
    const squareElement = container.firstChild;
    fireEvent.click(squareElement as Element);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
  
  test('renders children correctly', () => {
    const mockClick = jest.fn();
    const { getByText } = render(
      <Square 
        square="a6" 
        isLight={true} 
        isSelected={false} 
        isPossibleMove={false} 
        onClick={mockClick}
      >
        <div>Test Child</div>
      </Square>
    );
    
    expect(getByText('Test Child')).toBeInTheDocument();
  });
}); 