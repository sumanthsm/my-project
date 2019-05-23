import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, Redirect  } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            racf: '',
            fullName: '',
            login: localStorage.getItem('login') || false,
            containerMargin: '80px',
            navWidth: '80px',
            navMarginLeft: '0px',
            isMenuExpanded: false
        }
    }

    handleChange = (e) => {
        console.log(e.target.id);
        
        if (e.target.id === 'racf') {
            this.setState({ racf: e.target.value });
        } else if (e.target.id === 'fullName') {
            this.setState({ fullName: e.target.value });
        } 
    }

    handleSubmmit = () => {
        const { racf, fullName } = this.state;
        if(racf !== '' || fullName !== ''){
            localStorage.setItem('racf', racf);
            localStorage.setItem('fullName', fullName);
            localStorage.setItem('login', true);
            this.setState({login: true});
        }
        Swal.fire({
            type: 'success',
            title: 'Login Successful!',
            showConfirmButton: false,
            timer: 1500
        });
    }

    renderRedirect = () => {
        if (this.state.login) {
            return <Redirect to='/home' />
        }
    }

    openNav = () => {
        this.setState({
            containerMargin: '250px',
            isMenuExpanded: true,
            navWidth: '250px',
            navMarginLeft: '250px'
        });
    }

    closeNav = () => {
        this.setState({
            containerMargin: '80px',
            isMenuExpanded: false,
            navWidth: '80px',
            navMarginLeft: '0px'
        });
    }

    render() {
        return (
            <div id="container">
                {this.renderRedirect()}
                <div style={{ position: 'relative' }}>
                    <div id="mySidenav" className="sidenav" style={{ width: this.state.navWidth }}>
                        <span style={{ fontSize: '30px', cursor: 'pointer', color: 'white', padding: '30px' }} onClick={this.openNav}>&#9776; </span>
                        {
                            this.state.isMenuExpanded ? <a href="javascript:void(0)" className="closebtn" onClick={this.closeNav}>&times;</a> : null
                        }
                        <div className="row" style={{ marginLeft: '25px', paddingTop: '15px', color: 'white' }}>
                            <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                            {
                                this.state.isMenuExpanded ? <Link to="/" style={{ transition: '0.5s' }}>Home</Link> : null
                            }
                        </div>
                        <hr />
                    </div>
                    <div style={{ marginLeft: this.state.containerMargin, transition: '0.5s' }}>
                        <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
                            <span style={{ color: 'white', padding: '12px 0px' }}>EIS App Store</span>
                        </nav>
                        <div className="container mt-3">
                            <div className="form-group">
                                <label htmlFor="racf">Racf*</label>
                                <input type="text" className="form-control" id="racf" style={{width: '40%'}} value={this.state.racf} placeholder="Racf" onChange={this.handleChange}></input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input type="text" className="form-control" id="fullName" style={{width: '40%'}} value={this.state.fullName} placeholder="Full Name" onChange={this.handleChange}></input>
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={this.handleSubmmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}