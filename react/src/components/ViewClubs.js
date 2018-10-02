import React, { Component } from "react";
import { connect } from "react-redux";
//import GetUserLocation from "../services/googleGeolocate.service";
import FindNearbyClubs from "../services/clubGeoSearch.service";
import {
  GetClubMetrics,
  GetClubMembership
} from "../services/clubMetrics.service";
import GoogleMapReact from "google-map-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { Input, InputGroup, InputGroupAddon, Button } from "reactstrap";
import MapMarkers from "./MapMarkers";
import moment from "moment";
import ResultRow from "./ResultRow";
import "../css/custom.css";

class ViewClubs extends Component {
  state = {
    clubs: [],
    latitude: null,
    longitude: null,
    isGeocoding: false,
    location: "",
    clubMetrics: []
  };

  searchClubs = (q, radius, lat, lng) => {
    FindNearbyClubs(q, radius, lat, lng).then(resp => {
      let rawList = resp.data.items.Clubs;
      let clubs = this.assignClubIds(rawList);
      this.setState({ clubs });
    });
  };

  getClubMetricsById = id => {
    GetClubMetrics(id).then(resp => {
      let metrics = resp.data.items;
      metrics.forEach(metric => {
        let date = moment(metric.monthEnd, "MMM YY")
          .add(1, "month")
          .format("MM/YY");
        console.log(date);
      });
    });
    GetClubMembership(id).then(resp => console.log(resp));
  };

  componentDidMount() {
    //
    if (this.props.userLongitude && this.props.userLatitude) {
      this.setState({
        latitude: this.props.userLatitude,
        longitude: this.props.userLongitude
      });
      // FindNearbyClubs(
      //   "",
      //   this.props.userLatitude,
      //   this.props.userLongitude,
      //   10
      // ).then(resp => console.log(resp));
    }
    if (!this.props.userLongitude && !this.props.userLatitude) {
      //this.props.hiclub.push("/");
      // GetUserLocation().then(resp => {
      //   let { lat, lng } = resp.data.location;
      //   this.props.sendLatitude(lat);
      //   this.props.sendLongitude(lng);
      // });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.userLatitude !== prevProps.userLatitude) {
      // catch Location Change => re-render map & maybe get new data from server
      console.log(this.props.userLatitude + ", " + this.props.userLongitude);
    }
  }

