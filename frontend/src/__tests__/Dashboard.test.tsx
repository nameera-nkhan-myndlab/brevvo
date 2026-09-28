import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/', push: jest.fn() }),
}));
jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href }: any) => <a href={href}>{children}</a> }));
jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: { get: jest.fn().mockResolvedValue({ data: [] }), post: jest.fn().mockResolvedValue({ data: {} }) },
}));

import Dashboard from '@/pages/index';

describe('Dashboard', () => {
  it('renders greeting and new deal button', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Good morning/)).toBeInTheDocument();
    expect(screen.getByText('New Deal')).toBeInTheDocument();
  });

  it('opens modal on New Deal click', () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByText('New Deal'));
    expect(screen.getByText('Create New Deal')).toBeInTheDocument();
  });
});