import React from 'react';
import { Card as MuiCard, CardContent, CardActions, CardHeader, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(MuiCard)(({ theme, clickable }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease-in-out',
  border: '1px solid #f0f0f0',
  
  ...(clickable && {
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      transform: 'translateY(-2px)',
      borderColor: '#2B9CAE',
    },
  }),
  
  '& .MuiCardHeader-root': {
    paddingBottom: theme.spacing(1),
  },
  
  '& .MuiCardContent-root': {
    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
  },
}));

const Card = ({
  children,
  title,
  subtitle,
  avatar,
  action,
  onClick,
  className = '',
  style = {},
  elevation = 1,
  variant = 'elevation',
  ...props
}) => {
  const isClickable = !!onClick;

  return (
    <StyledCard
      clickable={isClickable}
      onClick={onClick}
      className={className}
      style={style}
      elevation={elevation}
      variant={variant}
      {...props}
    >
      {(title || subtitle || avatar || action) && (
        <CardHeader
          avatar={avatar}
          action={action}
          title={title}
          subheader={subtitle}
        />
      )}
      
      <CardContent>
        {children}
      </CardContent>
    </StyledCard>
  );
};

// Specialized card variants
export const ActionCard = ({
  title,
  description,
  icon,
  onClick,
  disabled = false,
  className = '',
  ...props
}) => (
  <StyledCard
    clickable={!disabled}
    onClick={disabled ? undefined : onClick}
    className={`action-card ${disabled ? 'disabled' : ''} ${className}`}
    style={{
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      minHeight: '120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '16px',
    }}
    {...props}
  >
    <CardContent style={{ padding: 0 }}>
      {icon && (
        <div style={{ marginBottom: '12px', fontSize: '32px', color: '#2B9CAE' }}>
          {icon}
        </div>
      )}
      {title && (
        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#2c3e50' }}>
          {title}
        </div>
      )}
      {description && (
        <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
          {description}
        </div>
      )}
    </CardContent>
  </StyledCard>
);

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendColor = 'success',
  className = '',
  ...props
}) => (
  <Card className={`stats-card ${className}`} {...props}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '8px' }}>
            {title}
          </div>
        )}
        {value && (
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#2c3e50', marginBottom: '4px' }}>
            {value}
          </div>
        )}
        {subtitle && (
          <div style={{ fontSize: '12px', color: '#95a5a6' }}>
            {subtitle}
          </div>
        )}
        {trend && (
          <div style={{ 
            fontSize: '12px', 
            color: trendColor === 'success' ? '#27ae60' : trendColor === 'error' ? '#e74c3c' : '#f39c12',
            marginTop: '4px'
          }}>
            {trend}
          </div>
        )}
      </div>
      {icon && (
        <div style={{ fontSize: '24px', color: '#2B9CAE', opacity: 0.7 }}>
          {icon}
        </div>
      )}
    </div>
  </Card>
);

export const FeatureCard = ({
  title,
  description,
  image,
  tags = [],
  onClick,
  width = '164px',
  height = '112px',
  className = '',
  ...props
}) => (
  <StyledCard
    clickable={!!onClick}
    onClick={onClick}
    className={`feature-card ${className}`}
    style={{ width, height, ...props.style }}
    {...props}
  >
    <CardContent style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '16px 8px',
      height: '100%',
      position: 'relative'
    }}>
      {tags.length > 0 && (
        <div style={{ position: 'absolute', top: '4px', right: '4px' }}>
          {tags.map((tag, index) => (
            <span
              key={index}
              style={{
                fontSize: '10px',
                backgroundColor: '#2B9CAE',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '10px',
                marginLeft: '2px'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {image && (
        <div style={{ marginBottom: '8px' }}>
          {typeof image === 'string' ? (
            <img src={image} alt={title} style={{ width: '32px', height: '32px' }} />
          ) : (
            <div style={{ fontSize: '32px', color: '#2B9CAE' }}>{image}</div>
          )}
        </div>
      )}
      
      {title && (
        <div style={{ 
          fontSize: '12px', 
          fontWeight: 600, 
          color: '#2c3e50',
          lineHeight: 1.2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {title}
        </div>
      )}
      
      {description && (
        <div style={{ 
          fontSize: '10px', 
          color: '#7f8c8d',
          marginTop: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {description}
        </div>
      )}
    </CardContent>
  </StyledCard>
);

export default Card;
