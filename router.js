import Vue from 'vue'
import Router from 'vue-router'
import { scrollBehavior } from '~/utils'

Vue.use(Router)

const page = path => () => import(`~/pages/${path}`).then(m => m.default || m)

const routes = [
  { path: '/', redirect: { name: 'login' } },
  { path: '/google_authenticate', name: '2fa', component: page('auth/GoogleAuthenticate.vue') },

  { path: '/login', name: 'login', component: page('auth/Login.vue') },

  { path: '/dashboard', name: 'dashboard', component: page('Dashboard.vue') },
  {
    path: '/account',
    component: page('account/Index.vue'),
    children: [
      { path: '', redirect: { name: 'account.profile' } },
      { path: 'profile', name: 'account.profile', component: page('account/Profile.vue') },
      { path: 'password', name: 'account.password', component: page('account/Password.vue') },
      { path: 'google_2fa', name: 'account.google_2fa', component: page('account/Google2FA.vue') }
    ]
  },


  { path: '/purchase_order', name: 'purchase_order.index', component: page('purchase_order/PurchaseOrderList.vue') },
  { path: '/purchase_order/add', name: 'purchase_order.add', component: page('purchase_order/AddPurchaseOrder.vue') },
  { path: '/purchase_order/edit/:id', name: 'purchase_order.edit', component: page('purchase_order/EditPurchaseOrder.vue') },
  { path: '/purchase_order/detail/:id', name: 'purchase_order.detail', component: page('purchase_order/PurchaseOrderDetail.vue') },
  { path: '/purchase_order/receive/:id', name: 'purchase_order.receive', component: page('purchase_order/ReceivePurchaseOrder.vue') },


  { path: '/purchase', name: 'purchase.index', component: page('purchase/PurchaseList.vue') },
  // { path: '/purchase/add', name: 'purchase.add', component: page('purchase/AddPurchase.vue') },
  { path: '/purchase/edit/:id', name: 'purchase.edit', component: page('purchase/EditPurchase.vue') },
  { path: '/purchase/detail/:id', name: 'purchase.detail', component: page('purchase/PurchaseDetail.vue') },


  { path: '/report/purchases_report', name: 'purchases_report', component: page('report/PurchasesReport.vue') },
  { path: '/report/suppliers_report', name: 'suppliers_report', component: page('report/SuppliersReport.vue') },
  { path: '/report/suppliers_report/view/:supplier_id', name: 'suppliers_report.view', component: page('report/SuppliersReportView.vue') },
  { path: '/report/income_report', name: 'income_report', component: page('report/IncomeReport.vue') },

  { path: '/supplier', name: 'supplier.index', component: page('people/Suppliers.vue') },,
  { path: '/user', name: 'user.index', component: page('people/Users.vue') },
  { path: '/company', name: 'company.index', component: page('Companies.vue') },
  { path: '/category', name: 'category.index', component: page('Categories.vue') },
  { path: '/store', name: 'store.index', component: page('Stores.vue') },
  { path: '/notifications', name: 'notifications', component: page('Notifications.vue') },
  { path: '/spy', name: 'spy', component: page('purchase_order/SpyPurchaseOrders.vue') },
]

export function createRouter () {
  return new Router({
    routes,
    scrollBehavior,
    mode: 'history'
  })
}
