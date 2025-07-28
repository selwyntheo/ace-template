import React, { useState } from 'react';
import {
  Box,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Typography,
  Collapse
} from '@mui/material';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledAccordion = styled(MuiAccordion)(({ theme }) => ({
  border: '1px solid #e0e0e0',
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `${theme.spacing(1)} 0`,
  },
}));

const StyledAccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  backgroundColor: '#fafafa',
  borderRadius: theme.spacing(1),
  '&.Mui-expanded': {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  '& .MuiAccordionSummary-content': {
    margin: `${theme.spacing(1)} 0`,
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: '#2B9CAE',
  },
}));

const StyledAccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid #e0e0e0',
}));

// Basic Accordion Component
export const Accordion = ({
  title,
  children,
  expanded,
  onChange,
  disabled = false,
  defaultExpanded = false,
  icon,
  summary,
  className = '',
  ...props
}) => (
  <StyledAccordion
    expanded={expanded}
    onChange={onChange}
    disabled={disabled}
    defaultExpanded={defaultExpanded}
    className={className}
    {...props}
  >
    <StyledAccordionSummary expandIcon={<ExpandMore />}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {summary && (
            <Typography variant="body2" color="text.secondary">
              {summary}
            </Typography>
          )}
        </Box>
      </Box>
    </StyledAccordionSummary>
    <StyledAccordionDetails>
      {children}
    </StyledAccordionDetails>
  </StyledAccordion>
);

// Accordion Group
export const AccordionGroup = ({
  items = [],
  allowMultiple = false,
  className = '',
  ...props
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const handleChange = (itemId) => (event, isExpanded) => {
    if (allowMultiple) {
      const newExpanded = new Set(expandedItems);
      if (isExpanded) {
        newExpanded.add(itemId);
      } else {
        newExpanded.delete(itemId);
      }
      setExpandedItems(newExpanded);
    } else {
      setExpandedItems(isExpanded ? new Set([itemId]) : new Set());
    }
  };

  return (
    <Box className={className} {...props}>
      {items.map((item, index) => (
        <Accordion
          key={item.id || index}
          title={item.title}
          summary={item.summary}
          icon={item.icon}
          expanded={expandedItems.has(item.id || index)}
          onChange={handleChange(item.id || index)}
          disabled={item.disabled}
        >
          {item.content}
        </Accordion>
      ))}
    </Box>
  );
};

// Simple Collapsible Section
export const CollapsibleSection = ({
  title,
  children,
  open = false,
  onToggle,
  icon = <ChevronRight />,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleToggle = () => {
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    onToggle?.(newOpen);
  };

  return (
    <Box className={className} {...props}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: 1,
          borderRadius: 1,
          '&:hover': {
            backgroundColor: 'rgba(43, 156, 174, 0.04)',
          },
        }}
        onClick={handleToggle}
      >
        <Box
          sx={{
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            mr: 1,
            color: '#2B9CAE',
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      
      <Collapse in={isOpen}>
        <Box sx={{ pl: 4, pt: 1 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

// FAQ Style Accordion
export const FAQAccordion = ({
  faqs = [],
  className = '',
  ...props
}) => (
  <AccordionGroup
    items={faqs.map((faq, index) => ({
      id: faq.id || index,
      title: faq.question,
      content: (
        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
          {faq.answer}
        </Typography>
      ),
    }))}
    allowMultiple={true}
    className={className}
    {...props}
  />
);

// Settings Accordion
export const SettingsAccordion = ({
  sections = [],
  className = '',
  ...props
}) => (
  <AccordionGroup
    items={sections.map((section, index) => ({
      id: section.id || index,
      title: section.title,
      summary: section.description,
      icon: section.icon,
      content: section.content,
      disabled: section.disabled,
    }))}
    allowMultiple={true}
    className={className}
    {...props}
  />
);

export default Accordion;
