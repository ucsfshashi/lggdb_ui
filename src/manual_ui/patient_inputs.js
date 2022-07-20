import React from 'react';
import Select from 'react-select';
import DateTimeField from 'react-datetime';
import cx from 'classnames';
import moment from 'moment';
import Creatable from 'react-select/creatable';
import FileUpload from '../common/file_upload'


class SelectInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.value,
    };
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.onChange(this.props.field,selectedOption ? selectedOption.value : null)
  }

   render() {
      const { selectedOption } = this.state;
      const value = selectedOption && selectedOption.value;

      const {field, disabled, options, onChange,} = this.props;
      const className = field.id + '-select';


      return (
    		  <div className="loglio-input-div" >	 
    	  <label className="loglio-input-label">
          <div className="label-text">{field.displayName}</div>
          <Creatable
            value={selectedOption}
            onChange={this.handleChange}
            disabled={disabled}
            onBlurResetsInput={false}
            onCloseResetsInput={false}
            options={options}/>
        </label>
          </div>
      );
    }
}

function optionsForMultiSelect(field) {
	  return field
	    .values
	    .map((fieldOption) => {
	      return {value: fieldOption.value, label: fieldOption.label};
	    });
}

function PatientSelectInputImaging({field, options, value, onChange, disabled}) {
  const className = field.id + '-select';
  return (
		  <div className="loglio-input-div" >	
		  <label className="loglio-input-label">
      <div className="label-text">{field.displayName}</div>
      <Select
        value={value}
        onChange={(field,selectedValue) => onChange(field,(selectedValue ? selectedValue.value : null))}
        onInputChange={onChange}
        onBlurResetsInput={false}
        onCloseResetsInput={false}
        disabled={disabled}
        options={options}/>
    </label>
     </div> 
  );
}

class PatientSelectInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.value,
    };
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.onChange(this.props.field,selectedOption ? selectedOption.value : null)
  }

   render() {
      const { selectedOption } = this.state;
      const value = selectedOption;

      const {field, disabled, options, onChange,} = this.props;
      const className = field.id + '-select';


      return (
    		  <div className="loglio-input-div" >	 
    	  <label className="loglio-input-label">
          <div className="label-text">{field.displayName}</div>
          <Select
          value={value}
          onChange={this.handleChange}
          onInputChange={onChange}
          onBlurResetsInput={false}
          onCloseResetsInput={false}
          disabled={disabled}
          options={options}/>
        </label>
          </div>
      );
    }
}

class PatientMultiSelectInput extends React.Component {

  constructor(props) {
    super(props);
  }

  handleChange = (evt) => {
    var changeValue = [];
    if(evt) {
	   evt.map(function(field,index){
		  changeValue[index]=field.value;
	   })		
	   this.props.onChange(this.props.field,changeValue);
   	}
  }
  
  render() {
    const {field,options,onChange,value} = this.props;
  	return (
  	<div className="loglio-input-div" >	
		  <label className="loglio-input-label">
	      <div className="label-text">{field.displayName}</div>
	      <Select
	        value={value}
	      	multi
	        removeSelected={true}
	        closeOnSelect={true}
		    isSearchable={true}
	        onChange={this.handleChange}
	        disabled={false}
	        onBlurResetsInput={false}
	        options={options}/>
	    </label>
	   </div>
  	);
  }
}


class PatientDateTimeInput extends React.Component {

  constructor(props) {
    super(props);
  }

  handleChange = (selectedDate) => {
    this.props.onChange(this.props.field,selectedDate ? this.formatDateForServer(selectedDate) : null)
  }
  
  dateOrNull= (dateString) => {
    return ((dateString instanceof moment) ? (dateString ? moment(dateString, 'MM/DD/YYYY') : null) : dateString);
  }

  formatDateForServer = (date) => {
    
    var lDate =date;
  
    try {
      lDate = date.format('MM/DD/YYYY');
    }catch(exp ) {
    
    }
    return lDate;
  }
 
  render() {
  	return (
  	
  	<div className="loglio-input-div" >	  
	<label className="loglio-input-label">
      <div className="label-text">{this.props.field.displayName}</div>
      <DateTimeField
        value={this.dateOrNull(this.props.value)}
        timeFormat={false}
        inputProps={{
          disabled:this.props.disabled
        }}
        onChange={this.handleChange}
      />
    </label>
    </div>  
  	);
  }
}

class PatientTextInput extends React.Component {

  constructor(props) {
    super(props);
  }

  handleChange = (evt) => {
    this.props.onChange(this.props.field,evt.target.value ? evt.target.value:'')
  }
  render() {
  	return (
  	 <div className="loglio-input-div" >	  
	  <label className="loglio-input-label">
      <div className="label-text">{this.props.field.displayName}</div>
      <input
        type="text"
        disabled={this.props.disabled}
        onChange={this.handleChange}
        value={this.props.value}
        autoComplete="off"
      />
    </label>
    </div>
  	);
  }
}


