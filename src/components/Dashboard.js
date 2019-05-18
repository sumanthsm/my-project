import React from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import chunk from 'lodash/chunk';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            appData: [],
            shortcutsData: [],
            isToggleOpen: false,
            containerMargin: '64px',
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
        if(this.state.typingTimeout){
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
        console.log(searchTerm, "searchterm");

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

    handleToggle = (e) => {
        console.log(e, "handleToggle");
        if (!this.state.isToggleOpen) {
            this.setState({ containerMargin: '240px', isToggleOpen: true });
        } else {
            this.setState({ containerMargin: '64px', isToggleOpen: false });
        }

    }

    render() {
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 1
        };

        const { appData } = this.state;
        const chunkedAppData = chunk(appData, 4);

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
                                        <NavItem>

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
                                                <div className="col-3" key={j}>

                                                    <div className="card mx-3 my-3" style={{ height: "250px", borderRadius: '30px', position: 'relative' }} key={i}>
                                                        <span
                                                            className="fa fa-plus-circle"
                                                            style={{
                                                                fontSize: '30px',
                                                                position: "absolute",
                                                                bottom: '20px',
                                                                right: '20px',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => this.handleShortcut(app.appName)}>
                                                        </span>
                                                        <a href={app.appUrl} style={{ textDecoration: 'none' }}>
                                                            <div className="card-body" style={{ paddingTop: '50px' }}>
                                                                <div className="icon" style={{ fontSize: '30px' }}>
                                                                    <i className="fa fa-globe"></i>
                                                                </div>
                                                                <p className="text text-center pt-3" >{app.appName}</p>
                                                            </div>
                                                        </a>
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