 const onInputChange = function(event) {
  let name = event.target.name;
  let val = event.target.value;
  this.setState({ [name]: val });
}

export default onInputChange;