import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { Category as CategoryIcon } from '@mui/icons-material';

const CategoryCard = ({ category }) => {
  return (
    <Card
      component={RouterLink}
      to={`/events?category=${encodeURIComponent(category.category_name)}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2.5,
        bgcolor: '#ffffff',
        border: '1px solid #f1f5f9',
        borderRadius: 4,
        textDecoration: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: 'primary.main',
          boxShadow: '0 8px 20px rgba(79, 70, 229, 0.08)'
        }
      }}
    >
      <Avatar
        sx={{
          width: 50,
          height: 50,
          bgcolor: 'rgba(79, 70, 229, 0.1)',
          color: 'primary.main',
          borderRadius: 3
        }}
      >
        <CategoryIcon />
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }} noWrap>
          {category.category_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {category.event_count || 0} Events Available
        </Typography>
      </Box>
    </Card>
  );
};

export default CategoryCard;
