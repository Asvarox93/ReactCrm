import React, { Component } from "react";
import { connect } from "react-redux";
class Crm_topbar extends Component {
  render() {
    return <div>Dzień dobry {this.props.nickname}</div>;
  }
}

const mapStateToProps = state => {
  return {
    role: state.auth.auth.role,
    email: state.auth.auth.email,
    nickname: state.auth.auth.nickname
  };
};

export default connect(mapStateToProps)(Crm_topbar);
