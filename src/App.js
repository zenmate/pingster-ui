import React, { Component } from 'react';
import { Table } from 'reactable';
import { list, rescan } from './api';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { 
      lastRunAt: 0, 
      projects: []
    };
    
    this.fetchProjects();
  }

  fetchProjects () {
    list().then((response) => {
      const { lastRunAt, projects } = response;
      this.setState({lastRunAt, projects});   
    }).catch(console.error);
  }

  handleRescanProjects (e) {
    e.preventDefault();
    rescan()
      .then(this.fetchProjects)
      .catch(console.error);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">IP Checker</h1>
        </header>
        <Table className="table" data={this.state.projects} />
        <button className="btn btn-rescan" onClick={this.handleRescanProjects.bind(this)}>
          do rescan!
        </button>
      </div>
    );
  }
}

export default App;
