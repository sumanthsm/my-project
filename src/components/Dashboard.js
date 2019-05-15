import React from 'react';
import Slider from 'react-slick';
import AppData from '../../data/appData.json';
import ShortcutsData from '../../data/shortcutsData.json';

export default class Dashboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchTerm : '',
            AppData: [],
            ShortcutsData: []
        }
    }

    componentWillMount(){
        this.setState({AppData: AppData, ShortcutsData: ShortcutsData});
    }

    onChange = (e) => {
        this.setState({searchTerm: e.target.value});
        this.onDataChange();
    }

    onDataChange = () => {
        let searchTerm = this.state.searchTerm;
        let AppData = this.state.AppData;
        const filteredAppData = [];
        console.log(this.state.searchTerm, "");
        
        for(let i=0;i<AppData.length;i++){
            if(searchTerm == AppData[i].name){
                filteredAppData.push(AppData[i]);
            }
        }
        console.log(filteredAppData);
        
        if(filteredAppData.length > 0){
            this.setState({AppData: filteredAppData});
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

        return (
            <div style={{ backgroundColor: '#eff0f2' }}>
                <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
                    <span style={{color: 'white'}}>EIS App Store</span>
                </nav>
                <div className="row">
                    <div className="col-6" style={{ margin: '20px auto' }}>
                        <div className="input-group">
                            <input 
                            className="form-control py-2" 
                            type="search" 
                            value={this.state.searchTerm}
                            placeholder="Search for App"
                            id="example-search-input"
                            onChange={this.onChange}>
                            </input>
                            <span className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button">
                                    <i className="fa fa-search"></i>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6" style={{ margin: '10px auto' }}>
                        <Slider {...settings}>
                        {
                            this.state.ShortcutsData.shortcuts.map((shortcut, i) => {
                                return (
                                    <div>
                                        <div className="card ml-2 mr-2" style={{height: '80px', borderRadius: '25px', fontSize: '10px', position: 'relative'}}>
                                        <span className="fa fa-trash" style={{position: "absolute", top: '10px', right: '10px'}}></span>
                                        <div className="card-body" style={{paddingTop: '30px'}}>{shortcut.name}</div>
                                    </div>
                            </div>
                                )
                            })
                        }
                        </Slider>
                        {/* <div style={{position: 'relative'}}>
                            <span className="fa fa-plus-circle" style={{ fontSize: '30px', position: "absolute", bottom: '20px', right: '20px'}}></span>
                        </div> */}
                        
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div style={{ marginLeft: "25px", }}>
                        <div style={{height: '400px', overflowY: 'auto'}}>
                        {
                            this.state.AppData.apps.map((app, i) => {
                                return (
                                    <div className="card m-2 pull-left" style={{ width: "250px", height: "250px", borderRadius: '30px', position: 'relative' }} key={i}>
                                        <span className="fa fa-plus-circle" style={{ fontSize: '30px', position: "absolute", bottom: '20px', right: '20px'}}></span>
                                        <div className="card-body" style={{paddingTop: '50px'}}>
                                        <div className="icon" style={{fontSize: '30px'}}>
                                        <i className="fa fa-globe"></i>
                                        </div>
                                        <p className="text text-center pt-3" >{app.name}</p>
                                        
                                        </div>
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