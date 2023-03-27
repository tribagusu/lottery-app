import { useState, useEffect } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);

  useEffect(() => {
    const getManager = async () => {
      setManager(await lottery.methods.manager().call());
    };
    const getPlayers = async () => {
      setPlayers(await lottery.methods.getPlayers().call());
    };
    const getBalance = async () => {
      setBalance(await web3.eth.getBalance(lottery.options.address));
    };

    getManager();
    getPlayers();
    getBalance();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setLoading(true);
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(amount, "ether"),
    });
    setLoading(false);
    setOnSuccess(true);
  };

  console.log(web3);
  console.log(web3.eth.getAccounts().then(console.log));

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager} <br />
        There are currently {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <hr />
      <form onSubmit={handleSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <br />
          <input
            required
            type="text"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
        </div>
        <button>Enter</button>
      </form>
      {loading && <h5>waiting on transaction success...</h5>}
      {onSuccess && <h5>You have been entered!</h5>}
    </div>
  );
}

export default App;
