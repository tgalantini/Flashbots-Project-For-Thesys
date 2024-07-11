document.getElementById('protectForm').addEventListener('submit', async (e) => {

    e.preventDefault();
    const from = document.getElementById('from').value;
    const privateKey = document.getElementById('priv').value;
    const to = document.getElementById('to').value;
    const value = document.getElementById('value').value;
    const data = document.getElementById('data').value;
    
    if (from == '' || privateKey == ''|| to == ''|| data == ''|| value == ''){
        alert('You must fill the fields in order to send transaction')
        return;
    }
    const txParams = {from: from, to:to, data:data, value:value, privateKey:privateKey};
    await sendTransactionToBackend(txParams);
  });

  async function sendTransactionToBackend(params){
    try {
        let body = JSON.stringify(params);
        console.log(body)
        const response = await fetch('http://localhost:3600/api/executePrivateTransaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: body
        });
    
        const result = await response.json();
        console.log(result)
        await handleResponse(result);
      } catch (error) {
        alert('Error: ' + error);
      }
  }

  async function handleResponse(response){
    console.log(response.elapsedTimeBundle)
    if (response.status == "OK"){
    document.getElementById('protectForm').style.display = 'none';

    const responseContainer = document.createElement('div');
    responseContainer.innerHTML = `
      <h2>Risposta dal server</h2>
      <h1>Transazione inviata con successo</h1>
      <a href="https://sepolia.etherscan.io/tx/${response.privateTransactionHash}">Hash della transazione</a>
      <h2>Metrics:</h2>
      <h1>Tempo di invio transazione con RPC flashbots: ${response.elapsedTimePrivate} millisecondi</h1>
     <h1>Tempo di simulazione con Bundle flashbots: ${response.elapsedTimeBundle} millisecondi</h1>
    `;
    document.querySelector('.container').appendChild(responseContainer);
    document.querySelector('.container').style.display = 'block'
    } else if (response.status == "failed"){
        document.getElementById('protectForm').style.display = 'none';

    const responseContainer = document.createElement('div');
    responseContainer.innerHTML = `
      <h2>Risposta dal server</h2>
      <h1>Errore durante l'invio della transazione</h1>
      <h1>Errore: ${response.error}</h1>
    `;
    document.querySelector('.container').appendChild(responseContainer);
    document.querySelector('.container').style.display = 'block'
    }
  }
  