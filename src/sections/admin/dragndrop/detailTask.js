import React, { Component } from 'react';
import {dataTypes,overWriteOptions } from './constants';



export default class DetailTask extends Component<Props> {
	
	constructor(props) {
	    super(props);
	}
	render() {
		return (
				<div>
			      CSVLabel : {this.props.task.csvLabel} <br/>
			      DataType : {dataTypes[this.props.task.type]}<br/>
			      Editable :  {this.props.task.editable==true?"Yes":"No"} <br/>
			      OverWriteOption : {overWriteOptions[this.props.task.overWriteOption]} <br/>
			    </div>  
		);
	}
}