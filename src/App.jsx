import React, { useState, useEffect } from 'react';
import SupabaseTable from './Components/SupabaseTable';

function App() {

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', }}>

      <div style={{ padding : '20px',border: '1px solid #ccc', borderRadius: '8px', marginTop : '10px'}}>
        <SupabaseTable />

      </div>

    </div>
  );
}

export default App;