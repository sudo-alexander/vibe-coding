#!/usr/bin/env python3
"""
Backend API Testing for Nizhny Novgorod Travel Guide
Tests all CRUD operations, authentication, and sample data initialization
"""

import requests
import json
from datetime import datetime
import base64

# Configuration
BASE_URL = "https://nizhny-guide.preview.emergentagent.com/api"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

def get_auth_headers():
    """Get HTTP Basic Auth headers for admin endpoints"""
    credentials = f"{ADMIN_USERNAME}:{ADMIN_PASSWORD}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()
    return {"Authorization": f"Basic {encoded_credentials}"}

def test_endpoint(method, endpoint, data=None, auth_required=False, description=""):
    """Generic function to test API endpoints"""
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    
    if auth_required:
        headers.update(get_auth_headers())
    
    print(f"\n{'='*60}")
    print(f"Testing: {method} {endpoint}")
    print(f"Description: {description}")
    print(f"URL: {url}")
    print(f"Auth Required: {auth_required}")
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=30)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data, timeout=30)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200 or response.status_code == 201:
            try:
                response_data = response.json()
                print(f"Response: {json.dumps(response_data, indent=2, ensure_ascii=False)}")
                return True, response_data
            except:
                print(f"Response Text: {response.text}")
                return True, response.text
        else:
            print(f"Error Response: {response.text}")
            return False, response.text
            
    except requests.exceptions.RequestException as e:
        print(f"Request Exception: {str(e)}")
        return False, str(e)