class PatientToggleInput extends React.Component {

 

  constructor(props) {
    super(props);
  }

  handleChange = (evt) => {
    this.props.onChange(this.props.field,evt.value ? evt.value:'false')
  }
  render() {
   const booleanOptions = [{value:'No',label:'No'},{value:'Yes',label:'Yes'} ];
  	return (
  	 <div className="loglio-input-div" >	  
	  <label className="loglio-input-label">
	      <div className="label-text">{this.props.field.displayName}</div>
	      <Select
		    value={this.props.value}
	        onChange={this.handleChange}
	        isClearable={false}
	        options={booleanOptions}/>
    </label>
    </div>
  	);
  }
}


class PatientTextAreaInput extends React.Component {

  constructor(props) {
    super(props);
  }

  handleChange = (evt) => {
    this.props.onChange(this.props.field,evt.target.value ? evt.target.value : null)
  }
  render() {
  	return (
  	 <div className="loglio-input-div" >	
   		<label className="loglio-input-label">
      	<div className="label-text">{this.props.field.displayName}</div>
      	<textarea
        type={"text"}
        disabled={this.props.disabled}
        onChange={this.handleChange}
        value={this.props.value}
        autoComplete={"off"}
       />
      </label>
      </div>  
  	);
  }
}


class PatientFileInput extends React.Component {

  constructor(props) {
    super(props);
  }

  handleChange = (val) => {
    this.props.onChange(this.props.field,val ? val : null)
  }
  render() {
  	return (
  	 <div className="loglio-input-div" >	
   		<label className="loglio-input-label">
      	<div className="label-text">{this.props.field.displayName}</div>
      		<FileUpload {...this.props} handleChange={this.handleChange}/>
        </label>
      </div>  
  	);
  }
}

class PatientLinkInput extends React.Component {

  constructor(props) {
    super(props);
  }

  handleChange = (evt) => {
    this.props.onChange(this.props.field,evt.target.value ? evt.target.value:'')
  }

  render() {
  	return (
  	 <div className="loglio-input-div" >	  
	  <label className="loglio-input-label">
      <div className="label-text">{this.props.field.displayName}</div>
      <input
        type="text"
        disabled={this.props.disabled}
        onChange={this.handleChange}
        value={this.props.value}
        autoComplete="off"
      />
    </label>
    </div>
  	);
  }
}

class PatientNumberInput extends React.Component {

  constructor(props) {
    super(props);
  }

  handleChange = (evt) => {
    this.props.onChange(this.props.field,evt.currentTarget.value ? evt.currentTarget.value:'')
  }
  render() {
  
	  let step = 'any';
	  if (this.props.field.type === 'integer') {
	    step = 1;
	  }
  
  	return (
  	 <div className="loglio-input-div" >	
   		<label className="loglio-input-label">
      	<div className="label-text">{this.props.field.displayName}</div>
      	<input
        type="number"
        disabled={this.props.disabled}
        onChange={this.handleChange}
        value={this.props.value}
        autoComplete="off"
       />
      </label>
      </div>  
  	);
  }
}


export default function(props) {
  let readonlyFields;

  const optionsForSelect = (field) => {
    return field
      .values
      .map((fieldOption) => {
        return {value: fieldOption, label: fieldOption};
      });
  }

  if (props.isNewPatient) {
    readonlyFields = new Set([]);
  } else if (props.successMessage) {
    readonlyFields = new Set(['mrn', 'gender', 'race', 'dateOfBirth', 'dateOfDeath', 'dateOfLastContact', 'survivalStatus','tags']);
  } else {
    readonlyFields = new Set(['mrn']);
  }

  const {field} = props;

  return (
    (field.type === 'enum' && field.id === 'referenceEventDate') ? <PatientSelectInputImaging {...props} disabled={readonlyFields.has(field.id)} options={optionsForSelect(field)} /> :
    field.type === 'singleSel' ? <PatientSelectInput {...props}  options={optionsForSelect(field)} /> :
    field.type === 'enum' ? <SelectInput {...props}  options={optionsForSelect(field)} /> :
    field.type === 'multiSel' ? <PatientMultiSelectInput {...props}  options={optionsForMultiSelect(field)} /> :
    (field.type === 'notes') ? <PatientTextAreaInput {...props} disabled={readonlyFields.has(field.id)} /> :
    (field.type === 'link') ? <PatientLinkInput {...props} disabled={readonlyFields.has(field.id)} /> :
    (field.type === 'file') ? <PatientFileInput {...props} disabled={readonlyFields.has(field.id)} /> :
    field.type === 'boolean' ? <PatientToggleInput {...props}  /> :
    field.type === 'string' ? <PatientTextInput {...props}  /> :
    (field.type === 'decimal' || field.type === 'integer') ? <PatientNumberInput {...props} disabled={readonlyFields.has(field.id)} /> :
    field.type === 'date' ? <PatientDateTimeInput {...props} /> :
    null
  );
};