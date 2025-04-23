// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'Patient',
    path: '/dashboard/patients',
    icon: getIcon('eva:people-fill')
  },
  {
    title: 'Query',
    path: '/dashboard/query',
    icon: getIcon('eva:cloud-download-fill')
  },
  {
    title: 'Upload',
    path: '/dashboard/upload',
    icon: getIcon('eva:cloud-upload-fill')
  }	,
  {
    title: 'Search',
    path: '/dashboard/search',
    icon: getIcon('eva:search-outline')
  }
];

export default sidebarConfig;
