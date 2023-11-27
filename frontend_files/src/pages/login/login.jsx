// pages/Login.js

import { Component } from 'react';
import React from 'react';

import './login.css';

export default class Login extends Component{
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    console.log( email, password);
    fetch("http://localhost:5000/login", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "UserRegister");
        if(data.status ==="ok"){
          alert("Loggin successful");
          window.localStorage.setItem("token",data.data);
          window.location.href='./home'
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }
  render(){
  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={this.handleSubmit}>
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
              onChange={(e)=>this.setState({password: e.target.value})}
              className="form-control"
            />
          </label>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
      <p>
        New user? <a href="/signup">Click here</a> to sign up.
      </p>
    </div>
  );
}};
