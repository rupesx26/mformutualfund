import logo from './logo.svg';
import './App.css';
import Comp from './comp'
import TableComponent from './comp2';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
      <Comp/>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <TableComponent />
    </div>
  );
}

export default App;
