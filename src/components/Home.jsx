import React from 'react';
import HowToUse from './HowToUse';
import Form from './Form';

const Home = () => {
  return (
    <>
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <Form/>
    </div>
    </>
  );
};

/**
 * style={{
      backgroundImage: "url(https://media.istockphoto.com/photos/landscape-of-coron-busuanga-island-palawan-province-philippines-picture-id521110659)",
      backgroundRepeatX: "no-repeat",
      backgroundSize: "cover",
      height: "100vh"
    }}
 */

export default Home;