import React, {useState} from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { withRouter } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from 'react-bootstrap/Button';
import InputLabel from '@mui/material/InputLabel';
import * as roomApi from '../api/roomApi';
import * as routes from '../routes';

const Form = ({history}) => {
  const [learningLanguage, setLearningLanguage] = useState(null)

  const fieldSettingList = [setLearningLanguage];

  const languageLearningOptions = [
    "English",
    "Spanish"
  ]

  
  function onChange(setter, value) {
    setter(value)
  }

  async function findPartnerNow() {
    let roomId = await getJoinableRoomId();
    history.push(routes.ROOM + "/" + roomId)
  }

  async function getJoinableRoomId() {
    return await roomApi.GetJoinableRoom(learningLanguage);
  }

  return (
    <div style={{width: '50%', marginRight: 'auto', marginLeft: 'auto', marginTop: '10vh'}}>
      <h1 style={{marginBottom: 30}}>CrossTalk</h1>
      {
        fieldSettingList.map((y, index) => {
          return (
            <Box sx={{ minWidth: 120, paddingBottom: 1.5, textAlign: "left" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{"Learning"}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={learningLanguage}
                  label={"Learning"}
                  onChange={(evt) => onChange(y, evt.target.value)}
                >
                  {
                    languageLearningOptions.map((x) => <MenuItem value={x}> {x} </MenuItem>)
                  }
                </Select>
              </FormControl>
            </Box>
          )
        })
      }
      {
        learningLanguage != null && <Button variant="primary" onClick={findPartnerNow}> Find a partner now </Button>
      }
    </div>
  );
};

export default withRouter(Form);