import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import DashboardPage from '../pages/DashboardPage'
import ForbiddenPage from '../pages/ForbiddenPage'
import LoginPage from '../pages/LoginPage'
import ProtectedRoute from './ProtectedRoute'
import { ADMIN_ROLES } from '../types'
import TeamDetailsPage from '../pages/teams/TeamDetailsPage'
import TeamsPage from '../pages/teams/TeamsPage'
import TrainingDetailsPage from '../pages/trainings/TrainingDetailsPage'
import TrainingsPage from '../pages/trainings/TrainingsPage'
import SessionParticipantsPage from '../pages/sessions/SessionParticipantsPage'
import MyHistoryPage from '../pages/technician/MyHistoryPage'
import MyTrainingsPage from '../pages/technician/MyTrainingsPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/403" element={<ForbiddenPage />} />
                        <Route path="*" element={<NotFoundPage />} />

                        <Route element={<ProtectedRoute allowedRoles={ADMIN_ROLES} />}>
                            <Route path="/teams" element={<TeamsPage />} />
                            <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
                            <Route path="/trainings" element={<TrainingsPage />} />
                            <Route path="/trainings/:trainingId" element={<TrainingDetailsPage />} />
                            <Route path="/sessions" element={<SessionsPage />} />
                            <Route path="/sessions/:sessionId/participants" element={<SessionParticipantsPage />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['TECHNICIAN']} />}>
                            <Route path="/me/todo" element={<MyTrainingsPage />} />
                            <Route path="/me/history" element={<MyHistoryPage />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}