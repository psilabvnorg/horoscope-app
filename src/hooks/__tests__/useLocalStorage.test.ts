import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should store and retrieve value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new value'));
  });

  it('should handle objects', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-obj', { name: 'test', count: 0 })
    );
    
    act(() => {
      result.current[1]({ name: 'updated', count: 5 });
    });

    expect(result.current[0]).toEqual({ name: 'updated', count: 5 });
  });

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));
    
    act(() => {
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('should load existing value from localStorage', () => {
    localStorage.setItem('existing-key', JSON.stringify('stored value'));
    
    const { result } = renderHook(() => 
      useLocalStorage('existing-key', 'default')
    );

    expect(result.current[0]).toBe('stored value');
  });

  it('should handle invalid JSON gracefully', () => {
    localStorage.setItem('invalid-key', 'not valid json{');
    
    const { result } = renderHook(() => 
      useLocalStorage('invalid-key', 'fallback')
    );

    expect(result.current[0]).toBe('fallback');
  });
});
