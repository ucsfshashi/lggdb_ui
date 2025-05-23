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
  ,
  {
    title: 'Synonym Repository',
    path: '/admin/synonym',
    icon: getIcon('eva:share-outline')
  }	,
  {
    title: 'Study Overlap',
    path: '/admin/cleansing',
    icon: getIcon('openmoji:overlapping-white-and-black-squares')
}
];

export default sidebarConfig;
