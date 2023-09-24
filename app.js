window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
            startApp();
        } catch (error) {
            console.error("User denied account access...")
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        startApp();
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

async function startApp() {
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = ExchangeRateBetting.networks[networkId];
    const instance = new web3.eth.Contract(
        ExchangeRateBetting.abi,
        deployedNetwork && deployedNetwork.address,
    );

    const placeBetButton = document.querySelector('button');
    placeBetButton.addEventListener('click', async () => {
        const betRate = document.getElementById('betRate').value;
        const above = document.getElementById('above').value === 'true';
        await instance.methods.placeBet(betRate, above).send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') });
    });

    const settleBetButton = document.querySelector('button');
    settleBetButton.addEventListener('click', async () => {
        await instance.methods.settleBet().send({ from: accounts[0] });
    });
}
