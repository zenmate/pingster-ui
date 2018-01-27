import React, { Component } from 'react';
import { Table } from 'reactable';
import Modal from 'react-modal';
import { list, rescan, auth } from './api';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lastRunAt: 0,
      projects: [],
      openProject: {
        testResults: []
      },
      modalOpen: false
    };

    auth().then(() => {
      this.fetchProjects();
    });
  }

  ShowMore (row) {
    return (
      <button className='btn btn-show-more' onClick={() => this.showMore(row)}>show</button>
    );
  }

  Status (row) {
    return (
      <div className={'status status-' + row.status.toLowerCase()}>{row.status}</div>
    );
  }

  UpdatedAt (row) {
    const d = new Date(row.updatedAt);
    return d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
  }

  rowRepresentation (row) {
    return {
      'Status': this.Status(row),
      'Name': row.name,
      'Language': row.language,
      'Repository': row.fullName,
      'Updated At:': this.UpdatedAt(row),
      'More': this.ShowMore(row)
    };
  }

  testRowRepresentation (row) {
    return {
      'Success': row.success,
      'Name': row.name,
      'Url': row.url
    }
  }

  showMore (row) {
    row.testResults = row.testResults.map(this.testRowRepresentation.bind(this))
    this.setState({
      openProject: row,
      modalOpen: true
    });
  }

  fetchProjects () {
    list().then((response) => {
      const { lastRunAt, repos } = response;
      this.setState({
        lastRunAt,
        projects: repos.map(this.rowRepresentation.bind(this))
      });
    }).catch(console.error);
  }

  handleRescanProjects (e) {
    e.preventDefault();
    rescan()
      .then(this.fetchProjects)
      .catch(console.error);
  }

  onModalClose () {
    this.setState({
      modalOpen: false
    })
  }

  render() {
    return (
      <div className='App'>
        <div className='app-inner'>
          <header className='App-header'>
            <div className='logo'>
              <img className='logo-img' src='pingster.png' alt='pingster' />
              <h1 className='logo-text'>Pingster</h1>
            </div>
          </header>
          <Table className='table' data={this.state.projects} sortable={true} />
          <button className='btn btn-rescan' onClick={this.handleRescanProjects.bind(this)}>
            rescan!
          </button>
        </div>
        <Modal isOpen={this.state.modalOpen} onRequestClose={this.onModalClose.bind(this)}>
          <h2>Infos</h2>
          <label>Name:</label>
          { this.state.openProject.name }
          <label>Default Branch:</label>
          { this.state.openProject.defaultBranch }
          <label>Description:</label>
          { this.state.openProject.description }
          <label>Language:</label>
          { this.state.openProject.language }
          <label>Full Name:</label>
          { this.state.openProject.fullName }
          <label>Tests:</label>
          <Table className="table" data={this.state.openProject.testResults} />
        </Modal>
      </div>
    );
  }
}

export default App;
