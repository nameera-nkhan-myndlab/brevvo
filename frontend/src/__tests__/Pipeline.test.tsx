import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({ useRouter: () => ({ pathname: '/pipeline', push: jest.fn() }) }));
jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href }: any) => <a href={href}>{children}</a> }));
jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: { get: jest.fn().mockResolvedValue({ data: [] }), patch: jest.fn().mockResolvedValue({ data: {} }) },
}));

import PipelinePage from '@/pages/pipeline';

describe('PipelinePage', () => {
  it('renders pipeline title and stages', () => {
    render(<PipelinePage />);
    expect(screen.getByText('Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Prospecting')).toBeInTheDocument();
    expect(screen.getByText('Closing')).toBeInTheDocument();
  });
});