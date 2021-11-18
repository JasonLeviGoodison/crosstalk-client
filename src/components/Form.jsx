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
import { Divider, Grid } from '@mui/material';
import Languages from "../localization/languages"; 

const Form = ({history}) => {
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [learningLanguage, setLearningLanguage] = useState("")

  const fieldSettingList = [setNativeLanguage, setLearningLanguage];

  const languageLearningOptions = [
    "English",
    "Spanish",
  ]

  
  function onChange(setter, value) {
    setter(value)
  }

  async function findPartnerNow() {
    if (learningLanguage === '' || nativeLanguage === '') {
      alert("Please fill out form");
      return;
    }
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
    <Grid justifyContent="center" style={{marginRight: 'auto', marginLeft: 'auto', marginTop: 100 }}>
      <div>
        <div style={{marginBottom: 30, fontWeight: 700, fontSize: 26, color: '#3c3c3c', borderRadius: 16}}>{Languages.FindAPartner}</div>
        <div>
        {
          fieldSettingList.map((y, index) => {
            return (
              <Box sx={{ minWidth: 120, paddingBottom: 1.5, textAlign: "left" }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">{index === 0 ? Languages.Native : Languages.Learning}</InputLabel>
                  <Select
                    style={{backgroundColor: '#F7F7F7', borderRadius: 16}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={index === 0 ? nativeLanguage : learningLanguage}
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
          learningLanguage != null && <Button style={{backgroundColor: '#1DB0F6', borderColor: '#1DB0F6', borderRadius: 16}} onClick={findPartnerNow}> {Languages.Search} </Button>
        }
          <div style={{paddingTop: 30}}>
            <Divider/>
            be sure to checkout our <a href="https://www.meetup.com/virtual-language-exchange-pidginpost"> events </a>
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default withRouter(Form);