import React from 'react';
import axios from 'axios';
import chunk from 'lodash/chunk';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";

export default class AppList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            appData: [],
            shortcutsData: [],
            containerMargin: '80px',
            navWidth: '80px',
            navMarginLeft: '0px',
            isMenuExpanded: false,
            typingTimeout: 0
        }
    }

    componentDidMount() {
        this.getAppData();
        this.getShortcutsData();
    }

    getAppData = () => {
        axios.get('http://localhost:5000/api/appdata')
            .then((response) => {
                let data = response.data;
                this.setState({ appData: data });
            })
            .catch(function (error) {
                console.log(error);
            });
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

    onChange = (e) => {
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
        }

        this.setState({
            searchTerm: e.target.value,
            typingTimeout: setTimeout(() => {
                this.onDataChange();
            }, 1000)
        });
    }

    onDataChange = () => {
        const { searchTerm } = this.state;
        if (searchTerm === '') {
            this.getAppData();
        } else {
            axios.get('http://localhost:5000/api/appdata' + searchTerm)
                .then((response) => {
                    let data = response.data;
                    console.log(data);
                    this.setState({ appData: data });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    handleShortcut = (appName) => {
        console.log(appName, "appname");
        axios.post('http://localhost:5000/api/shortcutsdata', { appName: appName })
            .then((response) => {
                if (response.data.status === 'success') {
                    this.getShortcutsData();
                    Swal.fire({
                        type: 'success',
                        title: 'Shortcut added Successfully.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Shortcut already exists.',
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleDelete = (appId) => {
        axios.post('http://localhost:5000/api/deleteshortcut', { appId: appId })
            .then((response) => {
                if (response.data.status === 'success') {
                    this.getShortcutsData();
                    Swal.fire({
                        type: 'success',
                        title: 'Shortcut added Successfully.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Shortcut already exists.',
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleDeleteApp = (appId) => {
        axios.post('http://localhost:5000/api/deleteapp', { appId: appId })
            .then((response) => {
                if (response.data.status === 'success') {
                    this.getAppData();
                    Swal.fire({
                        type: 'success',
                        title: 'App added Successfully.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'App not deleted',
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
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
        const { appData } = this.state;
        const chunkedAppData = chunk(appData, 2);

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
                                    <div className="row" style={{ marginLeft: '25px', paddingTop: '15px', color: 'white', position: 'relative' }} key={i}>
                                        <i className="fa fa-fw fa-circle-thin" style={{ fontSize: '1.75em' }} />
                                        {
                                            this.state.isMenuExpanded ? <i 
                                            className="fa fa-trash" 
                                            aria-hidden="true"
                                            style={{
                                                fontSize: '15px',
                                                color: 'red',
                                                position: "absolute",
                                                bottom: '10px',
                                                right: '30px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => this.handleDelete(shortcut.appId)}
                                            ></i> : null
                                        }
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
                        <div className="row">
                            <div className="col-6" style={{ margin: '20px auto' }}>
                                <div style={{ position: "relative" }}>
                                    <i className="fa fa-search" style={{ position: 'absolute', padding: '10px', right: '10px' }}></i>
                                    <input
                                        className="form-control py-2"
                                        style={{ borderRadius: '30px' }}
                                        type="text"
                                        value={this.state.searchTerm}
                                        placeholder="Search for App"
                                        id="example-search-input"
                                        onChange={this.onChange}>
                                    </input>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {chunkedAppData.map((chunk, i) => {
                                return (
                                    <div className="row col-12 " style={{ marginLeft: '8px' }} key={i}>
                                        {chunk.map((app, j) => {
                                            return (
                                                <div className="col-6" key={j}>
                                                    <div className="card mx-3 my-3" style={{ position: 'relative' }} key={i}>
                                                        
                                                            <div className="card-body">
                                                                <a href={app.appUrl} style={{ textDecoration: 'none' }}>
                                                                    <div className="pull-left">
                                                                        <p className="text text-center pt-2" >{app.appName}</p>
                                                                    </div>
                                                                </a>
                                                                <div className="pull-right">
                                                                    <a className="btn btn-primary " href={"/editapp"+app.appId} style={{marginRight: '10px'}}>Edit</a>
                                                                    <button className="btn btn-danger" onClick={()=> this.handleDeleteApp(app.appId)} >Delete</button>
                                                                </div>
                                                            </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        }
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}