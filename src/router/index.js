import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore';
const LoginView = () => import('@/views/auth/LoginView.vue');
const ResetPassword = () => import('@/views/auth/ResetPasswordView.vue');
const TwoFAView = () => import('@/views/auth/TwoFAView.vue');
const VerifyCodeView = () => import('@/views/auth/VerifyCodeView.vue');
// Dashboard
const DefaultLayout = () => import('@/layouts/DefaultLayout.vue');
const DashboardView = () => import('@/views/pages/dashboard/DashboardView.vue');
const UserView = () => import('@/views/pages/super-admin/users/UserView.vue');
const ActivityLogView = () => import('@/views/pages/super-admin/activity-logs/ActivityLogView.vue');

const AllApplicationView = () => import('@/views/pages/admin/application-review/AllApplicationView.vue');
const PassedApplicationView = () => import('@/views/pages/admin/application-review/PassedApplicationView.vue');
const FailedApplicationView = () => import('@/views/pages/admin/application-review/FailedApplicationView.vue');
const ContactedApplicationView = () => import('@/views/pages/admin/application-review/ContactedApplicationView.vue');
const ApplicationReview = () => import('@/views/pages/admin/application-review/ApplicationReview.vue');
const ShortlistView = () => import('@/views/pages/admin/shortlisted/shortlistView.vue');
const PassedShortlistView = () => import('@/views/pages/admin/shortlisted/PassedShortlistView.vue');
const FailedShortlistView = () => import('@/views/pages/admin/shortlisted/FailedShortlistView.vue');
const ShortlistDetail = () => import('@/views/pages/admin/shortlisted/shortlistDetail.vue');
const Blacklist = () => import('@/views/pages/admin/blacklisted/Blacklist.vue');
const FinalResultView = () => import('@/views/pages/admin/final-results/FinalResultView.vue');
const FinalResultDetail = () => import('@/views/pages/admin/final-results/finalResultDetail.vue');
const BlacklistDetail = () => import('@/views/pages/admin/blacklisted/blacklistDetail.vue');
const Dropout = () => import('@/views/pages/admin/drop-out/Dropout.vue');
const DropoutDetail = () => import('@/views/pages/admin/drop-out/dropoutDetail.vue');

