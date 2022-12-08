import React from 'react';
import MUIDataTable from "mui-datatables";



export default class UploadView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	render() {  
		const {title,options,data,columns } = this.props;
		
		return (
		<MUIDataTable
        title={title}
        options={options}
        data={data}
        columns={columns} />  );
	}

}
	