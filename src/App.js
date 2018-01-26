import React, { Component } from 'react';
import { Table, Tr, Td, unsafe } from 'reactable';
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

  rowRepresentation (row) {
    const d = new Date(row.updatedAt); 
    const updatedAt = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
    const status = <div className={'status status-' + row.status.toLowerCase()}>{row.status}</div>;

    return {
      ...row, 
      updatedAt,
      status
    };
  }

  fetchProjects () {
    list().then((response) => {
      const { lastRunAt, projects } = response;
      this.setState({
        lastRunAt,
        projects: projects.map(this.rowRepresentation)
      });
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
        <div className="app-inner">
          <header className="App-header">
            <div className="logo">
              <img className="logo-img" src="pingster.png"/>
              <h1 className="logo-text">Pingster</h1>
            </div>
          </header>
          <Table className="table" data={this.state.projects} sortable={true}/>
          <button className="btn btn-rescan" onClick={this.handleRescanProjects.bind(this)}>
            rescan!
          </button>
          <div>
            <p className="last-run">last run at {this.state.lastRunAt}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