const StudentView = () => import('@/views/pages/Teacher/studentList/StudentView.vue');
const ProfileView = () => import('@/views/pages/profile/ProfileView.vue');
const ForbiddenView = () => import('@/views/pages/error/ForbiddenView.vue');
const NotFoundView = () => import('@/views/pages/error/NotFoundView.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: "/auth/login",
      name: "login",
      component: LoginView,
      meta: {
        title: "ចូលគណនី",
        requiresGuest: true,
      },
    },

    {
      path: "/auth/2fa",
      name: "two-factor",
      component: TwoFAView,
      meta: {
        title: "ការផ្ទៀងផ្ទាត់ពីរដំណាក់កាល",
        requiresGuest: true,
        requiresInterimToken: true,
      },
    },

    {
      path: "/auth/verify-code",
      name: "verify-code",
      component: VerifyCodeView,
      meta: {
        title: "ផ្ទៀងផ្ទាត់កូដ",
        requiresGuest: true,
        requiresInterimToken: true,
      },
    },

    {
      path: "/auth/reset-password",
      name: "reset-password",
      component: ResetPassword,
      meta: {
        title: "កំណត់ពាក្យសម្ងាត់ឡើងវិញ",
        requiresGuest: true,
        requiresInterimToken: true,
      },
    },

    {
      path: "/",
      component: DefaultLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          name: "dashboard",
          component: DashboardView,
          meta: {
            title: "ផ្ទាំងគ្រប់គ្រង",
            requiresAuth: true,
            roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
          },
        },

        {
          path: "users",
          name: "users",
          component: UserView,
          meta: {
            title: "អ្នកប្រើប្រាស់",
            requiresAuth: true,
            roles: ["SUPER_ADMIN"],
          },
        },

        {
          path: "activity-logs",
          name: "activity-logs",
          component: ActivityLogView,
          meta: {
            title: "កំណត់ហេតុសកម្មភាព",
            requiresAuth: true,
            roles: ["SUPER_ADMIN"],
          },
        },
        {
          path: "/all-application",
          meta: {
            requiresAuth: true,
            roles: ["ADMIN"],
          },
          children: [
            {
              path: "",
              name: "all-application",
              component: AllApplicationView,
              meta: {
                title: "បញ្ជីអ្នកដាក់ពាក្យទាំងអស់",
                requiresAuth: true,
                roles: ["ADMIN"],
              },
            },
            {
              path: "passed",
              name: "passed-application",
              component: PassedApplicationView,
              meta: {
                title: "បញ្ជីអ្នកដាក់ពាក្យជាប់",
                requiresAuth: true,
                roles: ["ADMIN"],
              },
            },
            {
              path: "failed",
              name: "failed-application",
              component: FailedApplicationView,
              meta: {
                title: "បញ្ជីអ្នកដាក់ពាក្យធ្លាក់",
                requiresAuth: true,
                roles: ["ADMIN"],
              },
            },
            {
              path: "contacted",
              name: "contacted-application",
              component: ContactedApplicationView,
              meta: {
                title: "បញ្ជីអ្នកដាក់ពាក្យទំនាក់ទំនង",
                requiresAuth: true,
                roles: ["ADMIN"],
              },
            },
          ],
        },
        {
          path: "application-review/:id",
          name: "application-review",
          component: ApplicationReview,
          meta: {
            title: "ពិនិត្យបញ្ជីអ្នកដាក់ពាក្យ",
            requiresAuth: true,
            roles: ["ADMIN"],
          },
        },
        {
          path: "shortlist-detail/:id",
          name: "shortlist-detail",
          component: ShortlistDetail,
          meta: {
            title: "ព័ត៌មានលម្អិតបញ្ជីសម្រាំង",
            requiresAuth: true,
            roles: ["ADMIN"],
          },
        },
        {
          path: "/all-shortlist",
          meta: {
            requiresAuth: true,
            roles: ["ADMIN"],
          },
          children: [
            {
              path: "",
              name: "all-shortlist",
              component: ShortlistView,
              meta: {
                title: "បញ្ជីសម្រាំងទាំងអស់",
                requiresAuth: true,
                roles: ["ADMIN"],
              },
            },
            {
              path: "passed",
              name: "passed-shortlist",
              component: PassedShortlistView,
              meta: {
                title: "បញ្ជីសម្រាំងជាប់",
                requiresAuth: true,
                roles: ["ADMIN"],
              },
            },
            {
              path: "failed",
              name: "failed-shortlist",
              component: FailedShortlistView,
              meta: {
                title: "បញ្ជីសម្រាំងធ្លាក់",
                requiresAuth: true,
                roles: ["ADMIN"],
              },
            },
          ],
        },
        {
          path: "/final-result-detail/:id",
          name: "final-result-detail",
          component: FinalResultDetail,
          meta: {
            title: "ព័ត៌មានលម្អិតលទ្ធផលចុងក្រោយ",
            requiresAuth: true,
            roles: ["ADMIN"],
          },
        },
        {
          path: "blacklisted",
          name: "blacklisted",
          component: Blacklist,
          meta: {
            title: "បញ្ជីខ្មៅ",
            requiresAuth: true,
            roles: ["ADMIN"],
          },
        },
        {
          path: "/blacklist-detail/:id",
          name: "blacklist-detail",
          component: BlacklistDetail,
          meta: {
            title: "ព័ត៌មានលម្អិតបញ្ជីខ្មៅ",
            requiresAuth: true,
            roles: ["ADMIN"],
          },
        },
        {
          path: "/drop-out",
          name: "drop-out",
          component: Dropout,
          meta: {
            title: "សិស្សដែលបោះបង់",
            requiresAuth: true,
            roles: ["ADMIN"],
          },
        },
        {
          path: "/dropout-detail/:id",
          name: "dropout-detail",
          component: DropoutDetail,
          meta: {
            title: "ព័ត៌មានលម្អិតសិស្សដែលបោះបង់",
            requiresAuth: true,
            roles: ["ADMIN"],
          },
        },
        {
          path: "/final-results",
          meta: {
            requiresAuth: true,
            roles: ["ADMIN"],
          },
          children: [
            {
              path: "",
              name: "all-final-results",
              component: FinalResultView,
              meta: {
                title: "លទ្ធផលចុងក្រោយទាំងអស់",
                requiresAuth: true,
                roles: ["ADMIN"],
              },
            },
            {
              path: "passed",
              name: "passed-final-result",
              component: () => import('@/views/pages/admin/final-results/PassedFinalResultView.vue'),
              meta: {
                title: "លទ្ធផលចុងក្រោយជាប់",
                requiresAuth: true,
                roles: ["ADMIN"],
              },
            },
            {
              path: "reserve",
              name: "reserved-final-result",
              component: () => import('@/views/pages/admin/final-results/ReservedFinalResultView.vue'),
              meta: {
                title: "លទ្ធផលចុងក្រោយបម្រុង",
                requiresAuth: true,
                roles: ["ADMIN"],
              },
            },
          ]
        },
        {
          path: "/define-group",
          name: "define-group",
          component: () => import("@/views/pages/admin/group/DefineGroupView.vue"),
          meta: {
            title: "កំណត់ក្រុម",
            requiresAuth: true,
            roles: ["ADMIN"],
          },
        },
        {
          path: "student-lists",
          name: "student-lists",
          component: StudentView,
          meta: {
            title: "បញ្ជីសិស្ស",
            requiresAuth: true,
            roles: ["TEACHER"],
          },
        },
        {
          path: "student-lists/evaluation/:submissionId",
          name: "student-evaluation",
          component: () => import("@/views/pages/Teacher/evaluation/EvaluationView.vue"),
          meta: {
            title: "ការវាយតម្លៃ",
            requiresAuth: true,
            roles: ["TEACHER"],
          },
        },
        {
          path: "student-lists/detail/:submissionId",
          name: "student-detail",
          component: () => import("@/views/pages/Teacher/studentDetail/StudentDetailView.vue"),
          meta: {
            title: "ព័ត៌មានលម្អិត",
            requiresAuth: true,
            roles: ["TEACHER"],
          },
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: {
            title: "ប្រវត្តិរូប",
            requiresAuth: true,
            roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
          },
        },
      ],
    },
    {
      path: "/404",
      name: "forbidden",
      component: ForbiddenView,
      meta: {
        title: "មិនស្គាល់ទំព័រ",
        requiresAuth: true,
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
      meta: { 
        title: "មិនស្គាល់ទំព័រ"
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: () => {
        const authStore = useAuthStore();
        return authStore.isAuthenticated && authStore.user ? "/" : "/auth/login";
      },
    },
  ]
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);
  const requiresInterimToken = to.matched.some((record) => record.meta.requiresInterimToken);

  // 1. If route requires authentication
  if (requiresAuth) {
    // If not authenticated, attempt silent refresh via HttpOnly cookie first
    if (!authStore.isAuthenticated) {
      try {
        await authStore.trySilentRefresh();
      } catch (refreshErr) {
        await authStore.logout();
        return { name: "login", query: { redirect: to.fullPath } };
      }
    }

    // Verify token validity with backend and populate user profile if missing
    if (!authStore.user) {
      try {
        await authStore.getProfile();
      } catch (error) {
        console.error("Failed to load user profile in router guard:", error);
        await authStore.logout();
        return { name: "login", query: { redirect: to.fullPath } };
      }
    }

    // Role-based Access Control (RBAC)
    const userRole = authStore.user?.role;
    const roleRestrictedRecords = to.matched.filter(
      (record) => record.meta && Array.isArray(record.meta.roles)
    );

    if (roleRestrictedRecords.length > 0) {
      const hasPermission = roleRestrictedRecords.every((record) =>
        record.meta.roles.includes(userRole)
      );

      if (!hasPermission) {
        return { name: "forbidden" };
      }
    }
  }

  // 2. User IS logged in → cannot access guest pages (login, 2fa, verify-code, etc.)
  if (requiresGuest && authStore.isAuthenticated) {
    if (!authStore.user) {
      try {
        await authStore.getProfile();
      } catch {
        await authStore.logout();
        return true;
      }
    }

    const redirectPath = to.query.redirect;
    if (redirectPath && typeof redirectPath === "string" && !redirectPath.startsWith("/auth")) {
      return redirectPath;
    }
    return { name: "dashboard" };
  }

  // 3. Prevent accessing 2FA/Reset steps without a login interimToken
  if (requiresInterimToken && !authStore.interimToken) {
    return { name: "login" };
  }

  return true;
});

router.afterEach((to) => {
  const title = to.meta.title;

  document.title = title
    ? `${title} | ANT Form Management`
    : "ANT Form Management";
});

export default router
