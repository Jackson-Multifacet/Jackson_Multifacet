# Jackson Multifacet - AI Coding Agent Instructions

## Project Overview

Jackson Multifacet is a **Django + React platform** that integrates three core business domains into a single unified system:

- **Service Catalog & Order Management**: E-commerce-like system for offering services (web dev, consulting, etc.)
- **Job Recruitment Platform**: Complete hiring lifecycle (job posting, applications, candidate management)
- **Payment & Communication System**: Payment processing, invoicing, and user messaging

The pseudocode specification in `jackson_multifacet_pseudocode.txt` is the **source of truth** for models, business logic, and data flows—refer to it frequently.

## Architecture

### Backend Structure (Django)
- **Config**: `backend/config/` - Settings, URL routing, WSGI/ASGI
- **Apps**: `backend/apps/` - Six domain-specific Django apps:
  - `users/` - Custom user model, authentication, profiles
  - `services/` - Service catalog, packages, pricing
  - `recruitment/` - Job postings, applications, candidates
  - `projects/` - Service orders, milestones, file management
  - `payments/` - Payment processing, invoices, transactions
  - `communications/` - Messaging, notifications, reviews

### Key Architectural Principles

1. **Domain-Driven Apps**: Each app is a logical business domain with its own models, views, and tests. Don't cross-pollinate logic between apps.
2. **Custom User Model**: Uses `AbstractUser` (extend in `users/models.py`). All auth queries reference this single model.
3. **Status Workflows**: Models use `status` choice fields to track state (e.g., `ServiceOrder.status` in {PENDING, IN_PROGRESS, REVIEW, COMPLETED, CANCELLED}).
4. **Auto-Generated Identifiers**: `order_number` and `invoice_number` use custom generation logic (see pseudocode).

## Development Workflow

### Running Django
```bash
cd backend
python manage.py runserver  # Default: http://localhost:8000
python manage.py migrate    # Apply database migrations
python manage.py makemigrations <app_name>  # Create migrations after model changes
```

### Key Django Commands
- `python manage.py shell` - Interactive Python shell with Django context
- `python manage.py test apps.<app_name>` - Run app-specific tests
- `python manage.py createsuperuser` - Create admin user

### Database
- Currently **SQLite** (`db.sqlite3`) for development
- Models haven't been implemented yet—they live in pseudocode
- When implementing models, update `INSTALLED_APPS` in `settings.py` to register apps

## Model Implementation Patterns

When creating models in any app:

1. **Always include timestamps**: `created_at` and `updated_at` auto-timestamps
2. **Use choice fields for state**: Status, types, payment methods—use Django's `choices` parameter
3. **Add string representations**: Implement `__str__()` methods consistently
4. **Foreign keys**: Use `ForeignKey(to_model)` with `on_delete=models.CASCADE` or `PROTECT` (depends on business logic)
5. **Custom methods**: Business logic (e.g., `mark_as_completed()`, `close_job()`) goes in model methods, not views

**Example pattern** (from pseudocode):
```python
class ServiceOrder(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('REVIEW', 'Review'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    order_number = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def mark_as_completed(self):
        self.status = 'COMPLETED'
        self.completion_date = timezone.now()
        self.save()
```

## View & API Patterns

When building views:

1. **Input Validation**: Validate all POST/PUT data before processing
2. **Permission Checks**: Always validate user role (`user_type` field) before sensitive operations
3. **JSON Responses**: Return structured JSON with `success`, `data`, and `error` keys
4. **Notifications**: Operations like order creation, status changes, and payments should trigger notifications
5. **Email Notifications**: Certain events (order confirmation, application rejection) require email notifications

**Example view pattern**:
```python
def create_order(request):
    # Validate auth
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    
    # Extract & validate data
    service_id = request.POST.get('service_id')
    if not service_id:
        return JsonResponse({'error': 'service_id required'}, status=400)
    
    # Business logic
    service = Service.objects.get(id=service_id)
    order = ServiceOrder.objects.create(
        client=request.user,
        service=service,
        status='PENDING'
    )
    
    # Create notification
    Notification.objects.create(user=request.user, title="Order Created")
    
    return JsonResponse({'success': True, 'data': {...}})
```

## Frontend Structure (React)

Located in `frontend/` (not fully scaffolded yet):

- **Routes**: Reference `jackson_multifacet_pseudocode.txt` section 3.1 for complete routing map
- **Components**: Organize by feature (ServiceCard, JobList, OrderDetail, etc.)
- **API Service**: Centralized Axios wrapper for all backend calls
- **State Management**: TBD (Redux, Context, or Zustand—document when implemented)

## Cross-Component Integration Patterns

1. **User Type Gating**: Always check `user.user_type` in {CLIENT, CANDIDATE, SERVICE_PROVIDER, ADMIN} before rendering features
2. **Order Context**: `ServiceOrder` is the central hub; `OrderFile`, `OrderMilestone`, `Message` all reference it
3. **Notification Triggers**: Status changes trigger notifications → stored in `Notification` model → consumed by frontend
4. **Payment Flow**: Order creation → payment request → `Payment` record → `Invoice` generation → email receipt

## Common Gotchas & Edge Cases

- **Circular Dependencies**: Don't import app A views in app B; use model relationships via ForeignKey
- **Duplicate Applications**: Job application view must check if candidate already applied
- **Order Cancellation**: Only allowed in certain statuses (PENDING, IN_PROGRESS)—validate before allowing
- **Payment Refunds**: Refund logic must update both `Payment.status` and `ServiceOrder.payment_status`
- **Settings Gaps**: `INSTALLED_APPS` doesn't include the custom apps yet—add them when implementing

## Testing Strategy

- Each app has `tests.py`; use Django's `TestCase` class
- Test model methods, views, and permission checks
- Run: `python manage.py test apps.<app_name>`

## Documentation References

- **Pseudocode**: `jackson_multifacet_pseudocode.txt` (949 lines)—the complete specification
- **Settings**: `backend/config/settings.py` (118 lines)—Django configuration
- **Django Docs**: https://docs.djangoproject.com/en/6.0/

---

**Last Updated**: December 8, 2025
