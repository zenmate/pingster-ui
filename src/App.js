import './App.css';

import moment from 'moment';
import Modal from 'react-modal';
import { Table } from 'reactable';
import React, { Component } from 'react';
import { list, rescan, auth } from './api';

const errorCoding = {
  1: 'is-informational',
  2: 'is-success',
  3: 'is-redirection',
  4: 'is-client-error',
  5: 'is-server-error'
};

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lastRunAt: 0,
      projects: [],
      openProject: {
        testResults: []
      },
      isRescanning: false,
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

  Url(url) {
    return (
      <a href={url}>{url}</a>
    );
  }

  Status(status) {
    let className = '';
    let displayedStatus = status;

    if (typeof status === 'string') {
      className = `is-${status.toLowerCase()}`;
    }

    if (typeof status === 'number') {
      const firstNumber = status.toString()[0];
      className = firstNumber ? errorCoding[firstNumber] : '';
    }

    if (typeof status === 'boolean') {
      className = status ? 'is-success' : 'is-error';
      displayedStatus = status ? 'OK' : 'ERROR';
    }

    return (
      <div className={'status ' + className}>{displayedStatus}</div>
    );
  }

  UpdatedAt(row) {
    return moment(row.updatedAt).fromNow();
  }

  rowRepresentation(row) {
    return {
      'status': this.Status(row.status),
      'name': row.name,
      'repository': row.fullName,
      'updated:': this.UpdatedAt(row),
      'more': this.ShowMore(row)
    };
  }

  testRowRepresentation(row) {
    const { status } = row.response;

    return {
      'status': this.Status(row.success),
      'code': this.Status(status),
      'name': row.name,
      'url': this.Url(row.url)
    }
  }

  showMore(row) {
    const toDisplay = { ...row };

    toDisplay.testResults = toDisplay.testResults.map(this.testRowRepresentation.bind(this));

    this.setState({
      openProject: toDisplay,
      modalOpen: true
    });
  }

  fetchProjects() {
    list()
      .then((response) => {
        const { lastRunAt, repos } = response;

        this.setState({
          lastRunAt,
          projects: repos.map((r) => this.rowRepresentation(r))
        });
      })
      .catch(console.error);
  }

  handleRescanProjects(e) {
    e.preventDefault();

    this.setState({
      isRescanning: true
    });

    rescan()
      .then(() => {
        return this.fetchProjects();
      })
      .then(() => {
        this.setState({
          isRescanning: false
        });
      })
      .catch((err) => {
        console.error(err);

        this.setState({
          isRescanning: false
        });
      });
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

          <button className='btn btn-rescan is-creamy' onClick={this.handleRescanProjects.bind(this)}>
            { this.state.isRescanning ? (
              <span className='fa fa-cog fa-spin is-loading'></span>
            ) : 'Rescan'}
          </button>

          <div className='last-rescan'>
            {this.lastRescanMessage()}
          </div>
        </div>

        <Modal isOpen={this.state.modalOpen} onRequestClose={this.onModalClose.bind(this)}>
          <h2>{ this.state.openProject.name }</h2>
          <div className="modal-box">
            <div className="modal-box-item">
              <label>Default Branch:</label>
              <span>{ this.state.openProject.defaultBranch }</span>
            </div>
            <div className="modal-box-item">
              <label>Description:</label>
              <span>{ this.state.openProject.description }</span>
            </div>
            <div className="modal-box-item">
              <label>Language:</label>
              <span>{ this.state.openProject.language }</span>
            </div>
            <div className="modal-box-item">
              <label>Full Name:</label>
              <span>{ this.state.openProject.fullName }</span>
            </div>
          </div>
          <div className="modal-box">
            <Table className="table" data={this.state.openProject.testResults} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
