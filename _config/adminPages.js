export default {
  translations: {
    permission: 'translation.translations.manage',
    activated: true,
    authenticated: true,
    path: '/translations/index',
    name: 'qtranslation.admin.translations',
    crud: import('@imagina/qtranslation/_crud/translations'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'translation.cms.sidebar.adminTranslations',
    icon: 'fa-light fa-language',
    subHeader: {
      refresh: true,
    }
  }
}
