import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Divider } from '@mui/material';

const HowToUse = () => {
  const rules = [
    <div>You speak your native language, they speak their native language. (If you are skeptical, check our <a href="google.com"> why this works</a>)</div>,
    "Never speak the other persons language",
    "Use actions, drawings, props, and whatever else you need to explain what you are saying.",
    "Never harass anyone for any reason! This is not a dating site!",
    "This is a beta, please provide as much feedback as possible jasongoodisondevelopment@gmail.com"
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 150, marginTop: 100}}>
      <Accordion style={{ maxWidth: 500 }} expanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h2 style={{textAlign: 'center'}}> Rules </h2>
        </AccordionSummary>
        <AccordionDetails>
        <List>
        {
          rules.map((x, index) => {
            return (
              <ListItem>
                  <div style={{display: 'flex'}}> {index + 1}.{'  '} {x} </div>
                  <Divider/>
              </ListItem>
            )
          })
        }
        </List>
        </AccordionDetails>
      </Accordion>
    </div>
  ) 
};

export default HowToUse;