import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore';
import LoginView from '@/views/auth/LoginView.vue';
import ResetPassword from '@/views/auth/ResetPasswordView.vue';
import TwoFAView from '@/views/auth/TwoFAView.vue';
import VerifyCodeView from '@/views/auth/VerifyCodeView.vue';
// Dashboard
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import DashboardView from "@/views/pages/dashboard/DashboardView.vue";

import UserView from '@/views/pages/super-admin/users/UserView.vue';
import ActivityLogView from '@/views/pages/super-admin/activity-logs/ActivityLogView.vue';

import AllApplicationView from '@/views/pages/admin/application-review/AllApplicationView.vue';
import PassedApplicationView from '@/views/pages/admin/application-review/PassedApplicationView.vue';
import FailedApplicationView from '@/views/pages/admin/application-review/FailedApplicationView.vue';
import ApplicationReview from '@/views/pages/admin/application-review/ApplicationReview.vue';
import ShortlistView from '@/views/pages/admin/shortlisted/shortlistView.vue';
import Blacklist from '@/views/pages/admin/blacklisted/Blacklist.vue';
import FinalResultView from '@/views/pages/admin/final-results/FinalResultView.vue';


import StudentView from '@/views/pages/Teacher/studentList/StudentView.vue';
import ProfileView from '@/views/pages/profile/ProfileView.vue';

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
      },
    },

    {
      path: "/auth/verify-code",
      name: "verify-code",
      component: VerifyCodeView,
      meta: {
        title: "ផ្ទៀងផ្ទាត់កូដ",
        requiresGuest: true,
      },
    },

    {
      path: "/auth/reset-password",
      name: "reset-password",
      component: ResetPassword,
      meta: {
        title: "កំណត់ពាក្យសម្ងាត់ឡើងវិញ",
        requiresGuest: true,
      },
    },

    {
      path: "/",
      component: DefaultLayout,

      children: [
        {
          path: "",
          name: "dashboard",
          component: DashboardView,
          meta: {
            title: "ផ្ទាំងគ្រប់គ្រង",
            requiresAuth: true,
          },
        },

        {
          path: "users",
          name: "users",
          component: UserView,
          meta: {
            title: "អ្នកប្រើប្រាស់",
            requiresAuth: true,
          },
        },

        {
          path: "activity-logs",
          name: "activity-logs",
          component: ActivityLogView,
          meta: {
            title: "កំណត់ហេតុសកម្មភាព",
            requiresAuth: true,
          },
        },
        {
          path: "/all-application",
          children: [
            {
              path: "",
              name: "all-application",
              component: AllApplicationView,
            },
            {
              path: "passed",
              name: "passed-application",
              component: PassedApplicationView,
            },
            {
              path: "failed",
              name: "failed-application",
              component: FailedApplicationView,
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
          },
        },

        {
          path: "shortlisted",
          name: "shortlisted",
          component: ShortlistView,
          meta: {
            title: "បញ្ជីសម្រាំង",
            requiresAuth: true,
          },
        },
        {
          path: "blacklisted",
          name: "blacklisted",
          component: Blacklist,
          meta: {
            title: "បញ្ជីសម្រាំង",
            requiresAuth: true,
          },
        },
        {
          path: "final-results",
          name: "final-results",
          component: FinalResultView,
          meta: {
            title: "លទ្ធផលចុងក្រោយ",
            requiresAuth: true,
          },
        },
        {
          path: "student-lists",
          name: "student-lists",
          component: StudentView,
          meta: {
            title: "បញ្ជីសិស្ស",
            requiresAuth: true,
          },
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: {
            title: "ប្រវត្តិរូប",
            requiresAuth: true,
          },
        },
      ],
    },
  ]
})
router.beforeEach((to) => {
  const authStore = useAuthStore();

  const isAuthenticated = authStore.isAuthenticated;

  console.log("Route:", to.fullPath);
  console.log("Authenticated:", isAuthenticated);

  // User is NOT logged in → cannot access protected pages
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: "login" };
  }

  // User IS logged in → cannot access auth pages
  if (to.meta.requiresGuest && isAuthenticated) {
    return { name: "dashboard" };
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
