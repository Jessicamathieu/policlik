import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AddClientModal } from '@/components/clients/add-client-modal';
import * as clientService from '@/services/client-service';
import * as authContext from '@/context/auth-context';
import * as useToastHook from '@/hooks/use-toast';

// Mock dependencies
vi.mock('@/services/client-service');
vi.mock('@/context/auth-context');
vi.mock('@/hooks/use-toast');

describe('AddClientModal', () => {
  const mockUser = { uid: 'test-user-id', displayName: 'Test User', email: 'test@test.com' };
  const mockToast = vi.fn();
  const mockAddClient = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock implementation for useAuth
    (authContext.useAuth as vi.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
    });

    // Mock implementation for useToast
    (useToastHook.useToast as vi.Mock).mockReturnValue({
      toast: mockToast,
    });
    
    // Mock implementation for addClient service
    (clientService.addClient as vi.Mock).mockImplementation(mockAddClient);
  });

  const mockOnOpenChange = vi.fn();
  const mockOnClientAdded = vi.fn();

  const renderComponent = () => {
    render(
      <AddClientModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onClientAdded={mockOnClientAdded}
      />
    );
  };

  it('renders correctly when open', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: 'Nouveau Client' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Adresse e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Téléphone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Adresse/i)).toBeInTheDocument();
  });

  it('submits the form and calls addClient with correct data', async () => {
    renderComponent();
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/Nom complet/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Adresse e-mail/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Téléphone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Adresse/i), { target: { value: '123 Main St' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter le client' }));

    // Wait for the async operations to complete
    await waitFor(() => {
      // Check if addClient was called
      expect(mockAddClient).toHaveBeenCalledTimes(1);

      // Check if it was called with the correct data
      expect(mockAddClient).toHaveBeenCalledWith(
        {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main St',
        },
        mockUser.uid
      );
    });

    // Check if success toast was shown
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Client ajouté',
      description: 'John Doe a été ajouté à votre liste de clients.',
    });
    
    // Check if modal handlers were called
    expect(mockOnClientAdded).toHaveBeenCalledTimes(1);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows validation errors for invalid input', async () => {
    renderComponent();

    // Submit form with empty fields
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter le client' }));

    // Check for validation messages
    expect(await screen.findByText('Le nom doit contenir au moins 2 caractères.')).toBeInTheDocument();
    expect(await screen.findByText('Le téléphone doit contenir au moins 10 chiffres.')).toBeInTheDocument();
    expect(await screen.findByText("L'adresse doit contenir au moins 5 caractères.")).toBeInTheDocument();

    // Ensure addClient was not called
    expect(mockAddClient).not.toHaveBeenCalled();
  });
});
