import React, { Component } from 'react';
import './signup.css';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      email: '',
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { fname, lname, email, password } = this.state;
    console.log(fname, lname, email, password);

    fetch("http://localhost:5000/register", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        fname,
        email,
        lname,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "UserRegister");
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }
  render(){
  return (
    <div className="signup-form">
      <h2>Signup</h2>
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              onChange={(e)=>this.setState({fname: e.target.value})}
              className="form-control"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              onChange={(e)=>this.setState({lname: e.target.value})}
              className="form-control"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <input
              type="email"
              name="email"
              onChange={(e)=>this.setState({email: e.target.value})}
              className="form-control"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <input
              type="password"
              name="password"
              onChange={(e) => this.setState({ password: e.target.value })}
              className="form-control"
            />
          </label>
        </div>
        <div className="form-group">
          <input type="submit" className="btn btn-primary"/>

        </div>
      </form>
      <p>
        Already registered? <a href="/login">Click here</a> to log in.
      </p>
    </div>
  );
};
}


