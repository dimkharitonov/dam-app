import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import LoginForm from '../ui/LoginForm';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false
    };
  }

  validateForm = () => {
    return this.state.email.length > 0 && this.state.password.length > 0;
  };

  buildErrorMessage = (email, password) => {
    let params = [
        email.length === 0 ? 'email' : null,
        password.length === 0 ? 'password' : null
    ].filter(p => p !== null);

    return params.length > 0 ? params.join(' or ') + ' shall not be empty' : '';
  };

  setErrorMessage = message => this.setState({
    errorMessage: message
  });

  handleChange = event => {
    let { email, password} = {
      ...this.state,
      [event.target.id]: event.target.value
    };

    console.log('change',event.target.id, event.target.value);

    this.setState(
      {
        [event.target.id]: event.target.value,
        errorMessage: this.buildErrorMessage(email, password)
      }
    );
  };


  handleSubmit = async event => {
    event.preventDefault();
    this.setState({isLoading: true});

    try {
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
    } catch(e) {
      this.setErrorMessage(e.message);
      this.setState({isLoading: false});
    }
  };

  render() {
    return(
      <div className="Login">
        <p>
          Restricted area. Please Login.
        </p>
        <LoginForm
          isLoading={this.state.isLoading}
          error={this.state.errorMessage}
          isNotValid={!this.validateForm()}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
        />
      </div>
    );
  }
}