export const Paths = {
    Auth: {
        Base: '/auth',
        Register: '/register',
        Login: '/login',
        Refresh: '/refresh',
        Verify: '/verify-email',
    },
    Articles: {
        Base: '/articles',
        Get: '/',
        GetById: '/:id',
        Create: '/',
        Update: '/:id',
        Delete: '/:id',
    },
} as const;