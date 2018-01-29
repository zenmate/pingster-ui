import './App.css';

import moment from 'moment';
import Modal from 'react-modal';
import { Table } from 'reactable';
import React, { Component } from 'react';
import { list, rescan, auth } from './api';

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

    Modal.setAppElement('#root');
  }

  ShowMore(row) {
    return (
      <button className='btn btn-show-more' onClick={() => this.showMore(row)}>show</button>
    );
  }

  Status(row) {
    return (
      <div className={'status status-' + row.status.toLowerCase()}>{row.status}</div>
    );
  }

  UpdatedAt(row) {
    return moment(row.updatedAt).fromNow();
  }

  rowRepresentation(row) {
    return {
      'Status': this.Status(row),
      'Name': row.name,
      'Language': row.language,
      'Repository': row.fullName,
      'Updated At:': this.UpdatedAt(row),
      'More': this.ShowMore(row)
    };
  }

  testRowRepresentation(row) {
    return {
      'Success': row.success,
      'Name': row.name,
      'Url': row.url
    }
  }

  showMore(row) {
    row.testResults = row.testResults.map(this.testRowRepresentation.bind(this))

    this.setState({
      openProject: row,
      modalOpen: true
    });
  }

  fetchProjects() {
    list().then((response) => {
      const { lastRunAt, repos } = response;
      this.setState({
        lastRunAt,
        projects: repos.map(this.rowRepresentation.bind(this))
      });
    }).catch(console.error);
  }

  handleRescanProjects(e) {
    e.preventDefault();

    rescan().then(() => {
      this.fetchProjects();
    })
    .catch(console.error);
  }

  onModalClose() {
    this.setState({
      modalOpen: false
    })
  }

  lastRescanMessage() {
    return this.state.lastRunAt ? `Last rescan was ${moment(this.state.lastRunAt).fromNow()}` : '';
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

          {this.state.projects.length ? (
            <Table className='table' data={this.state.projects} sortable={true} />
          ) : ''}

          <button className='btn btn-rescan' onClick={this.handleRescanProjects.bind(this)}>
            Rescan
          </button>

          <div className='last-rescan'>
            {this.lastRescanMessage()}
          </div>
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
