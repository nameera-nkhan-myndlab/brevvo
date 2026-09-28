import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({ useRouter: () => ({ pathname: '/contacts', push: jest.fn() }) }));
jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href }: any) => <a href={href}>{children}</a> }));
jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: { get: jest.fn().mockResolvedValue({ data: [] }), post: jest.fn().mockResolvedValue({ data: {} }), put: jest.fn().mockResolvedValue({ data: {} }), delete: jest.fn().mockResolvedValue({}) },
}));

import ContactsPage from '@/pages/contacts';

describe('ContactsPage', () => {
  it('renders title and add button', () => {
    render(<ContactsPage />);
    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('Add Contact')).toBeInTheDocument();
  });

  it('opens add modal on click', () => {
    render(<ContactsPage />);
    fireEvent.click(screen.getByText('Add Contact'));
    expect(screen.getByText('Add Contact', { selector: 'h3' })).toBeInTheDocument();
  });
});