import React from 'react';
import DateTimeField from 'react-datetime';
import cx from 'classnames';
import moment from 'moment';
import Creatable from 'react-select/creatable';
import FileUpload from '../common/file_upload'

import {TextField} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';




function SelectInput(props) {

  const handleChange = (selectedOption) => {
    props.onChange(props.field,selectedOption ? selectedOption.label : null)
  }

  const filter = createFilterOptions();
  
  const {field, disabled, options, onChange,} = props;
  const className = field.id + '-select';

      return (
      
      
      <Autocomplete
      value={props.value}
      disabled={props.disabled}
      onBlurResetsInput={false}
      onCloseResetsInput={false}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          handleChange({
            label: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
         handleChange({
            label: newValue.inputValue,
          });
        } else {
          handleChange(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.label);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            label: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.label;
      }}
      renderOption={(props, option) => <li {...props}>{option.label}</li>}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label={field.displayName} />
      )}
    />
      );
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
    const {field,options,onChange,value,disabled} = this.props;
    
    const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
  			PaperProps: {
    		style: {
     		 maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      			width: 250,
    		},
  		},
	};
	
	var values= value.split(";");
    
    
  	return (
  	 
  	 <div>
        <InputLabel id="demo-multiple-checkbox-label">{field.displayName}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={values}
          disabled={disabled}
          onChange={this.handleChange}
          input={<OutlinedInput label={field.displayName} />}
          renderValue={(values) => values.join(', ')}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.label}>
              <Checkbox checked={value.indexOf(option.label) > -1} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
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
    
    var lDate =null;
  
    try {
      lDate = date.toLocaleDateString("en-US");
    }catch(exp ) {
    
    }
    return lDate;
  }
 
  render() {
  	return (
  	 <LocalizationProvider dateAdapter={AdapterDateFns}>
	  	<DesktopDatePicker
	          label={this.props.field.displayName}
	          inputFormat="MM/dd/yyyy"
	          outputFormat="MM/dd/yyyy"
	          value={this.dateOrNull(this.props.value)}
	          disabled={this.props.disabled}
	          onChange={this.handleChange}
	          renderInput={(params) => <TextField {...params} />}
	        />
     </LocalizationProvider>   
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
  	   <TextField
	          id={this.props.field.id}
	          disabled={this.props.disabled}
	          label={this.props.field.displayName}
	          disabled={this.props.disabled}
        	  onChange={this.handleChange}
              defaultValue={this.props.value}
              autoComplete="off"
	        />
   	);
  }
}


class PatientToggleInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }

  
  
  render() {
   const {field, disabled, options, onChange,} = this.props;
 
   const handleChange = (event: SelectChangeEvent) => {
   	  this.props.onChange(this.props.field,event.target.value ? event.target.value:'No')
    };
    
   	return (
  	   <div>	
  	   <FormControl sx={{ m: 1, minWidth: 80 }}>
  	   <InputLabel id="{field.id}" >{field.displayName}</InputLabel>
        <Select
          labelId="{field.id}"
          id="{field.id}"
          value={this.state.value}
          onChange={handleChange}
          label="{field.displayName}"
        >
          <MenuItem value={'Yes'}>Yes</MenuItem>
	      <MenuItem value={'No'}>No</MenuItem>
        </Select>
  	 	</FormControl> 
     </div>
    );
  }
}


class PatientTextAreaInput extends React.Component {

  constructor(props) {
    super(props);
  }

  
  render() {
  
    const handleChange = (evt) => {
      this.props.onChange(this.props.field,evt.target.value ? evt.target.value : null)
    }
    
  	return (
  	 <TextField
          label={this.props.field.displayName}
          onChange={handleChange}
          value={this.props.value}
          multiline
          minRows={2}
        />
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
    this.props.onChange(this.props.field,evt.target.value ? evt.target.value:'')
  }
  render() {
  	return (
  	   <TextField
	          id={this.props.field.id}
	          type="number"
	          disabled={this.props.disabled}
	          label={this.props.field.displayName}
	          disabled={this.props.disabled}
        	  onChange={this.handleChange}
              defaultValue={this.props.value}
              autoComplete="off"
	        />
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