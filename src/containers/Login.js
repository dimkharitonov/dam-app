import React, { Component } from 'react';
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
    console.log(`validate form ${this.state.email.length} && ${this.state.password.length}`);
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    console.log( `set ${event.target.id} to ${event.target.value}`);
    this.setState(
      {[event.target.id]: event.target.value}
    );
  };

  handleSubmit = event => {
    console.log('Submit login form event');
    event.preventDefault();
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