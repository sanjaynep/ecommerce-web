from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import HttpResponse
from django.db.models import Q
from .models import Report, Product
import re
import logging

# Configure logging
logger = logging.getLogger(__name__)

def index(request):
    query = request.GET.get('q', '').strip()  # Strip leading/trailing spaces

    if query:
        # Log the raw query
        logger.info(f"Raw search query: '{query}'")

        # Search by product title (case insensitive)
        products = Product.objects.filter(title__icontains=query)
        
        # Log the query and results
        logger.info(f"Query: '{query}'")
        logger.info(f"Products found: {[product.title for product in products]}")
    else:
        # Show all products if no search query
        products = Product.objects.all()
        logger.info("No search query provided. Showing all products.")

    context = {
        'products': products,
        'query': query,
    }

    # If it's an AJAX request, return just the products grid
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'products_partial.html', context)

    return render(request, 'index.html', context)

def services(request):
    return render(request, 'services.html')

def help(request):
    return render(request, 'help.html')

def about(request):
    return render(request, 'about_us.html')

def terms_of_use(request):
    return render(request, 'terms.html')

def privacy(request):
    return render(request, 'privacy.html')

def return_policy(request):
    return render(request, 'return.html')

def warranty(request):
    return render(request, 'warranty.html')

def contact_us(request):
    return render(request, 'contact_us.html')

def validate_form_data(data):
    """Validate form data and return list of errors"""
    errors = []
    
    # Validate required fields
    if not data['firstName'] or len(data['firstName']) < 2:
        errors.append('First name is required and must be at least 2 characters.')
    
    if not data['lastName'] or len(data['lastName']) < 2:
        errors.append('Last name is required and must be at least 2 characters.')
    
    if not data['email']:
        errors.append('Email address is required.')
    elif not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', data['email']):
        errors.append('Please enter a valid email address.')
    
    if data['phone'] and not re.match(r'^[\d\s\-\+\(\)]{10,}$', data['phone']):
        errors.append('Please enter a valid phone number.')
    
    if not data['subject']:
        errors.append('Please select a subject.')
    
    if not data['message'] or len(data['message']) < 10:
        errors.append('Message is required and must be at least 10 characters.')
    elif len(data['message']) > 1000:
        errors.append('Message cannot exceed 1000 characters.')
    
    if not data['privacy']:
        errors.append('You must agree to the Privacy Policy and Terms of Use.')
    
    return errors

def report(request):
    """Handle report/contact form GET and POST requests"""
    
    if request.method == 'POST':
        # Get form data from POST request
        form_data = {
            'firstName': request.POST.get('firstName', '').strip(),
            'lastName': request.POST.get('lastName', '').strip(),
            'email': request.POST.get('email', '').strip(),
            'phone': request.POST.get('phone', '').strip(),
            'subject': request.POST.get('subject', ''),
            'address': request.POST.get('address', '').strip(),
            'message': request.POST.get('message', '').strip(),
            'newsletter': 'newsletter' in request.POST,
            'privacy': 'privacy' in request.POST,
        }
        
        # Validate form data FIRST
        errors = validate_form_data(form_data)
        
        if not errors:
            try:
                # Save to database (only once and after validation)
                full_name = f"{form_data['firstName']} {form_data['lastName']}"
                report_instance = Report(
                    name=full_name,
                    email=form_data['email'],
                    phone=form_data['phone'],
                    subject=form_data['subject'],
                    message=form_data['message'],
                    address=form_data['address']
                )
                report_instance.save()
                
                # Show success message
                messages.success(request, 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.')
                return redirect('report')  # Redirect to prevent resubmission
                
            except Exception as e:
                messages.error(request, f'Sorry, there was an error saving your message: {str(e)}')
        else:
            # If there are validation errors, show them
            for error in errors:
                messages.error(request, error)
            
            # Return form with submitted data to preserve user input
            return render(request, 'report.html', {'form_data': form_data})
    
    # GET request - show empty form
    return render(request, 'report.html', {})