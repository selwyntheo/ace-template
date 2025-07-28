import React, { useState } from 'react';
import {
  Badge as MuiBadge,
  Avatar as MuiAvatar,
  AvatarGroup,
  Chip,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person, Edit } from '@mui/icons-material';

const StyledBadge = styled(MuiBadge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#2B9CAE',
    color: 'white',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const StyledAvatar = styled(MuiAvatar)(({ theme }) => ({
  backgroundColor: '#2B9CAE',
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
}));

// Basic Badge Component
export const Badge = ({
  children,
  badgeContent,
  color = 'primary',
  variant = 'standard',
  invisible = false,
  showZero = false,
  max = 99,
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  className = '',
  ...props
}) => (
  <StyledBadge
    badgeContent={badgeContent}
    color={color}
    variant={variant}
    invisible={invisible}
    showZero={showZero}
    max={max}
    anchorOrigin={anchorOrigin}
    className={className}
    {...props}
  >
    {children}
  </StyledBadge>
);

// Notification Badge
export const NotificationBadge = ({ 
  children, 
  count = 0, 
  showPulse = false,
  ...props 
}) => (
  <Badge
    badgeContent={count > 99 ? '99+' : count}
    invisible={count === 0}
    variant={showPulse ? 'dot' : 'standard'}
    {...props}
  >
    {children}
  </Badge>
);

// Status Badge
export const StatusBadge = ({
  children,
  status = 'online',
  showLabel = false,
  ...props
}) => {
  const statusColors = {
    online: '#28a745',
    offline: '#6c757d',
    away: '#ffc107',
    busy: '#dc3545',
  };

  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    away: 'Away',
    busy: 'Busy',
  };

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Badge
        badgeContent=""
        variant="dot"
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: statusColors[status],
            '&::after': {
              border: `2px solid ${statusColors[status]}`,
            },
          },
        }}
        {...props}
      >
        {children}
      </Badge>
      {showLabel && (
        <Typography variant="caption" sx={{ color: statusColors[status] }}>
          {statusLabels[status]}
        </Typography>
      )}
    </Box>
  );
};

// Basic Avatar Component
export const Avatar = ({
  src,
  alt,
  name,
  size = 'medium',
  onClick,
  editable = false,
  onEdit,
  sx = {},
  ...props
}) => {
  const sizeMap = {
    small: { width: 32, height: 32 },
    medium: { width: 40, height: 40 },
    large: { width: 56, height: 56 },
    xlarge: { width: 80, height: 80 },
  };

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <StyledAvatar
        src={src}
        alt={alt || name}
        onClick={onClick}
        sx={{
          ...sizeMap[size],
          fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.5rem' : '1rem',
          cursor: onClick ? 'pointer' : 'default',
          ...sx,
        }}
        {...props}
      >
        {!src && name && getInitials(name)}
        {!src && !name && <Person />}
      </StyledAvatar>
      
      {editable && (
        <IconButton
          size="small"
          onClick={onEdit}
          sx={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            backgroundColor: 'white',
            border: '2px solid #e0e0e0',
            width: 24,
            height: 24,
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <Edit sx={{ fontSize: 12 }} />
        </IconButton>
      )}
    </Box>
  );
};

// User Avatar with Status
export const UserAvatar = ({
  user,
  showStatus = false,
  showName = false,
  size = 'medium',
  orientation = 'horizontal',
  ...props
}) => {
  const avatar = (
    <Avatar
      src={user?.avatar}
      name={user?.name || user?.username}
      size={size}
      {...props}
    />
  );

  const avatarWithStatus = showStatus ? (
    <StatusBadge status={user?.status || 'offline'}>
      {avatar}
    </StatusBadge>
  ) : avatar;

  if (!showName) {
    return avatarWithStatus;
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        gap: orientation === 'vertical' ? 0.5 : 1.5,
      }}
    >
      {avatarWithStatus}
      <Box sx={{ textAlign: orientation === 'vertical' ? 'center' : 'left' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
          {user?.name || user?.username}
        </Typography>
        {user?.role && (
          <Typography variant="caption" color="text.secondary">
            {user.role}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// Avatar Group Component
export const AvatarGroupComponent = ({
  users = [],
  max = 3,
  size = 'medium',
  spacing = 'medium',
  onClick,
  showTooltip = true,
  ...props
}) => {
  const spacingMap = {
    small: -8,
    medium: -12,
    large: -16,
  };

  return (
    <AvatarGroup
      max={max}
      spacing={spacingMap[spacing]}
      sx={{
        '& .MuiAvatar-root': {
          cursor: onClick ? 'pointer' : 'default',
          border: '2px solid white',
        },
      }}
      {...props}
    >
      {users.map((user, index) => (
        <Avatar
          key={user.id || index}
          src={user.avatar}
          name={user.name || user.username}
          size={size}
          onClick={() => onClick?.(user)}
          title={showTooltip ? user.name || user.username : undefined}
        />
      ))}
    </AvatarGroup>
  );
};

// Upload Avatar Component
export const UploadAvatar = ({
  src,
  name,
  size = 'large',
  onUpload,
  onRemove,
  acceptedFormats = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  ...props
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file) => {
    if (file.size > maxSize) {
      alert('File size too large. Please select a file smaller than 5MB.');
      return;
    }

    setUploading(true);
    try {
      await onUpload?.(file);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        sx={{
          position: 'relative',
          border: dragOver ? '2px dashed #2B9CAE' : '2px dashed transparent',
          borderRadius: '50%',
          padding: 1,
          transition: 'all 0.2s ease',
        }}
      >
        <Avatar
          src={src}
          name={name}
          size={size}
          sx={{
            opacity: uploading ? 0.6 : 1,
            cursor: 'pointer',
          }}
          {...props}
        />
        
        <input
          type="file"
          accept={acceptedFormats}
          onChange={handleFileSelect}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
        
        {uploading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Typography variant="caption">Uploading...</Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Drop image here or click to upload
        </Typography>
        {src && onRemove && (
          <Typography
            variant="caption"
            sx={{ 
              color: '#dc3545', 
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={onRemove}
          >
            Remove
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Badge;
