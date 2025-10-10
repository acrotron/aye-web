// components/InfoContent/InfoContent.jsx
import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import NoteIcon from '@mui/icons-material/Note';
import ImageIcon from '@mui/icons-material/Image';
import CopyButton from '../CopyButton/CopyButton'; // <-- added import

/**
 * Renders the list of additional‑info items using MUI `Card`s.
 * Fixed layout:
 *   • Cards no longer shrink (`flexShrink: 0`).
 *   • Code blocks have a max‑height of **500 px** and vertical scroll.
 *   • **Copy** button added to code‑fragment headers.
 */
const InfoContent = ({ items, onRemoveItem }) => {
  if (!items || items.length === 0) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Code snippets, sources, and additional information will appear here.
        </Typography>
      </Box>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'code':
        return <CodeIcon />;
      case 'source':
        return <LinkIcon />;
      case 'note':
        return <NoteIcon />;
      case 'image':
        return <ImageIcon />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
      }}
    >
      {items.map((item, idx) => (
        <Card
          key={idx}
          sx={{
            backgroundColor: 'var(--info-item-bg)',
            border: '1px solid var(--info-item-header-border)',
            flexShrink: 0, // prevent the card from collapsing when space is limited
          }}
        >
          <CardHeader
            avatar={getIcon(item.type)}
            title={
              <Typography variant="subtitle1" sx={{ color: 'var(--info-item-title-color)' }}>
                {item.title}
              </Typography>
            }
            action={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Copy button – only for code fragments */}
                {item.type === 'code' && (
                  <Tooltip title="Copy code">
                    <CopyButton content={item.content} className="" />
                  </Tooltip>
                )}
                {/* Remove button (always shown) */}
                <Tooltip title="Remove">
                  <IconButton
                    size="small"
                    onClick={() => onRemoveItem(idx)}
                    aria-label="remove"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            }
            sx={{
              backgroundColor: 'var(--info-item-header-bg)',
              borderBottom: '1px solid var(--info-item-header-border)',
              color: 'var(--info-item-title-color)',
            }}
          />
          <CardContent
            sx={{
              backgroundColor: 'var(--info-item-bg)',
              color: 'var(--info-item-text-color)',
            }}
          >
            {item.type === 'code' && (
              // Code block with max height and vertical scrolling
              <Box
                component="pre"
                sx={{
                  backgroundColor: 'var(--info-item-header-bg)',
                  p: 1,
                  borderRadius: 1,
                  overflowX: 'auto',
                  overflowY: 'auto',
                  maxHeight: 500, // increased from 250px to 500px
                  fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                  fontSize: '0.875rem',
                }}
              >
                <code>{item.content}</code>
              </Box>
            )}
            {item.type === 'source' && (
              <Typography
                component="a"
                href={item.content}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'var(--info-item-link-color)', textDecoration: 'none' }}
              >
                {item.content}
              </Typography>
            )}
            {item.type === 'note' && <Typography>{item.content}</Typography>}
            {item.type === 'image' && (
              <Box component="img" src={item.content} alt="Additional" sx={{ maxWidth: '100%', borderRadius: 1 }} />
            )}
          </CardContent>
          <CardActions
            sx={{
              backgroundColor: 'var(--info-item-timestamp-bg)',
              borderTop: '1px solid var(--info-item-timestamp-border)',
              px: 2,
              py: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: 'var(--info-item-timestamp-color)' }}>
              {item.timestamp.toLocaleString()}
            </Typography>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default InfoContent;
