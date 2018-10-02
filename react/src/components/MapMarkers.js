import React, { Component } from "react";
import { withRouter } from "react-router";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import "../css/custom.css";

class MapMarkers extends Component {
  state = {
    popoverOpen: false
  };

  toggle = () =>
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });

  toggle = this.toggle.bind(this);

  render() {
    const { club } = this.props;
    return (
      <span>
        <button
          className="btn btn-sm btn-danger marker-btn-circle"
          color="success"
          id={"Popover-" + club.id}
          onClick={this.toggle}
        />
        <Popover
          placement={"auto"}
          isOpen={this.state.popoverOpen}
          target={"Popover-" + club.id}
          toggle={this.toggle}
          style={{ width: "17em" }}
        >
          <PopoverHeader>
            <span
              className="float-right popover-close-btn"
              onClick={this.toggle}
            >
              X
            </span>
            {club.Identification.Name}
          </PopoverHeader>
          <PopoverBody>
            {/* <div className="font-weight-bold">{club.thankeeName},</div>
            <div
              className="marker-desc"
              style={{
                whiteSpace: "pre-wrap",
                width: "100%"
              }}
            >
              {club.description}
            </div>
            <div className="font-weight-bold">- {club.posterName}</div>
            <div className="text-center marker-spacer">
              <button
                className="btn btn-sm btn-block btn-success"
                onClick={() => this.props.hiclub.push("/edit/" + club.id)}
              >
                See More Details
              </button>
            </div> */}
          </PopoverBody>
        </Popover>
      </span>
    );
  }
}

export default withRouter(MapMarkers);
