import { describe, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import App, { WrappedApp } from '../App'

describe('App', () => {
  it('Renders hello world', () => {
    render(<WrappedApp />)

    expect(
      screen.getByRole('heading', {
        level: 1,
      })
    ).toHaveTextContent('Hello world! with tailwindcss')
  })
  it('Renders not found if invalid path', () => {
    render(
      <MemoryRouter initialEntries={['/this-route-does-not-exists']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('link')).toHaveTextContent('Go back')
  })
})
