import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({ useRouter: () => ({ pathname: '/tasks', push: jest.fn() }) }));
jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href }: any) => <a href={href}>{children}</a> }));
jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: { get: jest.fn().mockResolvedValue({ data: [] }), post: jest.fn().mockResolvedValue({ data: {} }), put: jest.fn().mockResolvedValue({ data: {} }), delete: jest.fn().mockResolvedValue({}) },
}));

import TasksPage from '@/pages/tasks';

describe('TasksPage', () => {
  it('renders title', () => {
    render(<TasksPage />);
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('opens add task modal', () => {
    render(<TasksPage />);
    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByText('Add Task', { selector: 'h3' })).toBeInTheDocument();
  });
});