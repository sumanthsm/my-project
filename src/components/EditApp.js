import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";

export default class EditApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appId: '',
            appAbrv: '',
            appName: '',
            appDesc: '',
            appUrl: '',
            shortcutsData: [],
            containerMargin: '80px',
            navWidth: '80px',
            navMarginLeft: '0px',
            isMenuExpanded: false,
            containerMargin: '64px'
        }
    }

    componentDidMount(){
        console.log(this.props);
        console.log(this.props.match.params.id, "id");
        const appId = this.props.match.params.id;
        this.getShortcutsData();
        this.getAppDataByID(appId);
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

    getAppDataByID = (appId) => {
        axios.get('http://localhost:5000/api/getappdata'+appId)
            .then((response) => {
                let data = response.data;
                console.log(data,"res");
                this.setState({
                    appId: data.appId,
                    appAbrv: data.appAbrv,
                    appName: data.appName,
                    appDesc: data.appDesc,
                    appUrl: data.appUrl
                })
                // this.setState({ shortcutsData: data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleChange = (e) => {
        console.log(e.target.id);
        
        if (e.target.id === 'appId') {
            this.setState({ appId: e.target.value });
        } else if (e.target.id === 'appAbrv') {
            this.setState({ appAbrv: e.target.value });
        } else if (e.target.id === 'appName') {
            this.setState({ appName: e.target.value });
        } else if (e.target.id === 'appDesc') {
            this.setState({ appDesc: e.target.value });
        } else if (e.target.id === 'appUrl') {
            this.setState({ appUrl: e.target.value });
        }
    }

    updateAppData = (data) => {
        console.log("update app");
        axios.post('http://localhost:5000/api/editapp', { data: data })
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
                        appAbrv: '',
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
        console.log("handlesubmit");
        
        let appObj = {};
        appObj['appId'] = this.state.appId;
        appObj['appAbrv'] = this.state.appAbrv;
        appObj['appName'] = this.state.appName;
        appObj['appDesc'] = this.state.appDesc;
        appObj['appUrl'] = this.state.appUrl;
        this.updateAppData(appObj);
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
        const racf = localStorage.getItem('racf');
        const fullName = localStorage.getItem('fullName');
        return (
            <div id="container">
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
                        <div className="row" style={{ marginLeft: '25px', paddingTop: '15px', color: 'white' }}>
                            <i className="fa fa-fw fa-list" style={{ fontSize: '1.75em' }} />
                            {
                                this.state.isMenuExpanded ? <Link to="/applist" style={{ transition: '0.5s' }}>List of Apps</Link> : null
                            }
                        </div>
                        <hr />
                        {
                            this.state.shortcutsData.map((shortcut, i) => {
                                return (
                                    <div className="row" style={{ marginLeft: '25px', paddingTop: '15px', color: 'white' }}>
                                        <i className="fa fa-fw fa-circle-thin" style={{ fontSize: '1.75em' }} />
                                        {
                                            this.state.isMenuExpanded ? <Link to={shortcut.appUrl} style={{ transition: '0.5s' }}>{shortcut.appName}</Link> : null
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div style={{ marginLeft: this.state.containerMargin, transition: '0.5s' }}>
                        <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
                            <span style={{ color: 'white', padding: '12px 0px' }}>EIS App Store</span>
                        </nav>
                        <div className="container">
                        <div className="form-row mt-4">
                                <div className="form-group col-md-6">
                                    <label htmlFor="racf">Racf*</label>
                                    <input type="text" className="form-control" id="racf" value={racf} disabled></input>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input type="text" className="form-control" id="fullName" value={fullName} disabled></input>
                                </div>
                            </div>
                            <div className="form-row mt-4">
                                <div className="form-group col-md-6">
                                    <label htmlFor="appId">APP ID:</label>
                                    <input type="number" className="form-control" id="appId" value={this.state.appId} placeholder="APP ID" disabled></input>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="appAbrv">APP ABRV</label>
                                    <input type="text" className="form-control" id="appAbrv" value={this.state.appAbrv} placeholder="APP Abrevation" onChange={this.handleChange}></input>
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
                            <button type="submit" className="btn btn-primary" onClick={this.handleSubmmit}>Update App</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}