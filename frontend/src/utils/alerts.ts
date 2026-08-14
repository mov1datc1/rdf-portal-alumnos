import Swal from 'sweetalert2';

// Colors based on branding
const COLORS = {
  primary: '#1D3A8A', // Blue
  danger: '#EF4444',  // Red
  cancel: '#94A3B8',  // Slate
};

export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: COLORS.primary,
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'rounded-xl font-bold px-6 py-2'
    }
  });
};

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: COLORS.primary,
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'rounded-xl font-bold px-6 py-2'
    }
  });
};

export const confirmDelete = async (title: string, text: string = 'Esta acción no se puede deshacer.') => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: COLORS.danger,
    cancelButtonColor: COLORS.cancel,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true, // Put Cancel on left, Delete on right
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'rounded-xl font-bold px-5 py-2',
      cancelButton: 'rounded-xl font-bold px-5 py-2'
    }
  });
  return result.isConfirmed;
};
