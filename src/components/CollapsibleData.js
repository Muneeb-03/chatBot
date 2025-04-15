import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Paper from "@mui/material/Paper";

// Component for collapsible JSON/CSV data sections
const CollapsibleData = ({ title, data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        marginBottom: "16px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          backgroundColor: "#f5f5f5",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#eeeeee",
          },
        }}
        onClick={toggleExpand}
      >
        <IconButton
          size="small"
          sx={{
            mr: 1,
            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          {isExpanded ? <ExpandMoreIcon /> : <KeyboardArrowRightIcon />}
        </IconButton>
        <Typography variant="subtitle2" fontWeight="medium">
          {title}
        </Typography>
      </Box>

      {isExpanded && (
        <Box
          sx={{
            padding: "16px",
            maxHeight: "400px",
            overflowY: "auto",
            backgroundColor: "#fafafa",
          }}
        >
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              fontSize: "0.875rem",
              fontFamily: "monospace",
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </Box>
      )}
    </Paper>
  );
};

export default CollapsibleData;
