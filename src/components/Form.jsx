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
import { Grid } from '@mui/material';
import Languages from "../localization/languages"; 

const Form = ({history}) => {
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [learningLanguage, setLearningLanguage] = useState("")

  const fieldSettingList = [setNativeLanguage, setLearningLanguage];

  const languageLearningOptions = [
    "English",
    "Spanish",
    "French",
  ]

  
  function onChange(setter, value) {
    setter(value)
  }

  async function findPartnerNow() {
    if (learningLanguage === nativeLanguage) {
      alert("Please choose different languages");
      return;
    }
    let roomId = await getJoinableRoomId();
    history.push({
      state: {
        learning: learningLanguage,
        native: nativeLanguage
      },
      pathname: routes.ROOM + "/" + roomId
    })
  }

  async function getJoinableRoomId() {
    return await roomApi.GetJoinableRoom(nativeLanguage, learningLanguage);
  }


  //backgroundColor: 'white', padding: 32, position: "absolute"
  return (
    <Grid justifyContent="center" style={{width: '25%', marginRight: 'auto', marginLeft: 200, marginTop: 100}}>
      <div>
        <h1 style={{marginBottom: 30}}>CrossTalk (Beta)</h1>
        <div>
        {
          fieldSettingList.map((y, index) => {
            return (
              <Box sx={{ minWidth: 120, paddingBottom: 1.5, textAlign: "left" }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">{index === 0 ? Languages.Native : Languages.Learning}</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={index == 0 ? nativeLanguage : learningLanguage}
                    label={"Learning"}
                    onChange={(evt) => onChange(y, evt.target.value)}
                  >
                    {
                      languageLearningOptions.map((x) => <MenuItem value={x}> {Languages[x]} </MenuItem>)
                    }
                  </Select>
                </FormControl>
              </Box>
            )
          })
        }
        {
          learningLanguage != null && <Button variant="primary" onClick={findPartnerNow}> {Languages.FindAPartner} </Button>
        }
        </div>
      </div>
    </Grid>
  );
};

export default withRouter(Form);