import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import RuleStrings from '../localization/rules';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Divider } from '@mui/material';

const HowToUse = () => {
  const rules = [
    <div>{RuleStrings.howToRule1} (<a href="/method"> {RuleStrings.whyThisWorks} </a>)</div>,
    RuleStrings.howToRule2,
    RuleStrings.howToRule3,
    RuleStrings.howToRule4,
    RuleStrings.howToRule5
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 150, marginTop: 100}}>
      <Accordion style={{ }} expanded={true}>
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