  handleMapsAutocomplete = location => {
    //let nameOnly = location.substr(0, location.indexOf(","));
    this.setState({ location });
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({
          latitude: latLng.lat,
          longitude: latLng.lng,
          zoomLevel: 12
        });
        this.searchClubs(location, 7, latLng.lat, latLng.lng);
      })
      .catch(error => console.error("Error", error));
  };

  assignClubIds = clubs => {
    let assignedIds = clubs.map(club => {
      let assigned = { ...club };
      assigned.id = club.Identification.Id.Value;
      //assigned.fullId = club.Identification.Id.Value;
      return assigned;
    });
    return assignedIds;
  };

  reformatClubs = clubs => {
    let reformatted = clubs.map(club => {
      let dayOfclub = moment(club.clubDate, "YYYY-MM-DD").format(
        "dddd, MMM D, YYYY"
      );
      return {
        ...club,
        dayOfclub
      };
    });
    return reformatted;
  };

  resetLocation = () => this.setState({ location: "" });

  autoCompleteChange = location => {
    this.setState({ location });
  };

  handleMapChanges = info => {
    let zoom = info.zoom;
    let mapLatitude = info.center.lat;
    let mapLongitude = info.center.lng;
    let ne = info.bounds.ne;
    let nw = info.bounds.nw;
    let se = info.bounds.se;
    let sw = info.bounds.sw;
    console.log(`${ne.lng} ${ne.lat}`);
    console.log(`${nw.lng} ${nw.lat}`);
    console.log(`${sw.lng} ${sw.lat}`);
    console.log(`${se.lng} ${se.lat}`);
    // this.props.sendMapZoom(zoom);
    // this.props.sendMapLatitude(mapLatitude);
    // this.props.sendMapLongitude(mapLongitude);
  };

  render() {
    const mapOptions = {
      scrollwheel: true,
      minZoom: 11
      // hide: [
      //   {
      //     featureType: "all",
      //     elementType: "labels",
      //     stylers: [{ visibility: "off" }]
      //   }
      // ]
    };
    return (
      <div className="container-fluid view-spacer">
        <div className="float-left col-xl-5 col-lg-5 col-md-12 col-xs-12">
          <div className="form-group">
            <PlacesAutocomplete
              value={this.state.location}
              onChange={this.autoCompleteChange}
              onSelect={this.handleMapsAutocomplete}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading
              }) => (
                <div className="form-group">
                  <InputGroup>
                    {" "}
                    <Input
                      maxLength={100}
                      {...getInputProps({
                        placeholder: "Search By Location"
                      })}
                    />
                    <InputGroupAddon addonType="append">
                      <Button color="danger" onClick={this.resetLocation}>
                        x
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {suggestions.length > 0 && (
                    <div className="autocomplete-dropdown-container">
                      {loading && <div>Loading...</div>}
                      {suggestions.map(suggestion => {
                        const className = suggestion.active
                          ? "suggestion-item--active"
                          : "suggestion-item";
                        const style = suggestion.active
                          ? {
                              backgroundColor: "#e8e8e8",
                              cursor: "pointer",
                              margin: "0.3em"
                            }
                          : {
                              backgroundColor: "#ffffff",
                              cursor: "pointer",
                              margin: "0.3em"
                            };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </PlacesAutocomplete>
          </div>
          <div className="results-container">
            <table className="table table-light table-bordered table-striped">
              <tbody>
                <tr>
                  <td className="pointer">
                    <div className="font-weight-bold">
                      <button
                        onClick={() => this.getClubMetricsById("00001032")}
                      >
                        Test Click
                      </button>
                    </div>
                  </td>
                </tr>
                {this.state.clubs.length > 0 &&
                  this.state.clubs.map((club, index) => (
                    <ResultRow
                      key={club.id}
                      idx={index}
                      club={club}
                      sendClubRequest={this.getClubMetricsById}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="float-right col-xl-7 col-lg-7 col-md-12 col-xs-12"
          style={{ height: "80vh" }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyBcBHH4tjzT73Zms3uDoCun9GaNy-Ue5QQ"
            }}
            defaultCenter={{
              lat: this.props.userLatitude || 33.9860021,
              lng: this.props.userLongitude || -118.3966412
            }}
            center={{
              lat: this.state.latitude || 33.9860021,
              lng: this.state.longitude || -118.3966412
            }}
            defaultZoom={12}
            zoom={this.state.zoomLevel || 12}
            options={mapOptions}
            //onChange={this.handleMapChanges} // callback with all kinds of useful information
          >
            {this.state.clubs.map(club => {
              return (
                <MapMarkers
                  key={club.id}
                  id={club.id}
                  lat={club.Address.Coordinates.Latitude}
                  lng={club.Address.Coordinates.Longitude}
                  club={club}
                />
              );
            })}
          </GoogleMapReact>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendMapLatitude: setLatitude =>
      dispatch({ type: "SET_MAP_LATITUDE", setLatitude }),
    sendMapLongitude: setLongitude =>
      dispatch({ type: "SET_MAP_LONGITUDE", setLongitude }),
    sendMapZoom: setZoom => dispatch({ type: "SET_MAP_ZOOM", setZoom }),
    sendLatitude: setLatitude =>
      dispatch({ type: "SET_USER_LATITUDE", setLatitude }),
    sendLongitude: setLongitude =>
      dispatch({ type: "SET_USER_LONGITUDE", setLongitude })
  };
};

const mapStateToProps = state => {
  return {
    userLongitude: state.userLongitude,
    userLatitude: state.userLatitude,
    mapLatitude: state.mapLatitude,
    mapLongitude: state.mapLongitude,
    mapZoom: state.mapZoom
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewClubs);
