export default ({ app, store }, inject) => {
    inject('isAdmin', () => {
        if (!store.getters['auth/user']) return false;
        return store.getters['auth/user'].role === 'admin';
    });
    inject('isUser', () => {
        if (!store.getters['auth/user']) return false;
        return store.getters['auth/user'].role === 'user';
    });
    inject('isSecretary', () => {
        if (!store.getters['auth/user']) return false;
        return store.getters['auth/user'].role === 'secretary';
    });
    inject('hasEditPermission', (company_id) => {
        const auth_user = store.getters['auth/user']
        if (!auth_user) return false;
        return auth_user.role === 'admin' || (auth_user.role === 'user' && auth_user.company_id === company_id);
    });
    inject('hasReceivePermission', (company_id) => {
        const auth_user = store.getters['auth/user']
        if (!auth_user) return false;
        return auth_user.role === 'admin' || auth_user.company_id === company_id;
    });
    inject('hasDeletePermission', (company_id) => {
        const auth_user = store.getters['auth/user']
        if (!auth_user) return false;
        return auth_user.role === 'admin' || (auth_user.role === 'user' && auth_user.company_id === company_id);
    });
}