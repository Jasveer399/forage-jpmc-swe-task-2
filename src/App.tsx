import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

interface IState {
  data: ServerRespond[],
  showGraph: boolean,
}

class App extends Component<{}, IState> {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      data: [],
      showGraph: false,
    };
  }

  getDataFromServer = () => {
    const fetchData = () => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({
          data: serverResponds,
          showGraph: true,
        });
      });
    }

    fetchData(); // Fetch immediately
    this.intervalId = setInterval(fetchData, 100); // Then every 100ms
  }

  stopStreaming = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.setState({ showGraph: false });
  }

  handleStreamButtonClick = () => {
    if (this.state.showGraph) {
      this.stopStreaming();
    } else {
      this.getDataFromServer();
    }
  }

  componentWillUnmount() {
    this.stopStreaming(); // Ensure we clean up on unmount
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button 
            className="btn btn-primary Stream-button"
            onClick={this.handleStreamButtonClick}>
            {this.state.showGraph ? 'Stop Streaming Data' : 'Start Streaming Data'}
          </button>
          <div className="Graph">
            {this.state.showGraph && <Graph data={this.state.data} />}
          </div>
        </div>
      </div>
    )
  }
}

export default App;