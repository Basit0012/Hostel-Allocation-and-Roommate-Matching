"""
Tests for REST API endpoints.
"""
import datetime
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from apps.academics.models import (
    University,
    Department,
    DegreeProgram,
    Branch,
    AdmissionBatch,
    StudentRegistry,
    Gender,
)
from apps.applications.models import AccommodationCycle
from apps.hostels.models import Hostel, GenderPolicy, HostelStatus
from apps.roommates.models import RoommatePreference, FoodPreference, RoommateRequest, RequestStatus
from apps.students.models import StudentProfile

User = get_user_model()


class ApiEndpointsTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_api_health_check(self):
        resp = self.client.get(reverse('api:health_check'))
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data['status'], 'healthy')
        self.assertEqual(data['database'], 'connected')

    def test_api_auth_me_unauthenticated(self):
        resp = self.client.get(reverse('api:auth_me'))
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertFalse(data['authenticated'])
        self.assertIsNone(data['user'])
        self.assertIn('csrf_token', data)

    def test_api_hostels_list(self):
        resp = self.client.get(reverse('api:hostels_list'))
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn('hostels', data)
        self.assertIsInstance(data['hostels'], list)

    def test_api_rooms_catalog(self):
        resp = self.client.get(reverse('api:rooms_catalog'))
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn('rooms', data)
        self.assertIsInstance(data['rooms'], list)

    def test_api_dashboard_summary(self):
        resp = self.client.get(reverse('api:dashboard_summary'))
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn('campus', data)
        self.assertIn('total_hostels', data['campus'])

    def test_api_csrf_token(self):
        resp = self.client.get(reverse('api:auth_csrf'))
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn('csrfToken', data)
        self.assertTrue(bool(data['csrfToken']))

    def test_api_economics_calculator_get(self):
        resp = self.client.get(reverse('api:economics_calculator'), {
            'category': 'STANDARD',
            'seater_count': 2,
            'cooling_type': 'AIR_CONDITIONED',
            'is_edb_eligible': 'true',
            'mess_cuisine': 'NORTH_INDIAN',
            'meal_plan': 'FOUR_MEAL',
            'estimated_kwh': '800.00',
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn('pricing', data)
        self.assertIn('electricity', data)
        self.assertIn('mess', data)
        # Check EDB savings is 10,000
        self.assertEqual(data['pricing']['edb_savings'], 10000.0)
        self.assertEqual(data['pricing']['applicable_hostel_fee'], 133000.0)
        # 800 kWh exceeds 750 kWh quota by 50 units
        self.assertEqual(data['electricity']['overage_kwh'], 50.0)
        self.assertEqual(data['electricity']['per_resident_share'], 212.5) # 50 * 8.5 / 2

    def test_api_gatepass_unauthenticated(self):
        resp = self.client.get(reverse('api:gatepass_list'))
        self.assertEqual(resp.status_code, 401)

    def test_api_rms_tickets_unauthenticated(self):
        resp = self.client.get(reverse('api:rms_tickets'))
        self.assertEqual(resp.status_code, 401)

    def test_spa_view_serves_html(self):
        resp = self.client.get(reverse('spa_root'))
        self.assertIn(resp.status_code, (200, 302))
        if resp.status_code == 200:
            self.assertIn('root', resp.content.decode())

    def test_api_roommates_discover_returns_recommendations(self):
        univ = University.objects.create(name='LPU Test', code='LPU-API')
        dept = Department.objects.create(university=univ, name='CSE', code='CSE')
        prog = DegreeProgram.objects.create(department=dept, name='B.Tech', duration_years=4)
        branch = Branch.objects.create(program=prog, name='Computer Science', code='CS')
        batch = AdmissionBatch.objects.create(program=prog, year=2024)

        reg_a = StudentRegistry.objects.create(
            student_id='API001', full_name='Student A', institutional_email='api_a@lpu.in',
            gender=Gender.MALE, date_of_birth=datetime.date(2004, 1, 1), branch=branch, batch=batch
        )
        reg_b = StudentRegistry.objects.create(
            student_id='API002', full_name='Student B', institutional_email='api_b@lpu.in',
            gender=Gender.MALE, date_of_birth=datetime.date(2004, 2, 2), branch=branch, batch=batch
        )
        user_a = User.objects.create_user(email='api_a@lpu.in', password='Password123!', student_id_login='API001')
        user_b = User.objects.create_user(email='api_b@lpu.in', password='Password123!', student_id_login='API002')
        student_a = StudentProfile.objects.create(user=user_a, registry=reg_a)
        student_b = StudentProfile.objects.create(user=user_b, registry=reg_b)

        cycle = AccommodationCycle.objects.create(
            academic_year='2026-2027',
            semester=1,
            name='Fall 2026',
            application_start=timezone.now() - datetime.timedelta(days=1),
            application_end=timezone.now() + datetime.timedelta(days=10),
            is_active=True,
        )
        RoommatePreference.objects.create(
            student=student_a, sleeping_schedule=3, cleanliness=4, study_habits=3,
            noise_tolerance=3, food_preference=FoodPreference.VEGETARIAN,
            social_preference=3, temperature_pref=3
        )
        RoommatePreference.objects.create(
            student=student_b, sleeping_schedule=3, cleanliness=4, study_habits=3,
            noise_tolerance=3, food_preference=FoodPreference.VEGETARIAN,
            social_preference=3, temperature_pref=3
        )
        RoommateRequest.objects.create(
            sender=student_a,
            receiver=student_b,
            cycle=cycle,
            status=RequestStatus.PENDING,
        )

        self.client.force_login(user_a)
        resp = self.client.get(reverse('api:roommates_discover'))
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data['has_preferences'])
        self.assertEqual(len(data['recommendations']), 1)
        rec = data['recommendations'][0]
        self.assertEqual(rec['student_id'], 'API002')
        self.assertEqual(rec['score'], 100.0)
        self.assertTrue(rec['has_pending_request'])

        search_resp = self.client.get(reverse('api:roommates_discover'), {'q': 'API002'})
        self.assertEqual(search_resp.status_code, 200)
        search_data = search_resp.json()
        self.assertIsNotNone(search_data['search_result'])
        self.assertEqual(search_data['search_result']['student_id'], 'API002')
        self.assertEqual(search_data['search_result']['score'], 100.0)
        self.assertTrue(search_data['search_result']['has_pending_request'])

    def test_api_auth_register_validates_phone_and_logs_in(self):
        univ = University.objects.create(name='LPU Reg Test', code='LPU-REG')
        dept = Department.objects.create(university=univ, name='CSE', code='CSE')
        prog = DegreeProgram.objects.create(department=dept, name='B.Tech', duration_years=4)
        branch = Branch.objects.create(program=prog, name='Computer Science', code='CS')
        batch = AdmissionBatch.objects.create(program=prog, year=2024)

        StudentRegistry.objects.create(
            student_id='REG001',
            full_name='Reg Student',
            institutional_email='reg001@lpu.in',
            gender=Gender.MALE,
            date_of_birth=datetime.date(2004, 1, 1),
            branch=branch,
            batch=batch,
        )

        bad_resp = self.client.post(
            reverse('api:auth_register'),
            data={
                'student_id': 'REG001',
                'institutional_email': 'reg001@lpu.in',
                'password': 'Password123!',
                'confirm_password': 'Password123!',
                'emergency_contact_phone': 'invalid-phone',
            },
            content_type='application/json',
        )
        self.assertEqual(bad_resp.status_code, 400)
        self.assertIn('emergency_contact_phone', bad_resp.json().get('errors', {}))

        ok_resp = self.client.post(
            reverse('api:auth_register'),
            data={
                'student_id': 'REG001',
                'institutional_email': 'reg001@lpu.in',
                'password': 'Password123!',
                'confirm_password': 'Password123!',
                'emergency_contact_name': 'Parent Name',
                'emergency_contact_phone': '+91 9876543210',
            },
            content_type='application/json',
        )
        self.assertEqual(ok_resp.status_code, 201)
        self.assertTrue(ok_resp.json()['success'])

        me_resp = self.client.get(reverse('api:auth_me'))
        self.assertEqual(me_resp.status_code, 200)
        self.assertTrue(me_resp.json()['authenticated'])

