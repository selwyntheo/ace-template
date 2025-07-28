import React from 'react';
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
  Typography,
  Slide
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { ButtonSolid } from './Button';

const StyledDialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    padding: 0,
    minWidth: '400px',
  },
}));

const StyledDialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  margin: 0,
  
  '& .MuiTypography-root': {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#2c3e50',
  },
}));

const StyledDialogContent = styled(MuiDialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&.MuiDialogContent-dividers': {
    borderTop: 'none',
    borderBottom: 'none',
  },
}));

const StyledDialogActions = styled(MuiDialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1),
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({
  open = false,
  onClose,
  title,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseButton = true,
  disableBackdropClick = false,
  actions,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmButtonProps = {},
  cancelButtonProps = {},
  isLoading = false,
  className = '',
  ...props
}) => {
  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    onClose?.(event, reason);
  };

  const handleCancel = () => {
    onCancel?.() || onClose?.();
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      TransitionComponent={Transition}
      className={className}
      {...props}
    >
      {title && (
        <StyledDialogTitle>
          <Typography variant="h6" component="span">
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={handleClose}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <Close />
            </IconButton>
          )}
        </StyledDialogTitle>
      )}
      
      <StyledDialogContent>
        {children}
      </StyledDialogContent>
      
      {(actions || onConfirm || onCancel) && (
        <StyledDialogActions>
          {actions || (
            <>
              {onCancel && (
                <ButtonSolid
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
                  {...cancelButtonProps}
                >
                  {cancelText}
                </ButtonSolid>
              )}
              {onConfirm && (
                <ButtonSolid
                  variant="primary"
                  onClick={onConfirm}
                  loading={isLoading}
                  disabled={isLoading}
                  {...confirmButtonProps}
                >
                  {confirmText}
                </ButtonSolid>
              )}
            </>
          )}
        </StyledDialogActions>
      )}
    </StyledDialog>
  );
};

// Specialized modal variants
export const ConfirmModal = ({
  title = 'Confirm Action',
  message,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  confirmButtonType = 'danger',
  ...props
}) => (
  <Modal
    title={title}
    confirmText={confirmText}
    cancelText={cancelText}
    confirmButtonProps={{ variant: confirmButtonType }}
    maxWidth="xs"
    {...props}
  >
    <Typography variant="body1">
      {message}
    </Typography>
  </Modal>
);

export const AlertModal = ({
  title = 'Alert',
  message,
  confirmText = 'OK',
  ...props
}) => (
  <Modal
    title={title}
    confirmText={confirmText}
    maxWidth="xs"
    {...props}
  >
    <Typography variant="body1">
      {message}
    </Typography>
  </Modal>
);

export const FormModal = ({
  title,
  children,
  submitText = 'Save',
  cancelText = 'Cancel',
  onSubmit,
  ...props
}) => (
  <Modal
    title={title}
    confirmText={submitText}
    cancelText={cancelText}
    onConfirm={onSubmit}
    maxWidth="md"
    {...props}
  >
    {children}
  </Modal>
);

export default Modal;
