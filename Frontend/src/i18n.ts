import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import CalendarPage from './pages/CalendarPage';
import ne from './translations/ne';
import vi from './translations/vi';

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  interpolation: {    escapeValue: false},
  resources: {
    en: {
        LandingPage: {
        translation: {
            "welcome": "Welcome to the Personalized Study Planner!",
            "landing.description": "Organize your studies, track your progress, and achieve your academic goals",
            "landing.features.taskManagement.title": "Task Management",
            "landing.features.taskManagement.description": "Create, organize, and track your study tasks efficiently",
            "landing.features.calendar.title": "Calendar View",
            "landing.features.calendar.description": "Visualize deadlines and plan your study schedule",
            "landing.features.collaboration.title": "Collaboration",
            "landing.features.collaboration.description": "Share tasks and collaborate with study partners",
            "landing.cta.getStarted": "Get Started",
            "landing.cta.alreadyHaveAccount": "Already have an account?",
            "landing.cta.signIn": "Sign in"

        }
    },
        LoginPage: {
            translation: {
                "login.title": "Welcome Back!",
                "login.description": "Please sign in to continue organizing your studies",
                "login.googleButton": "Continue with Google",
                "login.altButton": "OR CONTINUE WITH EMAIL",
                "login.email": "Email",
                "login.password": "Password",
                "login.button": "Sign In",
                "login.noAccount": "Don't have an account?",
                "login.signUp": "Sign Up",
                "login.demoNote": "Demo app – any email will work for testing"
        }
    },
        SignupPage: {
            translation: {
                "signup.title": "Create Your Account",
                "signup.description": "Start organizing your studies and tracking your progress",
                "signup.googleButton": "Sign up with Google",
                "signup.altButton": "OR SIGN UP WITH EMAIL",
                "signup.name": "Full Name",
                "signup.email": "Email",
                "signup.password": "Password",
                "signup.button": "Create Account",
                "signup.alreadyHaveAccount": "Already have an account?",
                "signup.signIn": "Sign in",
                "signup.demoNote": "Demo app – any name and email will work for testing"
            }

        }
    },
        DashboardPage: {
            translation: {
                "dashboard.title": "Your Study Dashboard",

        }
    },
        NotFoundPage: {
            translation: {
                "notfound.title": "Page Not Found",
                "notfound.description": "The page you are looking for does not exist.",
                "notfound.backToHome": "Back to Home"
        }
    },
        ProfilePage: {
            translation: {
                "profile.title": "Your Profile",
                "profile.name": "Name",
                "profile.email": "Email",
                "profile.updateButton": "Update Profile",
                "fname.name": "First Name",
                "lname.name": "Last Name",
        }
    },
        CalendarPage: {
            translation: {
                "calendar.title": "Your Study Calendar",
                "addevent.title": "Add New Event",
                "addevent.name": "Event Name",
                "addevent.date": "Event Date",
                "addevent.type": "Event Type",
                "addevent.saveButton": "Save Event",
                "addevent.cancelButton": "Cancel",
                "eventtype.class": "Class",
                "eventtype.study": "Study Session",
                "eventtype.exam": "Exam",
                "eventtype.other": "Other",
                "eventtype.amounts": "no tasks or events scheduled for this day.",
        }
    },
        layout: {
            translation: {
                "layout.title": "Study Planner",
                "dashboard.title": "Dashboard",
                "calendar.title": "Calendar",
                "profile.title": "Profile",
                "logout.title": "Logout"
            }
    },
  },
}
);

export default i18n;