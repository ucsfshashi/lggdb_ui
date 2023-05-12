// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Studies',
    path: '/admin/app',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'Users',
    path: '/admin/users',
    icon: getIcon('eva:people-fill')
  }
];

export default sidebarConfig;
