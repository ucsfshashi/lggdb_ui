const roles = {
  names :[
       {'PHI_ACCESS':'PHI access user'},
       {'NON_PHI':'Non-PHI access user'},
       {'ADMIN':'Administrator'},
       {'STUDY_ADMIN':'Study coordinator'} ],
  descriptions :[
       {'PHI_ACCESS':'PHI access user can query, download, upload, and manually enter data.'},
       {'NON_PHI':'Non-PHI access user can only do query and download.'},
       {'ADMIN':'Administrator can define study tag, assign users to study, and create study templates.'},
       {'STUDY_ADMIN':'Study coordinator can change study tag Information, assign users to study, and create study templates.'} ]    
};

export default roles;
