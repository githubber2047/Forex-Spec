const abi = [
    {
        "constant": false,
        "inputs": [],
        "name": "placeBet",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "settleBet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "bets",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = '0x4A574D86E475dCa902a3F805AA9fC65274E028fE';

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
    const instance = new web3.eth.Contract(abi, contractAddress);

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
