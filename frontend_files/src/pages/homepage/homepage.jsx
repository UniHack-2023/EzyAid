import React,{Component} from 'react'

export default class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData:" ",
        }
    }
    componentDidMount(){
        fetch("http://localhost:5000/user", {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              token:window.localStorage.getItem("token"),
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data, "UserData");
              this.setState({userData:data.data});
            })
            .catch((error) => {
              console.error("Fetch error:", error);
            });
    }
    render(){
  return (
    <div>
        Email<h1>{this.state.UserData.email}</h1>
    </div>
  );
}
}