def main():
    """Main testing function"""
    print("Starting Backend API Tests for Nizhny Novgorod Travel Guide")
    print(f"Base URL: {BASE_URL}")
    
    test_results = {
        "passed": 0,
        "failed": 0,
        "details": []
    }
    
    # Test 1: Initialize Sample Data (Admin Auth Required)
    print("\n" + "="*80)
    print("TEST 1: SAMPLE DATA INITIALIZATION")
    print("="*80)
    
    success, response = test_endpoint(
        "POST", "/init-data", 
        auth_required=True,
        description="Initialize database with Russian sample content for Nizhny Novgorod"
    )
    
    if success:
        test_results["passed"] += 1
        test_results["details"].append("✅ Sample data initialization - PASSED")
    else:
        test_results["failed"] += 1
        test_results["details"].append("❌ Sample data initialization - FAILED")
    
    # Test 2: Get Places (No Auth Required)
    print("\n" + "="*80)
    print("TEST 2: PLACES ENDPOINTS")
    print("="*80)
    
    success, places_data = test_endpoint(
        "GET", "/places",
        description="Fetch all places from database"
    )
    
    if success:
        test_results["passed"] += 1
        test_results["details"].append("✅ GET /api/places - PASSED")
        print(f"Found {len(places_data) if isinstance(places_data, list) else 0} places")
    else:
        test_results["failed"] += 1
        test_results["details"].append("❌ GET /api/places - FAILED")
    
    # Test 3: Create New Place (Admin Auth Required)
    new_place_data = {
        "name": "Музей А.М. Горького",
        "description": "Литературный музей, посвященный жизни и творчеству великого русского писателя Максима Горького.",
        "category": "museum",
        "latitude": 56.3275,
        "longitude": 44.0089,
        "image_url": "https://example.com/gorky-museum.jpg"
    }
    
    success, response = test_endpoint(
        "POST", "/places",
        data=new_place_data,
        auth_required=True,
        description="Create new place with admin authentication"
    )
    
    if success:
        test_results["passed"] += 1
        test_results["details"].append("✅ POST /api/places - PASSED")
    else:
        test_results["failed"] += 1
        test_results["details"].append("❌ POST /api/places - FAILED")
    
    # Test 4: Get History Events
    print("\n" + "="*80)
    print("TEST 3: HISTORY ENDPOINTS")
    print("="*80)
    
    success, history_data = test_endpoint(
        "GET", "/history",
        description="Fetch all historical events"
    )
    
    if success:
        test_results["passed"] += 1
        test_results["details"].append("✅ GET /api/history - PASSED")
        print(f"Found {len(history_data) if isinstance(history_data, list) else 0} history events")
    else:
        test_results["failed"] += 1
        test_results["details"].append("❌ GET /api/history - FAILED")
    
    # Test 5: Create History Event (Admin Auth Required)
    new_history_data = {
        "title": "Открытие метрополитена",
        "description": "В Нижнем Новгороде открылась первая линия метрополитена, соединившая центр города с промышленными районами.",
        "year": 2012,
        "image_url": "https://example.com/metro-opening.jpg"
    }
    
    success, response = test_endpoint(
        "POST", "/history",
        data=new_history_data,
        auth_required=True,
        description="Create new history event with admin authentication"
    )
    
    if success:
        test_results["passed"] += 1
        test_results["details"].append("✅ POST /api/history - PASSED")
    else:
        test_results["failed"] += 1
        test_results["details"].append("❌ POST /api/history - FAILED")
    
    # Test 6: Get Culture Items
    print("\n" + "="*80)
    print("TEST 4: CULTURE ENDPOINTS")
    print("="*80)
    
    success, culture_data = test_endpoint(
        "GET", "/culture",
        description="Fetch all culture items"
    )
    
    if success:
        test_results["passed"] += 1
        test_results["details"].append("✅ GET /api/culture - PASSED")
        print(f"Found {len(culture_data) if isinstance(culture_data, list) else 0} culture items")
    else:
        test_results["failed"] += 1
        test_results["details"].append("❌ GET /api/culture - FAILED")
    
    # Test 7: Create Culture Item (Admin Auth Required)
    new_culture_data = {
        "title": "Семёновская матрёшка",
        "description": "Традиционная русская деревянная игрушка в виде расписной куклы, символ народного творчества Нижегородской области.",
        "category": "craft",
        "image_url": "https://example.com/matryoshka.jpg"
    }
    
    success, response = test_endpoint(
        "POST", "/culture",
        data=new_culture_data,
        auth_required=True,
        description="Create new culture item with admin authentication"
    )
    
    if success:
        test_results["passed"] += 1
        test_results["details"].append("✅ POST /api/culture - PASSED")
    else:
        test_results["failed"] += 1
        test_results["details"].append("❌ POST /api/culture - FAILED")
    
    # Test 8: Get Events
    print("\n" + "="*80)
    print("TEST 5: EVENTS ENDPOINTS")
    print("="*80)
    
    success, events_data = test_endpoint(
        "GET", "/events",
        description="Fetch all events"
    )
    
    if success:
        test_results["passed"] += 1
        test_results["details"].append("✅ GET /api/events - PASSED")
        print(f"Found {len(events_data) if isinstance(events_data, list) else 0} events")
    else:
        test_results["failed"] += 1
        test_results["details"].append("❌ GET /api/events - FAILED")
    
    # Test 9: Create Event (Admin Auth Required)
    new_event_data = {
        "title": "Фестиваль народных промыслов",
        "description": "Ежегодный фестиваль, демонстрирующий традиционные ремёсла и искусства Нижегородской области.",
        "date": "2024-07-15",
        "location": "Нижегородский кремль",
        "category": "festival"
    }
    
    success, response = test_endpoint(
        "POST", "/events",
        data=new_event_data,
        auth_required=True,
        description="Create new event with admin authentication"
    )
    
    if success:
        test_results["passed"] += 1
        test_results["details"].append("✅ POST /api/events - PASSED")
    else:
        test_results["failed"] += 1
        test_results["details"].append("❌ POST /api/events - FAILED")
    
    # Test 10: Submit Contact Message (No Auth Required)
    print("\n" + "="*80)
    print("TEST 6: CONTACT ENDPOINTS")
    print("="*80)
    
    contact_message_data = {
        "name": "Анна Петрова",
        "email": "anna.petrova@example.com",
        "message": "Здравствуйте! Очень интересный сайт о Нижнем Новгороде. Хотелось бы узнать больше о экскурсиях по кремлю. Спасибо!"
    }
    
    success, response = test_endpoint(
        "POST", "/contact",
        data=contact_message_data,
        description="Submit contact message (no authentication required)"
    )
    
    if success:
        test_results["passed"] += 1
        test_results["details"].append("✅ POST /api/contact - PASSED")
    else:
        test_results["failed"] += 1
        test_results["details"].append("❌ POST /api/contact - FAILED")
    
    # Test 11: Get Contact Messages (Admin Auth Required)
    success, contact_data = test_endpoint(
        "GET", "/contact",
        auth_required=True,
        description="Fetch all contact messages with admin authentication"
    )
    
    if success:
        test_results["passed"] += 1
        test_results["details"].append("✅ GET /api/contact - PASSED")
        print(f"Found {len(contact_data) if isinstance(contact_data, list) else 0} contact messages")
    else:
        test_results["failed"] += 1
        test_results["details"].append("❌ GET /api/contact - FAILED")
    
    # Test 12: Test Authentication (Should fail without credentials)
    print("\n" + "="*80)
    print("TEST 7: AUTHENTICATION VERIFICATION")
    print("="*80)
    
    success, response = test_endpoint(
        "POST", "/places",
        data=new_place_data,
        auth_required=False,  # Intentionally no auth
        description="Test admin endpoint without authentication (should fail)"
    )
    
    if not success and "401" in str(response):
        test_results["passed"] += 1
        test_results["details"].append("✅ Authentication protection - PASSED")
        print("✅ Authentication properly blocks unauthorized access")
    else:
        test_results["failed"] += 1
        test_results["details"].append("❌ Authentication protection - FAILED")
        print("❌ Authentication not working properly")
    
    # Final Results Summary
    print("\n" + "="*80)
    print("FINAL TEST RESULTS SUMMARY")
    print("="*80)
    
    total_tests = test_results["passed"] + test_results["failed"]
    success_rate = (test_results["passed"] / total_tests * 100) if total_tests > 0 else 0
    
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {test_results['passed']}")
    print(f"Failed: {test_results['failed']}")
    print(f"Success Rate: {success_rate:.1f}%")
    
    print("\nDetailed Results:")
    for detail in test_results["details"]:
        print(f"  {detail}")
    
    if test_results["failed"] == 0:
        print("\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
        return True
    else:
        print(f"\n⚠️  {test_results['failed']} tests failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    main()