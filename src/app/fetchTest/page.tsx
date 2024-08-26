import React from 'react';

export default async function Page() {
  const response = await fetch('https://viacep.com.br/ws/01001000/json/');
  const data = await response.json();

  return (
    <div>
      <h1>Data fetched from API</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
