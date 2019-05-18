import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

export default class AddNewApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appId: '',
            appAbrev: '',
            appName: '',
            appDesc: '',
            appUrl: '',
            shortcutsData: [],
            isToggleOpen: false,
            containerMargin: '64px'
        }
    }

    componentDidMount(){
        this.getShortcutsData();
    }

    getShortcutsData = () => {
        axios.get('http://localhost:5000/api/shortcutsdata')
            .then((response) => {
                let data = response.data;
                this.setState({ shortcutsData: data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleChange = (e) => {
        console.log(e.target.id);
        
        if (e.target.id === 'appId') {
            this.setState({ appId: e.target.value });
        } else if (e.target.id === 'appAbrev') {
            this.setState({ appAbrev: e.target.value });
        } else if (e.target.id === 'appName') {
            this.setState({ appName: e.target.value });
        } else if (e.target.id === 'appDesc') {
            this.setState({ appDesc: e.target.value });
        } else if (e.target.id === 'appUrl') {
            this.setState({ appUrl: e.target.value });
        }
    }

    setAppData = (data) => {
        axios.post('http://localhost:5000/api/createapp', { data: data })
            .then((response) => {
                console.log(response, "res");
                
                if (response.data.status === 'success') {
                    Swal.fire({
                        type: 'success',
                        title: 'App created successfully.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.setState({
                        appId: '',
                        appAbrev: '',
                        appName: '',
                        appDesc: '',
                        appUrl: '',
                    })
                } else if (response.data.status === 'fail') {
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'App Id is already exist.',
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleSubmmit = () => {
        let appObj = {};
        console.log(this.state, "state");
        
        appObj['appId'] = this.state.appId;
        appObj['appAbrev'] = this.state.appAbrev;
        appObj['appName'] = this.state.appName;
        appObj['appDesc'] = this.state.appDesc;
        appObj['appUrl'] = this.state.appUrl;
        this.setAppData(appObj);
    }

    render() {
        return (
            <div id="container">

                <div style={{ position: 'relative' }}>

                <SideNav
                        style={{ background: '#007bff' }}
                    >
                        <SideNav.Toggle onClick={this.handleToggle} />
                        <SideNav.Nav defaultSelected="home">
                            <NavItem eventKey="home">
                                <NavIcon>
                                    <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                                </NavIcon>
                                <NavText>
                                    <Link to="/">Home</Link>
                                </NavText>
                            </NavItem>
                            <NavItem >

                                <NavIcon>
                                    <i className="fa fa-fw fa-plus-circle" style={{ fontSize: '1.75em' }} />
                                </NavIcon>
                                <NavText>
                                    <Link to="/addnew">
                                        Add new app
                                        </Link>
                                </NavText>
                            </NavItem>
                            <hr />
                            {
                                this.state.shortcutsData.map((shortcut, i) => {
                                    return (
                                        <NavItem key={i}>
                                            <NavIcon>
                                                <i className="fa fa-fw fa-circle-thin" style={{ fontSize: '1.75em' }} />
                                            </NavIcon>
                                            <NavText>
                                                <Link to={shortcut.appUrl}>{shortcut.appName}</Link>
                                            </NavText>
                                        </NavItem>
                                    )
                                })
                            }

                        </SideNav.Nav>
                    </SideNav>
                    <div style={{ marginLeft: this.state.containerMargin }}>
                        <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
                            <span style={{ color: 'white', padding: '12px 0px' }}>EIS App Store</span>
                        </nav>
                        <div className="container">
                            <div className="form-row mt-4">
                                <div className="form-group col-md-6">
                                    <label htmlFor="appId">APP ID:</label>
                                    <input type="number" className="form-control" id="appId" value={this.state.appId} placeholder="APP ID" onChange={this.handleChange}></input>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="appAbrev">APP ABRV</label>
                                    <input type="text" className="form-control" id="appAbrev" value={this.state.appAbrev} placeholder="APP Abrevation" onChange={this.handleChange}></input>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="appName">App Name</label>
                                <input type="text" className="form-control" id="appName" value={this.state.appName} placeholder="APP Name" onChange={this.handleChange}></input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="appDesc">App Desc</label>
                                <input type="text" className="form-control" id="appDesc" value={this.state.appDesc} placeholder="APP Descriptiom" onChange={this.handleChange}></input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="appUrl">App Url</label>
                                <input type="text" className="form-control" id="appUrl" value={this.state.appUrl} placeholder="APP Url" onChange={this.handleChange}></input>
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={this.handleSubmmit}>Create App</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}