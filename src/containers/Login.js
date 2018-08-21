import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import './Login.css';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState(
      {[event.target.id]: event.target.value}
    );
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.userHasAuthenticated(true);
    this.props.history.push('/');
  };

  render() {
    return(
      <div className="Login">
        <p>
          Restricted area. Please Login.
        </p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-field">
            <label htmlFor="email-field">Email</label>
            <input
              id="email"
              name="email"
              type="text"
              onChange={this.handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password-field">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={this.handleChange}
            />
          </div>

          <input
            type="submit"
            disabled={!this.validateForm()}
            value="Login"/>
        </form>
      </div>
    );
  }
}